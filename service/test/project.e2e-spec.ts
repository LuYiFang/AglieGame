import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Neo4jService } from 'nest-neo4j/dist';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from '../src/project/project.service';
import { UserService } from '../src/user/user.service';
import * as _ from 'lodash';

const API_PREFIX = 'project';

describe('Project (e2e)', () => {
  let app: INestApplication;
  let neo4jService: Neo4jService;
  let configService: ConfigService;
  let userService: UserService;
  let projectService: ProjectService;

  beforeEach(async () => {
    configService = new ConfigService();
    projectService = new ProjectService(
      neo4jService,
      configService,
      userService,
    );

    const projectServiceMethods: { [key: string]: any } = _.reduce(
      Object.getOwnPropertyNames(Object.getPrototypeOf(projectService)),
      (pre, method) => {
        pre[method] = projectService[method];
        return pre;
      },
      {},
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProjectService)
      .useValue({
        ...projectServiceMethods,
        userService: {
          checkUserExist: jest.fn().mockImplementation(async (username) => {
            if (username == 'existUser') return true;
            return false;
          }),
        },
        queryUserProject: jest.fn().mockImplementation(async () => {
          return [
            {
              uuid: 'fake_uuid',
              username: 'existUser',
              name: 'newProject',
            },
          ];
        }),
        writeProject: jest.fn().mockImplementation(async () => {}),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`/${API_PREFIX} (POST)`, () => {
    return request(app.getHttpServer())
      .post(`/${API_PREFIX}`)
      .send({
        username: 'existUser',
        name: 'newProject',
        properties: { prize: 1000, slogan: 'fun' },
      })
      .expect(201);
  });

  it(`/${API_PREFIX}/:username (GET)`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/:username`)
      .expect(200)
      .expect([
        {
          uuid: 'fake_uuid',
          username: 'existUser',
          name: 'newProject',
        },
      ]);
  });

  afterEach(async () => {
    await app.close();
  });
});
