import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as _ from 'lodash';
import { abilities, abilityItems, abilitySubs } from './ability.data';
import { users } from './user.data';
import { successReturn } from '../src/common/constants/common.constant';
import {
  createDefaultUsers,
  login,
  setupContainers,
  startApp,
  teardownContainers,
} from './setup';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const API_PREFIX = 'ability';
const NEO_PORT = 27878;
const RABBIT_PORT = 20487;

describe('Project (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let token: string;

  beforeAll(
    async () => await setupContainers(NEO_PORT, RABBIT_PORT),
    20 * 1000,
  );
  afterAll(teardownContainers, 20 * 1000);

  beforeEach(async () => {
    const result = await startApp(NEO_PORT, RABBIT_PORT);
    app = result.app;
    configService = result.configService;
  });

  afterEach(async () => {
    await app.close();
  });

  it(
    `Create ability type`,
    async () => {
      await createDefaultUsers(app);
      token = await login(app, 'Alice');

      await Promise.all(
        abilities.slice(0, 1).map((ability) => {
          return request(app.getHttpServer())
            .post(`/${API_PREFIX}/type`)
            .set('Cookie', token)
            .send({
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
    token = await login(app, 'Bob');
    await Promise.all(
      abilities.map((ability) => {
        return request(app.getHttpServer())
          .post(`/${API_PREFIX}/type`)
          .set('Cookie', token)
          .send({
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
          .set('Cookie', token)
          .send({
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
          .set('Cookie', token)
          .send({
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
    let res = await request(app.getHttpServer())
      .delete(`/${API_PREFIX}/equipment/computer/custom-built computer`)
      .set('Cookie', token);
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body[0].subTypes[1].items.length).toBe(1);
  });

  it(`Delete ability sub type`, async () => {
    let res = await request(app.getHttpServer())
      .delete(`/${API_PREFIX}/skill/computer Language`)
      .set('Cookie', token);
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body[2].subTypes.length).toBe(2);
  });

  it(`Delete ability type`, async () => {
    let res = await request(app.getHttpServer())
      .delete(`/${API_PREFIX}/quality`)
      .set('Cookie', token);
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body.length).toBe(2);
  });

  it(`Delete ability type not exist`, async () => {
    let res = await request(app.getHttpServer())
      .delete(`/${API_PREFIX}/quality`)
      .set('Cookie', token);
    expect(res.body).toEqual(successReturn);
  });

  it(`Update ability type`, async () => {
    let res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}`)
      .set('Cookie', token)
      .send({
        propertyName: 'levelThreshold',
        propertyValue: [30, 66],
        abilityTypeName: 'equipment',
      });
    expect(res.body).toEqual(successReturn);

    res = await request(app.getHttpServer()).get(`/${API_PREFIX}/Bob/all`);

    expect(res.body[0].abilityType.properties.levelThreshold).toEqual([30, 66]);
  });

  it(`Update ability sub type`, async () => {
    let res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}`)
      .set('Cookie', token)
      .send({
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
    let res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}`)
      .set('Cookie', token)
      .send({
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
    const jwtService = new JwtService({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: '1h',
      },
    });
    const InvalidToken = jwtService.sign({ username: 'Bob1', id: 'id' });
    let res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}`)
      .set('Cookie', `token=${InvalidToken}`)
      .send({
        propertyName: 'levelThreshold',
        propertyValue: [30, 66],
        abilityTypeName: 'equipment',
      });
    expect(res.status).toEqual(401);
  });

  it(`Update ability type ability not exist`, async () => {
    let res = await request(app.getHttpServer())
      .patch(`/${API_PREFIX}`)
      .set('Cookie', token)
      .send({
        propertyName: 'levelThreshold',
        propertyValue: [30, 66],
        abilityTypeName: 'equipment1',
      });
    expect(res.status).toEqual(400);
  });
});
