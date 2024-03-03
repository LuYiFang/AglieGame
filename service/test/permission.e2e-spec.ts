import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Neo4jService } from 'nest-neo4j/dist';
import { INestApplication } from '@nestjs/common';
import { PermissionService } from '../src/permission/permission.service';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';

const API_PREFIX = 'permission';

describe('PermissionController (e2e)', () => {
  let app: INestApplication;
  let neo4jService: Neo4jService;
  let permissionService: PermissionService;
  let configService: ConfigService;

  beforeEach(async () => {
    configService = new ConfigService();
    permissionService = new PermissionService(neo4jService);

    const permissionServiceMethods = _.reduce(
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
        queryPermissions: jest.fn().mockImplementation(async () => {
          return _.map(
            configService.get('DEFAULT_PERMISSIONS').split(','),
            (v) => ({ name: v }),
          );
        }),
        queryRole: jest.fn().mockImplementation(async (name, permission) => {
          if (name === 'testRole') return undefined;
          return { id: 'role_id' };
        }),
        queryRoles: jest.fn().mockImplementation(async () => {
          return _.map(['DM', 'player', 'PO'], (v) => ({ name: v }));
        }),
        queryUserRoles: jest.fn().mockImplementation(async () => {
          return _.map(['DM', 'player'], (v) => ({ name: v }));
        }),
        queryRolePermissions: jest.fn().mockImplementation(async () => {
          return _.map(['read', 'create', 'write'], (v) => ({ name: v }));
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
      .send({ name: 'testRole', permissions: ['read', 'write'] })
      .expect(201);
  });

  it(`/${API_PREFIX}/role (POST) role exist`, () => {
    return request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .send({ name: 'DM', permissions: ['read', 'write'] })
      .expect(400);
  });

  it(`/${API_PREFIX}/role (POST) permission not exist`, () => {
    return request(app.getHttpServer())
      .post(`/${API_PREFIX}/role`)
      .send({ name: 'testRole', permissions: ['read', 'carry', 'create'] })
      .expect(400);
  });

  it(`/${API_PREFIX}/role (GET)`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/role`)
      .expect(200)
      .expect(['DM', 'player', 'PO']);
  });

  it(`/${API_PREFIX}/role/:name (GET)`, () => {
    return request(app.getHttpServer())
      .get(`/${API_PREFIX}/role/testRole`)
      .expect(200)
      .expect(['read', 'create', 'write']);
  });

  afterEach(async () => {
    await app.close();
  });
});
