import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import {
  createDefaultUsers,
  login,
  setupContainers,
  startApp,
  teardownContainers,
} from './setup';
import { JwtService } from '@nestjs/jwt';

const API_PREFIX = 'project';
const NEO_PORT = 27876;
const RABBIT_PORT = 20486;

describe('Project (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let existProjectId: string;
  let token: string;

  beforeAll(
    async () => await setupContainers(NEO_PORT, RABBIT_PORT),
    20 * 1000,
  );
  afterAll(teardownContainers, 20 * 1000);

  beforeEach(async () => {
    const result = await startApp(NEO_PORT, RABBIT_PORT);
    app = result.app;
    configService = result.configService;
  });

  afterEach(async () => {
    await app.close();
  });

  it(`Create project`, async () => {
    await createDefaultUsers(app);

    token = await login(app, 'Alice');

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
      .set('Cookie', token)
      .send({
        roleNames: ['admin'],
      })
      .expect(201);
  });

  it(`Get user projects`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/${API_PREFIX}/user`)
      .set('Cookie', token)
      .expect(200);

    const data = res.body[0];
    expect(data).toHaveProperty('slogan', 'funny');
  });

  it(`Update property value`, () => {
    return request(app.getHttpServer())
      .patch(`/${API_PREFIX}/${existProjectId}/propertyValue`)
      .set('Cookie', token)
      .send({
        username: 'Alice',
        propertyName: 'prize',
        propertyValue: 5000,
      })
      .expect(200);
  });

  it(`Update property value`, () => {
    return request(app.getHttpServer())
      .patch(`/${API_PREFIX}/${existProjectId}/propertyValue`)
      .send({
        propertyName: 'prize',
        propertyValue: 5000,
      })
      .expect(401);
  });

  it(`Update property value not exist`, async () => {
    const res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}/notExist/propertyValue`)
      .set('Cookie', token)
      .send({
        propertyName: 'prize',
        propertyValue: 5000,
      })
      .expect(403);

    expect(res.body).toHaveProperty('message', 'Forbidden resource');
  });

  it(`Update property unauthorized`, async () => {
    const jwtService = new JwtService({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: '1h',
      },
    });
    const InvalidToken = jwtService.sign({ username: 'inValid', id: 'id' });
    const res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}/${existProjectId}/propertyValue`)
      .set('Cookie', `token=${InvalidToken}`)
      .send({
        propertyName: 'prize',
        propertyValue: 5000,
      })
      .expect(401);

    expect(res.body).toHaveProperty('message', 'Invalid user');
  });

  it(`Update property name`, () => {
    return request(app.getHttpServer())
      .patch(`/${API_PREFIX}/${existProjectId}/name/propertyName`)
      .set('Cookie', token)
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
      .set('Cookie', token)
      .send({
        username: 'Alice',
        propertyName: 'slogan',
      })
      .expect(200);
  });

  it(`Get projects update value`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/${API_PREFIX}/${existProjectId}`)
      .set('Cookie', token)
      .expect(200);

    const data = res.body;
    expect(data).toHaveProperty('$$', 5000);
    expect(data).not.toHaveProperty('slogan');
  });

  it(`Delete project`, () => {
    return request(app.getHttpServer())
      .delete(`/${API_PREFIX}/${existProjectId}`)
      .set('Cookie', token)
      .expect(200);
  });

  it(`Get projects deleted`, async () => {
    await request(app.getHttpServer())
      .get(`/${API_PREFIX}/${existProjectId}`)
      .set('Cookie', token)
      .expect(403);
  });
});
