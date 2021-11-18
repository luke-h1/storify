import { User } from '@storify/common/src/types';
import { Request } from 'express';

export interface IRequest extends Request {
  user?: User;
}
