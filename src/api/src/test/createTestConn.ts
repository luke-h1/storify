import { Connection, createConnection } from 'typeorm';
import { Cart } from '../entities/Cart';
import { Order } from '../entities/Order';
import { OrderDetails } from '../entities/OrderDetails';
import { Payment } from '../entities/Payment';
import { Product } from '../entities/Product';
import { Review } from '../entities/Review';
import { User } from '../entities/User';

export const createTestConn = (drop = false): Promise<Connection> =>
  createConnection({
    name: 'default',
    type: 'postgres',
    port: 5555,
    username: 'storify',
    password: 'storify',
    database: 'storify',
    synchronize: drop,
    dropSchema: drop,
    entities: [User, Product, Order, Cart, OrderDetails, Payment, Review],
  });
