import { connection } from 'mongoose';
import request from 'supertest';

import app from '../src/app';
import { User } from '../src/models';
import { testUser, testUser2 } from './config-test';
import { server } from '../src/server';

const api: request.SuperTest<request.Test> = request(app);

beforeEach(async () => {
  await api.post('/auth/signup').send(testUser);
});

afterEach(async () => {
  await User.findOneAndRemove({ email: testUser.email });
});

afterAll(async () => {
  await User.findOneAndRemove({ email: testUser2.email });

  connection.close();
  server.close();
});

describe('\n[ AUTH ]: Auth Test Suite', () => {
  describe('a) When all data is sent', () => {
    test('1. should return 201 when registering a New User', async () => {
      await api
        .post('/auth/signup')
        .send(testUser2)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    });

    test('2. should return a json with a valid token for succesful login', async () => {
      const resp: request.Response = await api
        .post('/auth/login')
        .send(testUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(resp.body.token).toBeDefined();
    });

    // test('3. should return 200 when jwt is valid', async () => {
    //   const resp = await api.post('/auth/login').send(testUser).expect(200);
    //   const { token } = resp.body;

    //   await api.get('/auth/private').set('Authorization', token).expect(200);
    // });
  });

  describe('b) When data are missing', () => {
    // test('1. should return 401 when token is missing', async () => {
    //   await api.get('/auth/private').expect(401);
    // });
    test('2. should return 400 when log in data are missing', async () => {
      const fields = [
        {},
        { email: testUser.email },
        { password: testUser.password },
        { someData: 'Some data' },
        { email: testUser.email, password: 'no-password' },
        { email: 'test333@test.com', password: testUser.password },
      ];

      // This works sequentially with a for-of loop
      for (const body of fields) {
        await api.post('/auth/login').send(body).expect(400);
      }
    });
  });
});
