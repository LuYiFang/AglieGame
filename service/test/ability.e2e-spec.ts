import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import * as _ from 'lodash';
import {
  TestContainer,
  StartedTestContainer,
  StoppedTestContainer,
  GenericContainer,
  Wait,
} from 'testcontainers';
import { Neo4jContainer } from '@testcontainers/neo4j';
import { CommonService } from '../src/common/common.service';
import { abilities, abilityItems, abilitySubs } from './ability.data';
import { users } from './user.data';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import neo4j from 'neo4j-driver';
import { assert } from 'console';
import { successReturn } from '../src/common/constants/common.constant';

const API_PREFIX = 'ability';
let containerDB: StartedTestContainer;
let containerRabbitMQ;

const createDBContainer = async () => {
  try {
    containerDB = await new GenericContainer('neo4j')
      .withExposedPorts({
        container: 7687,
        host: 27878,
      })
      .withExposedPorts({
        container: 7474,
        host: 27474,
      })
      .withWaitStrategy(Wait.forLogMessage('Started.'))
      .withEnvironment({
        NEO4J_AUTH: 'neo4j/testtest',
        NEO4J_PLUGINS: '["apoc"]',
        NEO4J_dbms_security_procedures_unrestricted: 'apoc.*',
      })
      .withStartupTimeout(120_000)
      .withLogConsumer((stream) => {
        stream.on('err', (line) => console.error(line));
      })
      .start();
  } catch (error) {}
};

const createQueueContainer = async () => {
  try {
    containerRabbitMQ = await new GenericContainer('rabbitmq:management')
      .withExposedPorts({
        container: 5672,
        host: 20487,
      })
      .withExposedPorts({
        container: 15672,
        host: 20478,
      })
      .withEnvironment({
        RABBITMQ_DEFAULT_USER: 'test',
        RABBITMQ_DEFAULT_PASS: 'test',
      })
      .start();
  } catch (error) {
    console.log('Create rabbitMQ container error:', error);
  }
};

describe('Project (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await Promise.all([createDBContainer(), createQueueContainer()]);
  }, 200 * 1000);

  afterAll(async () => {
    await containerDB.stop();
    await containerRabbitMQ.stop();
  });

  beforeEach(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      const configService = app.get(ConfigService);
      app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get('RABBITMQ_URL')],
          queue: 'app_queue',
          queueOptions: {
            durable: false,
          },
        },
      });
      await app.init();
      await app.startAllMicroservices();
    } catch (error) {
      console.log('Create app error:', error);
    }
  }, 50 * 1000);

  it(
    `Create ability type`,
    async () => {
      await Promise.all(
        users.map((user) => {
          return request(app.getHttpServer())
            .post(`/auth/signup`)
            .send({
              username: user,
              password: 'password',
            })
            .expect(201)
            .expect({
              message: 'success',
            });
        }),
      );

      await Promise.all(
        abilities.slice(0, 1).map((ability) => {
          return request(app.getHttpServer())
            .post(`/${API_PREFIX}/type`)
            .send({
              username: 'Alice',
              ...ability,
            })
            .expect(201)
            .expect({
              message: 'success',
            });
        }),
      );
    },
    500 * 1000,
  );

  it(`Get ability type`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/${API_PREFIX}/Alice/all`,
    );

    const data = res.body[0];
    expect(data).toHaveProperty('abilityType');
    expect(data).toHaveProperty('subTypes');
    expect(data.abilityType).toHaveProperty('properties');
    expect(data.abilityType.properties).toHaveProperty('levels', [
      'low',
      'medium',
      'high',
    ]);
  });

  it(`Create ability type, sub type, item`, async () => {
    const username = 'Bob';

    await Promise.all(
      abilities.map((ability) => {
        return request(app.getHttpServer())
          .post(`/${API_PREFIX}/type`)
          .send({
            username: username,
            ...ability,
          })
          .expect(201)
          .expect({
            message: 'success',
          });
      }),
    );

    await Promise.all(
      abilitySubs.map((ability) => {
        return request(app.getHttpServer())
          .post(`/${API_PREFIX}/sub`)
          .send({
            username: username,
            ...ability,
          })
          .expect(201)
          .expect({
            message: 'success',
          });
      }),
    );

    await Promise.all(
      abilityItems.map((ability) => {
        return request(app.getHttpServer())
          .post(`/${API_PREFIX}/item`)
          .send({
            username: username,
            ...ability,
          })
          .expect(201)
          .expect({
            message: 'success',
          });
      }),
    );
  });

  it(`Get ability all`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/${API_PREFIX}/Bob/all`,
    );

    const data = res.body[1];
    expect(data).toHaveProperty('abilityType');
    expect(data).toHaveProperty('subTypes');
    expect(data.subTypes[0].subType.properties).toHaveProperty(
      'name',
      'social',
    );
    expect(data.subTypes[1].items[1].properties).toHaveProperty(
      'name',
      'self-regulation',
    );
  });

  it(`Get ability all empty`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/${API_PREFIX}/Queen/all`,
    );

    expect(res.body).toEqual([]);
  });

  it(`Delete ability item`, async () => {
    let res = await request(app.getHttpServer()).delete(
      `/${API_PREFIX}/Bob/equipment/computer/custom-built computer`,
    );
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body[0].subTypes[1].items.length).toBe(1);
  });

  it(`Delete ability sub type`, async () => {
    let res = await request(app.getHttpServer()).delete(
      `/${API_PREFIX}/Bob/skill/computer Language`,
    );
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body[2].subTypes.length).toBe(2);
  });

  it(`Delete ability type`, async () => {
    let res = await request(app.getHttpServer()).delete(
      `/${API_PREFIX}/Bob/quality`,
    );
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body.length).toBe(2);
  });

  it(`Delete ability type not exist`, async () => {
    let res = await request(app.getHttpServer()).delete(
      `/${API_PREFIX}/Bob/quality`,
    );
    expect(res.body).toEqual(successReturn);
  });

  it(`Update ability type`, async () => {
    let res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}`)
      .send({
        username: 'Bob',
        propertyName: 'levelThreshold',
        propertyValue: [30, 66],
        abilityTypeName: 'equipment',
      });
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body[0].abilityType.properties.levelThreshold).toEqual([30, 66]);
  });

  it(`Update ability sub type`, async () => {
    let res = await request(app.getHttpServer()).patch(`/${API_PREFIX}`).send({
      username: 'Bob',
      propertyName: 'description',
      propertyValue: 'computer OS',
      abilityTypeName: 'equipment',
      abilitySubTypeName: 'OS',
    });
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body[0].subTypes[0].subType.properties.description).toEqual(
      'computer OS',
    );
  });

  it(`Update ability item`, async () => {
    let res = await request(app.getHttpServer()).patch(`/${API_PREFIX}`).send({
      username: 'Bob',
      propertyName: 'score',
      propertyValue: 95,
      abilityTypeName: 'equipment',
      abilitySubTypeName: 'OS',
      itemName: 'macOS',
    });
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body[0].subTypes[0].items[0].properties.score).toEqual(95);
  });

  it(`Update ability type user not exist`, async () => {
    let res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}`)
      .send({
        username: 'Bob1',
        propertyName: 'levelThreshold',
        propertyValue: [30, 66],
        abilityTypeName: 'equipment',
      });
    expect(res.status).toEqual(400);
  });

  it(`Update ability type ability not exist`, async () => {
    let res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}`)
      .send({
        username: 'Bob',
        propertyName: 'levelThreshold',
        propertyValue: [30, 66],
        abilityTypeName: 'equipment1',
      });
    expect(res.status).toEqual(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
