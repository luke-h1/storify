import { join } from 'path';
import { createConnection } from 'typeorm';
import { Cart } from '../entities/Cart';
import { Order } from '../entities/Order';
import { OrderDetails } from '../entities/OrderDetails';
import { Payment } from '../entities/Payment';
import { Product } from '../entities/Product';
import { Review } from '../entities/Review';
import { User } from '../entities/User';

const createConn = async () =>
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    migrations: [join(__dirname, '../migrations/*')],
    entities: [User, Product, Order, Cart, OrderDetails, Payment, Review],
    synchronize: false,
  });
export default createConn;
