import { join } from 'path';
import { createConnection } from 'typeorm';

const createConn = async () =>
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    migrations: [join(__dirname, '../migrations/*')],
    entities: [join(__dirname, '../entities/*')],
    synchronize: process.env.NODE_ENV !== 'production',
  });
export default createConn;
