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

const API_PREFIX = 'permission';
const NEO_PORT = 27879;
const RABBIT_PORT = 20488;

describe('PermissionController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let existProjectId: string;
  let anotherProjectId: string;
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

  it(`Get all permissions`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}`)
      .expect(200)
      .expect(_.sortBy(configService.get('DEFAULT_PERMISSIONS').split(',')));
  });

  it(`Create role (POST)`, async () => {
    await createDefaultUsers(app);

    token = await login(app, 'Alice');

    let res = await request(app.getHttpServer())
      .post(`/project`)
      .send({
        username: 'Alice',
        name: 'anotherProject',
        properties: { prize: 1000, slogan: 'fun' },
      })
      .expect(201);
    anotherProjectId = res.body.projectId;

    res = await request(app.getHttpServer())
      .post(`/project`)
      .send({
        username: 'Alice',
        name: 'existProject',
        properties: { prize: 1000, slogan: 'fun' },
      })
      .expect(201);

    expect(res.body).toHaveProperty('projectId');
    existProjectId = res.body.projectId;

    await Promise.all(
      _.map(['DM', 'player', 'NPC'], (role) => {
        return request(app.getHttpServer())
          .post(`/${API_PREFIX}/role`)
          .set('Cookie', token)
          .send({
            projectId: existProjectId,
            name: role,
            permissions: role === 'DM' ? ['read', 'write'] : ['read'],
          })
          .expect(201);
      }),
    );

    await request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .set('Cookie', token)
      .send({
        projectId: anotherProjectId,
        name: 'player',
        permissions: ['read'],
      })
      .expect(201);
  });

  it(`Create role project not exist`, async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .set('Cookie', token)
      .send({
        projectId: 'notExistProject',
        name: 'DM',
        permissions: ['read', 'write'],
      })
      .expect(403);
    expect(res.body).toHaveProperty('message', 'Forbidden resource');
  });

  it(`Create role role exist`, async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .set('Cookie', token)
      .send({
        projectId: existProjectId,
        name: 'DM',
        permissions: ['read', 'write'],
      })
      .expect(400);
    expect(res.body).toHaveProperty('message', 'Role already exists');
  });

  it(`Create role permission not exist`, async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .set('Cookie', token)
      .send({
        projectId: existProjectId,
        name: 'PO',
        permissions: ['read', 'carry', 'create'],
      })
      .expect(400);
    expect(res.body).toHaveProperty('message', 'Permission not exists');
  });

  it(`Get project roles`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/${existProjectId}/roles`)
      .set('Cookie', token)
      .expect(200);
    expect(res.body).toEqual(['DM', 'NPC', 'admin', 'player']);
  });

  it(`Get project roles empty`, async () => {
    await request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/notExist/roles`)
      .set('Cookie', token)
      .expect(403);
  });

  it(`Assign user role`, async () => {
    await request(app.getHttpServer())
      .post(`/${API_PREFIX}/project/${existProjectId}/user/Cathy/roles`)
      .set('Cookie', token)
      .send({
        roleNames: ['DM', 'player'],
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/${API_PREFIX}/project/${existProjectId}/user/Bob/roles`)
      .set('Cookie', token)
      .send({
        roleNames: ['player'],
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/project/${anotherProjectId}/user/Bob/roles`)
      .set('Cookie', token)
      .send({
        roleNames: ['player'],
      })
      .expect(201);
  });

  it(`Assign user role user not exist`, async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/project/${existProjectId}/user/noExist/roles`)
      .set('Cookie', token)
      .send({
        roleNames: ['DM', 'player'],
      })
      .expect(400);
    expect(res.body).toHaveProperty('message', 'User not exist');
  });

  it(`Assign user role user not exist`, async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/project/${existProjectId}/user/Cathy/roles`)
      .set('Cookie', token)
      .send({
        roleNames: ['DM', 'notExist'],
      })
      .expect(400);
    expect(res.body).toHaveProperty('message', 'Role notExist not exists');
  });

  it(`Get project user roles`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/${existProjectId}/user/Cathy/roles`)
      .set('Cookie', token)
      .expect(200)
      .expect(['DM', 'player']);
  });

  it(`Get project user roles empty`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/${existProjectId}/user/noExit/roles`)
      .set('Cookie', token)
      .expect(200)
      .expect([]);
  });

  it(`Update role permissions`, async () => {
    await request(app.getHttpServer())
      .put(`/${API_PREFIX}/project/${existProjectId}/role/DM`)
      .set('Cookie', token)
      .send({
        permissions: ['create', 'write'],
      })
      .expect(200);
  });

  it(`Update role permissions project not exist`, async () => {
    const res = await request(app.getHttpServer())
      .put(`/${API_PREFIX}/project/notEXist/role/DM`)
      .set('Cookie', token)
      .send({
        permissions: ['create', 'write'],
      })
      .expect(403);
    expect(res.body).toHaveProperty('message', 'Forbidden resource');
  });

  it(`Update role permissions role not exist`, async () => {
    const res = await request(app.getHttpServer())
      .put(`/${API_PREFIX}/project/${existProjectId}/role/AAA`)
      .set('Cookie', token)
      .send({
        permissions: ['create', 'write'],
      })
      .expect(400);
    expect(res.body).toHaveProperty('message', 'Role AAA not exists');
  });

  it(`Delete role`, async () => {
    const res = await request(app.getHttpServer())
      .delete(`/${API_PREFIX}/project/${existProjectId}/role/NPC`)
      .set('Cookie', token)
      .expect(200);
  });

  it(`Delete role in use `, async () => {
    const res = await request(app.getHttpServer())
      .delete(`/${API_PREFIX}/project/${existProjectId}/role/player`)
      .set('Cookie', token)
      .expect(409);
    expect(res.body).toHaveProperty('message', 'Role is still in use');
  });

  it(`Get roles permissions`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/${existProjectId}/roles/permissions`)
      .set('Cookie', token)
      .expect(200)
      .expect({
        DM: ['create', 'write'],
        admin: ['administer', 'execute', 'delete', 'create', 'write', 'read'],
        player: ['read'],
      });
  });

  it(`Get roles permissions empty`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/noExist/roles/permissions`)
      .set('Cookie', token)
      .expect(403);
  });
});
