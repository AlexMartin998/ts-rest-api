'use strict';

interface TestUser {
  name: string;
  password: string;
  email?: string;
  role?: string;
  token?: string;
}

// Auth
export const testUser: TestUser = {
  name: 'Alex 33',
  email: 'test33@test.com',
  password: '123123',
};

export const testUser2: TestUser = {
  name: 'Alex 332',
  email: 'test332@test.com',
  password: '123123',
};

// Users
export const updatedUser: TestUser = {
  name: 'Updated name',
  password: 'New password',
  role: 'ANY_OTHER_ROLE',
};

export const testTeam = {
  teamArr: ['raichu', 'pikachu', 'charizard', 'ditto', 'bulbasaur'],
};
