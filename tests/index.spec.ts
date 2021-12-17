import request from 'supertest';
import mongoose from 'mongoose';

import app from '../src/app';
import { server } from '../src/server';

const api = request(app);

describe('[ AUTH ]: Auth Test Suite', () => {
  test('1. should return 200 status code', async () => {
    const resp = await api.get('/').send();
    expect(resp.status).toBe(200);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
