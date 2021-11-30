import { AuthChecker } from 'type-graphql';
import { MyContext } from '../types/MyContext';

export const isAuth: AuthChecker<MyContext> = ({ context }) => {
  const { userId } = context.req.session;
  return !!userId;
};
