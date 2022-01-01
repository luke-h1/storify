import { join } from 'path';
import { createConnection } from 'typeorm';
import { Order } from '../entities/Order';
import { Product } from '../entities/Product';
import { Review } from '../entities/Review';
import { User } from '../entities/User';

const createConn = async () =>
  createConnection({
    type: 'postgres',
    name: 'storify',
    username: 'storfy',
    password: 'storify',
    port: process.env.DB_PORT,
    logging: true,
    migrations: [join(__dirname, '../migrations/*')],
    entities: [User, Product, Order, Review],
    synchronize: true,
  });
export default createConn;
