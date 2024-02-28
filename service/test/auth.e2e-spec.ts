import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Neo4jService } from 'nest-neo4j/dist';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let neo4jService: Neo4jService;
  let userService: UserService;
  let configService: ConfigService;

  beforeEach(async () => {
    configService = new ConfigService();
    userService = new UserService(neo4jService, configService);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue({
        queryUser: jest
          .fn()
          .mockImplementation(async (username, properties) => {
            if (username === 'testUser')
              return {
                id: 'fake_id',
                username: 'testUser',
                password: await bcrypt.hash(
                  'testpassword',
                  parseInt(configService.get('BCRYPT_ROUND')),
                ),
              };
            else {
              return null;
            }
          }),
        findUser: userService.findUser,
        checkUserExist: userService.checkUserExist,
        createUser: jest.fn().mockResolvedValue({
          id: 'new_id',
          username: 'newUser',
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
      .expect(400)
  });

  afterEach(async () => {
    await app.close();
  });
});
