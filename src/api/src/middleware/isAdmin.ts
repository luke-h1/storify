import { AuthChecker } from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../types/MyContext';

export const isAdmin: AuthChecker<MyContext> = async ({ context }) => {
  const user = await User.findOne({ id: context.req.session.userId });
  return !!user?.isAdmin;
};
