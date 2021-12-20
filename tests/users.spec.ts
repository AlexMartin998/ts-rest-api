import { connection } from 'mongoose';
import request from 'supertest';

import app from '../src/app';
import { User } from '../src/models';
import { testUser, updatedUser } from './config-test';
import { server } from '../src/server';

const api: request.SuperTest<request.Test> = request(app);

const _testUser = testUser;

// Create a test user
beforeEach(async () => {
  await api.post('/auth/signup').send(_testUser);
});

afterEach(async () => {
  await User.findOneAndRemove({ email: _testUser.email });
});

afterAll(async () => {
  connection.close();
  server.close();
});

describe.skip('\n[ USERS ]: Auth Test Suite', () => {
  describe('a) When all data is sent', () => {
    test('1. should update an especific user by id.', async () => {
      const resLogin = await api.post('/auth/login').send(_testUser);
      const { token } = resLogin.body;
      _testUser.token = token;

      const resUpdateUser = await api
        .put('/user/uid')
        .set('Authorization', _testUser.token)
        .send(updatedUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(resUpdateUser.body.user.name).toBe(updatedUser.name);
    });
    test('2. should delete an especific user by id', async () => {
      await api
        .delete('/user/uid')
        .set('Authorization', _testUser.token)
        .expect(200);

      // TODO: count active user -1
      // expect()
    });
  });

  // // Data is missing
  // 1. 401 if token is missing

  // 400 when sending an invalid uid

  // 2. 400 when user.state = false  ||  user doesn't in DB - update & delete

  // 3. 401 if isn't the same user or admin role or any valid role

  // 4.
});
