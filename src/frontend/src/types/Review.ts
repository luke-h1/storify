import { User } from './User';

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  user: User;
  userId: string;
}
