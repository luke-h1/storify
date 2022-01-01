import { Connection, createConnection } from 'typeorm';
import { Order } from '../entities/Order';
import { Product } from '../entities/Product';
import { Review } from '../entities/Review';
import { User } from '../entities/User';

export const createTestConn = (drop = false): Promise<Connection> =>
  createConnection({
    name: 'default',
    type: 'postgres',
    port: process.env.CI ? process.env.DB_PORT : 5555,
    username: 'storify',
    password: 'storify',
    database: 'storify',
    synchronize: drop,
    dropSchema: drop,
    entities: [User, Product, Order, Review],
  });
