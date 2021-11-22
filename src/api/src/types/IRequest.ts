import { Request } from 'express';

export interface IRequest extends Request {
  /**
   * the user id of the authenticated user.
   */
  userId?: string;
}
