import { User } from 'src/entities/User';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types/MyContext';

export const isAdmin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const user = await User.findOne({ id: context.req.session.userId });

  if (!user?.isAdmin || !context.req.session.userId) {
    throw new Error('Not Authenticated');
  }
  return next();
};
