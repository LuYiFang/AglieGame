import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as _ from 'lodash';
import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';
import { users } from './user.data';

let containerDB: StartedTestContainer;
let containerRabbitMQ: StartedTestContainer;

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
  } catch (error) {
    console.log('Create neo4j container error:', error);
  }
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
      .withLogConsumer((stream) => {
        stream.on('err', (line) => console.error(line));
      })
      .start();
  } catch (error) {
    console.log('Create rabbitMQ container error:', error);
  }
};

export const setupContainers = async () => {
  await Promise.all([createDBContainer(), createQueueContainer()]);
};

export const teardownContainers = async () => {
  await containerDB.stop();
  await containerRabbitMQ.stop();
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
