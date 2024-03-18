import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { of } from 'rxjs';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeEach(async () => {
    configService = new ConfigService();

    const password = await bcrypt.hash(
      'testpassword',
      parseInt(configService.get('BCRYPT_ROUND')),
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('APP_SERVICE')
      .useValue({
        send: jest.fn().mockImplementation((pattern, data) => {
          switch (pattern) {
            case 'findUser':
              if (data.username === 'noUser') {
                throw new NotFoundException('User not found.');
              }
              return of({
                id: 'fake_id',
                username: 'testUser',
                password: password,
              });
            case 'checkUserExist':
              if (data === 'testUser') return of(true);
              return of(false);
            case 'createUser':
              return of({
                id: 'new_id',
                username: 'newUser',
              });
          }
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testUser', password: 'testpassword' })
      .expect(201)
      .expect('testUser');
  });

  it('/auth/login (POST) not found', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'noUser', password: 'nopassword' })
      .expect(404);
  });

  it('/auth/login (POST) wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testUser', password: 'nopassword' })
      .expect(401);
  });

  it('/auth/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: 'newUser', password: 'newpassword' })
      .expect(201)
      .expect('newUser');
  });

  it('/auth/signup (POST) user exist', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: 'testUser', password: 'newpassword' })
      .expect(400);
  });

  it('/auth/logout (POST)', () => {
    return request(app.getHttpServer()).post('/auth/logout').expect(201);
  });

  afterEach(async () => {
    await app.close();
  });
});
