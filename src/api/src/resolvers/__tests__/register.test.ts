/* eslint-disable prefer-template */
import { Connection } from 'typeorm';
import redis from '../../db/redis';
import { User } from '../../entities/User';
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

describe('Register', () => {
  test('it creates the user', async () => {
    const user = {
      firstName: 'test',
      lastName: 'test last',
      email: 'tester@test.com',
      password: 'storify12345',
    };

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        options: user,
      },
    });
    expect(response).toMatchObject({
      data: {
        register: {
          errors: null,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: false,
            fullName: user.firstName + ' ' + user.lastName,
          },
        },
      },
    });
    const userInDb = await User.findOne({ where: { email: user.email } });
    expect(userInDb).toBeDefined();
    expect(userInDb?.email).toBe(user.email);
  });
});
