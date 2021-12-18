import { join } from 'path';
import { createConnection } from 'typeorm';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Product } from '../entities/Product';
import { Review } from '../entities/Review';
import { User } from '../entities/User';

const createConn = async () =>
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    migrations: [join(__dirname, '../migrations/*')],
    entities: [User, Product, Order, OrderItem, Review],
    synchronize: true,
  });
export default createConn;
