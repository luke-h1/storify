import { Order } from './Order';
import { Review } from './Review';
import { User } from './User';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  numReviews: number;
  countInStock: number;
  user: User;
  userId: string;
  order: Order[];
  reviews: Review[];
  orderId: string;

  createdAt: Date;
  updatedAt: Date;
}
