import { Product } from './Product';
import { User } from './User';

export interface Order {
  id: string;
  products: Product[];
  productId?: string;
  user: User;
  userId: string;
}
