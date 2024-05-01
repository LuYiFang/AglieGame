import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import {
  createDefaultUsers,
  setupContainers,
  startApp,
  teardownContainers,
} from './setup';

const API_PREFIX = 'project';
const NEO_PORT = 27876;
const RABBIT_PORT = 20486;

describe('Project (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let existProjectId: string;

  beforeAll(
    async () => await setupContainers(NEO_PORT, RABBIT_PORT),
    20 * 1000,
  );
  afterAll(teardownContainers, 20 * 1000);

  beforeEach(async () => {
    const result = await startApp(NEO_PORT, RABBIT_PORT);
    app = result.app;
  });

  afterEach(async () => {
    await app.close();
  });

  it(`Create project`, async () => {
    await createDefaultUsers(app);

    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}`)
      .send({
        username: 'Alice',
        name: 'newProject',
        properties: { prize: 1000, slogan: 'fun' },
      })
      .expect(201);

    expect(res.body).toHaveProperty('projectId');

    existProjectId = res.body.projectId;

    await request(app.getHttpServer())
      .post(`/${API_PREFIX}`)
      .send({
        username: 'Alice',
        name: 'antherProject',
        properties: { prize: 2000, slogan: 'funny' },
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/permission/project/${existProjectId}/user/Bob/roles`)
      .send({
        roleNames: ['admin'],
      })
      .expect(201);
  });

  it(`Get user projects`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/${API_PREFIX}/user/Alice`)
      .expect(200);

    const data = res.body[0];
    expect(data).toHaveProperty('slogan', 'funny');
  });

  it(`Update property value`, () => {
    return request(app.getHttpServer())
      .patch(`/${API_PREFIX}/${existProjectId}/propertyValue`)
      .send({
        username: 'Alice',
        propertyName: 'prize',
        propertyValue: 5000,
      })
      .expect(200);
  });

  it(`Update property value not exist`, async () => {
    const res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}/notExist/propertyValue`)
      .send({
        username: 'Alice',
        propertyName: 'prize',
        propertyValue: 5000,
      })
      .expect(400);

    expect(res.body).toHaveProperty('message', 'Project does not exist');
  });

  it(`Update property unauthorized`, async () => {
    const res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}/${existProjectId}/propertyValue`)
      .send({
        username: 'invalid',
        propertyName: 'prize',
        propertyValue: 5000,
      })
      .expect(401);

    expect(res.body).toHaveProperty('message', 'User does not have permission');
  });

  it(`Update property name`, () => {
    return request(app.getHttpServer())
      .patch(`/${API_PREFIX}/${existProjectId}/name/propertyName`)
      .send({
        username: 'Alice',
        propertyName: 'prize',
        newPropertyName: '$$',
      })
      .expect(200);
  });

  it(`Delete property`, () => {
    return request(app.getHttpServer())
      .delete(`/${API_PREFIX}/${existProjectId}/property`)
      .send({
        username: 'Alice',
        propertyName: 'slogan',
      })
      .expect(200);
  });

  it(`Get projects update value`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/${API_PREFIX}/${existProjectId}`)
      .expect(200);

    const data = res.body;
    expect(data).toHaveProperty('$$', 5000);
    expect(data).not.toHaveProperty('slogan');
  });

  it(`Delete property`, () => {
    return request(app.getHttpServer())
      .delete(`/${API_PREFIX}/${existProjectId}`)
      .expect(200);
  });

  it(`Get projects deleted`, async () => {
    await request(app.getHttpServer())
      .get(`/${API_PREFIX}/${existProjectId}`)
      .expect(200)
      .expect({});
  });
});
