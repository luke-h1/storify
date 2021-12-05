import { buildSchema } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { ImageResolver } from '../resolvers/image';
import { OrderResolver } from '../resolvers/order';
import { ProductResolver } from '../resolvers/product';
import { UserResolver } from '../resolvers/user';

const createSchema = async () =>
  buildSchema({
    resolvers: [UserResolver, ImageResolver, ProductResolver, OrderResolver],
    validate: false,
    authChecker: isAuth,
  });
export default createSchema;
