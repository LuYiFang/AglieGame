import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Neo4jService } from 'nest-neo4j/dist';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from '../src/project/project.service';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

const API_PREFIX = 'project';

describe('Project (e2e)', () => {
  let app: INestApplication;
  let neo4jService: Neo4jService;
  let configService: ConfigService;
  let projectService: ProjectService;
  let client: ClientProxy;

  beforeEach(async () => {
    configService = new ConfigService();
    projectService = new ProjectService(neo4jService, configService, client);

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
        client: {
          send: jest.fn().mockImplementation((pattern, data) => {
            switch (pattern) {
              case 'checkUserExist':
                if (data === 'existUser') return of(true);
                return of(false);
              case 'checkProjectUserPermissions':
                if (data.username !== 'invalid') return of(true);
                return of(false);
            }
          }),
        },
        queryProject: jest.fn().mockImplementation(async (projectId) => {
          if (projectId === 'notExist') return {};
          return {
            uuid: 'fake_uuid',
          };
        }),
        queryUserProjects: jest.fn().mockImplementation(async () => {
          return [
            {
              uuid: 'fake_uuid',
              username: 'existUser',
              name: 'newProject',
            },
          ];
        }),
        writeProject: jest.fn().mockImplementation(async () => {}),
        neo4jService: {
          write: jest.fn().mockImplementation(async () => {}),
        },
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

  _.each(
    [
      {
        name: `/${API_PREFIX}/:projectId/propertyValue (PUT)`,
        url: 'propertyValue',
        method: 'put',
      },
      {
        name: `/${API_PREFIX}/:projectId/propertyName (PATCH)`,
        url: 'propertyName',
        method: 'patch',
      },
      {
        name: `/${API_PREFIX}/:projectId/property (DELETE)`,
        url: 'property',
        method: 'delete',
      },
    ],
    (v) => {
      it(`${v.name}`, () => {
        return request(app.getHttpServer())
          [v.method](`/${API_PREFIX}/fake_uuid/${v.url}`)
          .send({
            username: 'existUser',
            propertyName: 'prize',
            propertyValue: 2000,
          })
          .expect(200);
      });

      it(`${v.name} project not exist`, () => {
        return request(app.getHttpServer())
          [v.method](`/${API_PREFIX}/notExist/${v.url}`)
          .send({
            username: 'existUser',
            propertyName: 'prize',
            propertyValue: 2000,
          })
          .expect(400);
      });

      it(`${v.name} unauthorized`, () => {
        return request(app.getHttpServer())
          [v.method](`/${API_PREFIX}/fake_uuid/${v.url}`)
          .send({
            username: 'invalid',
            propertyName: 'prize',
            propertyValue: 2000,
          })
          .expect(401);
      });
    },
  );

  afterEach(async () => {
    await app.close();
  });
});
