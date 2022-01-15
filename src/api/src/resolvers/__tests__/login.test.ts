/* eslint-disable prefer-template */
import { Connection } from 'typeorm';
import redis from '../../db/redis';
import { createTestConn } from '../../test/createTestConn';
import { gCall } from '../../test/gCall';

let conn: Connection;

beforeAll(async () => {
  conn = await createTestConn();
  if (redis.status === 'end') {
    await redis.connect();
  }
});

afterAll(async () => {
  await conn.close();
  redis.disconnect();
});

const registerMutation = `
mutation Register($options: UserRegisterInput!) {
  register(options: $options) {
    errors {
      message
      field
    }
    user {
      firstName
      lastName
      email
      isAdmin
      fullName
    }
  }
}
`;

const loginMutation = `
mutation Login($password: String!, $email: String!) {
  login(password: $password, email: $email) {
    errors {
      field
      message
    }
    user {
      id
      firstName
      lastName
      email
      isAdmin
      createdAt
      updatedAt
      fullName
    }
  }
}
`;

describe('login', () => {
  test('it logins a valid user', async () => {
    const user = {
      firstName: 'test',
      lastName: 'test last',
      email: 'test@test.com',
      password: 'storify12345',
    };

    await gCall({
      source: registerMutation,
      variableValues: {
        options: user,
      },
    });

    const response = await gCall({
      source: loginMutation,
      variableValues: {
        email: 'test@test.com',
        password: 'storify12345',
      },
    });
    expect(response).toMatchObject({
      data: {
        login: {
          errors: null,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: false,
          },
        },
      },
    });
  });
});
