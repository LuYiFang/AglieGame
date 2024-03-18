import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Neo4jService } from 'nest-neo4j/dist';
import { ConfigService } from '@nestjs/config';
import { PermissionService } from '../src/permission/permission.service';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

const API_PREFIX = 'permission';

describe('PermissionController (e2e)', () => {
  let app: INestApplication;
  let neo4jService: Neo4jService;
  let configService: ConfigService;
  let permissionService: PermissionService;
  let client: ClientProxy;

  beforeEach(async () => {
    configService = new ConfigService();
    permissionService = new PermissionService(neo4jService, client);

    const permissionServiceMethods: { [key: string]: any } = _.reduce(
      Object.getOwnPropertyNames(Object.getPrototypeOf(permissionService)),
      (pre, method) => {
        pre[method] = permissionService[method];
        return pre;
      },
      {},
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PermissionService)
      .useValue({
        ...permissionServiceMethods,
        client: {
          send: jest.fn().mockImplementation((pattern, data) => {
            switch (pattern) {
              case 'checkProjectExist':
                if (data == 'existProject') return of(true);
                return of(false);
            }
          }),
        },
        queryPermissions: jest.fn().mockImplementation(async () => {
          return _.map(
            configService.get('DEFAULT_PERMISSIONS').split(','),
            (v) => ({ name: v }),
          );
        }),
        queryRole: jest.fn().mockImplementation(async (projectId, name) => {
          if (name === 'newRole') return undefined;
          return { id: 'role_id' };
        }),
        queryRoles: jest.fn().mockImplementation(async () => {
          return _.map(['DM', 'player', 'PO'], (v) => ({ name: v }));
        }),
        queryProjectUserRoles: jest.fn().mockImplementation(async () => {
          return _.map(['DM', 'player'], (v) => ({ name: v }));
        }),
        queryProjectRolesPermissions: jest.fn().mockImplementation(async () => {
          return {
            records: [
              {
                get: (key: string) => {
                  return {
                    Role: 'DM',
                    Permissions: ['read', 'write'],
                  }[key];
                },
              },
              {
                get: (key: string) => {
                  return {
                    Role: 'PO',
                    Permissions: ['read'],
                  }[key];
                },
              },
            ],
          };
        }),
        checkPermissionExist: jest.fn().mockImplementation(async () => {
          return 2;
        }),
        writeRole: jest.fn().mockImplementation(async () => {}),
        createPermission: jest.fn().mockImplementation(async () => {}),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`/${API_PREFIX} (GET)`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}`)
      .expect(200)
      .expect(configService.get('DEFAULT_PERMISSIONS').split(','));
  });

  it(`/${API_PREFIX}/role (POST)`, () => {
    return request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .send({
        projectId: 'existProject',
        name: 'newRole',
        permissions: ['read', 'write'],
      })
      .expect(201);
  });

  it(`/${API_PREFIX}/role (POST) project not exist`, () => {
    return request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .send({
        projectId: 'notExistProject',
        name: 'DM',
        permissions: ['read', 'write'],
      })
      .expect(400);
  });

  it(`/${API_PREFIX}/role (POST) role exist`, () => {
    return request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .send({
        projectId: 'existProject',
        name: 'DM',
        permissions: ['read', 'write'],
      })
      .expect(400);
  });

  it(`/${API_PREFIX}/role (POST) permission not exist`, () => {
    return request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .send({
        projectId: 'existProject',
        name: 'testRole',
        permissions: ['read', 'carry', 'create'],
      })
      .expect(400);
  });

  it(`/${API_PREFIX}/project/:projectId/roles (GET)`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/existProject/roles`)
      .expect(200)
      .expect(['DM', 'player', 'PO']);
  });

  it(`/${API_PREFIX}/project/:projectId/user/:username/roles (GET)`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/existProject/user/User1/roles`)
      .expect(200)
      .expect(['DM', 'player']);
  });

  it(`/${API_PREFIX}/project/:projectId/roles/permissions (GET)`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/existProject/roles/permissions`)
      .expect(200)
      .expect({ DM: ['read', 'write'], PO: ['read'] });
  });

  it(`/${API_PREFIX}/project/:projectId/role/:name (GET)`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/project/existProject/roles/permissions`)
      .expect(200)
      .expect({ DM: ['read', 'write'], PO: ['read'] });
  });

  afterEach(async () => {
    await app.close();
  });
});
