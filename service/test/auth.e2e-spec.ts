import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { setupContainers, startApp, teardownContainers } from './setup';

const API_PREFIX = 'auth';
const NEO_PORT = 27875;
const RABBIT_PORT = 20485;

describe('Auth (e2e)', () => {
  let app: INestApplication;

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

  it('Signup', async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/signup`)
      .send({ username: 'Alice', password: 'password' })
      .expect(201);

    expect(res.header['set-cookie']).toBeDefined();
    const jwtCookie = _.find(res.header['set-cookie'], (cookie) =>
      cookie.startsWith('token='),
    );
    expect(jwtCookie).toBeDefined();
  });

  it('Signup user exist', async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/signup`)
      .send({ username: 'Alice', password: 'password' })
      .expect(400);

    expect(res.header['set-cookie']).not.toBeDefined();
  });

  it('Login', async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/login`)
      .send({ username: 'Alice', password: 'password' })
      .expect(201);

    expect(res.header['set-cookie']).toBeDefined();
    const jwtCookie = _.find(res.header['set-cookie'], (cookie) =>
      cookie.startsWith('token='),
    );
    expect(jwtCookie).toBeDefined();
  });

  it('Login not found', async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/login`)
      .send({ username: 'noUser', password: 'password' })
      .expect(404);

    expect(res.header['set-cookie']).not.toBeDefined();
  });

  it('Login wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/login`)
      .send({ username: 'Alice', password: 'nopassword' })
      .expect(401);

    expect(res.header['set-cookie']).not.toBeDefined();
  });

  it('Logout', async () => {
    const res = await request(app.getHttpServer())
      .post(`/${API_PREFIX}/logout`)
      .expect(201);
    expect(res.header['set-cookie']).toBeDefined();
    const jwtCookie = _.find(res.header['set-cookie'], (cookie) =>
      cookie.startsWith('token=;'),
    );
    expect(jwtCookie).toBeDefined();
  });
});
