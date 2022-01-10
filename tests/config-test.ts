'use strict';

interface TestUser {
  name: string;
  password: string;
  newPassword?: string;
  email?: string;
  role?: string;
  token?: string;
  _id?: string;
}

// Auth
export const testUser: TestUser = {
  name: 'Alex 33',
  email: 'test33@test.com',
  password: '123123',
  role: 'USER_ROLE',
};

export const testUser2: TestUser = {
  name: 'Alex 332',
  email: 'test332@test.com',
  password: '123123',
  role: 'USER_ROLE',
};

// Users
export const updatedUser: TestUser = {
  name: 'Alex 2 PRO PLUS',
  password: '123123',
  newPassword: '123123',
  role: 'SUPER_ROLE',
};

export const testAdminUser: TestUser = {
  name: 'Alex 333',
  email: 'test333@test.com',
  password: '123123',
  role: 'ADMIN_ROLE',
};

export const testTeam = {
  teamArr: ['raichu', 'pikachu', 'charizard', 'ditto', 'bulbasaur'],
};
