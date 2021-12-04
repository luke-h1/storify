import { join } from 'path';
import { createConnection } from 'typeorm';
import { Link } from '../entities/Link';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Product } from '../entities/Product';
import { Review } from '../entities/Review';
import { User } from '../entities/User';
import { isProd } from '../shared/constants';

const createConn = async () =>
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    migrations: [join(__dirname, '../migrations/*')],
    entities: [User, Product, Order, OrderItem, Link, Review],
    synchronize: !!isProd,
  });
export default createConn;
