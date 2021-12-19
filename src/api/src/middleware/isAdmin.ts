import { MiddlewareFn } from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../types/MyContext';

export const isAdmin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const user = await User.findOne({ id: context.req.session.userId });

  if (!user?.isAdmin || !context.req.session.userId) {
    throw new Error('You are not Authorized to access this resource');
  }
  return next();
};
