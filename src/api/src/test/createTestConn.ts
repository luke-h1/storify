import { createConnection, Connection } from 'typeorm';

export const createTestConn = (drop = false): Promise<Connection> =>
  createConnection({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5555,
    username: 'storify',
    password: 'storify',
    database: 'storify-test',
    synchronize: drop,
    dropSchema: drop,
    entities: [`${__dirname}/../entities/*.*`],
  });
