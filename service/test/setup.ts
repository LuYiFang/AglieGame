import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as _ from 'lodash';
import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';
import { users } from './user.data';
import { CommonService } from '../src/common/common.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';

let containerDB: StartedTestContainer;
let containerRabbitMQ: StartedTestContainer;

const createDBContainer = async (port: number) => {
  try {
    containerDB = await new GenericContainer('neo4j')
      .withExposedPorts({
        container: 7687,
        host: port,
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
  } catch (error) {
    console.log('Create neo4j container error:', error);
  }
};

const createQueueContainer = async (port: number) => {
  try {
    containerRabbitMQ = await new GenericContainer('rabbitmq:management')
      .withExposedPorts({
        container: 5672,
        host: port,
      })
      .withEnvironment({
        RABBITMQ_DEFAULT_USER: 'test',
        RABBITMQ_DEFAULT_PASS: 'test',
      })
      .withLogConsumer((stream) => {
        stream.on('err', (line) => console.error(line));
      })
      .start();
  } catch (error) {
    console.log('Create rabbitMQ container error:', error);
  }
};

export const setupContainers = async (dbPort: number, queuePort: number) => {
  await Promise.all([
    createDBContainer(dbPort),
    createQueueContainer(queuePort),
  ]);
};

export const teardownContainers = async () => {
  await containerDB.stop();
  await containerRabbitMQ.stop();
  await CommonService.sleep(10 * 1000);
};

export const mockConfigService = (
  configService: ConfigService,
  neoPort: number,
  rabbitPort: number,
) => {
  return {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'NEO4J_PORT') {
        return neoPort;
      }
      if (key === 'RABBITMQ_URL') {
        return `amqp://test:test@127.0.0.1:${rabbitPort}`;
      }
      return configService.get(key);
    }),
  };
};

export const startApp = async (neoPort: number, rabbitPort: number) => {
  const cs = new ConfigService();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ConfigService)
    .useValue(mockConfigService(cs, neoPort, rabbitPort))
    .compile();

  const app = moduleFixture.createNestApplication();
  app.use(cookieParser());
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
  return { app, configService };
};

export const createDefaultUsers = async (app: INestApplication) => {
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
};

export const login = async (app: INestApplication, username: string) => {
  const res = await request(app.getHttpServer()).post('/auth/login').send({
    username: username,
    password: 'password',
  });

  const jwtCookie = _.find(res.header['set-cookie'], (cookie) =>
    cookie.startsWith('token='),
  );
  const token = jwtCookie.split(';')[0]; //.replace('token=', '')
  return token;
};
