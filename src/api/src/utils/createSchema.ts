import { buildSchema } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { ImageResolver } from '../resolvers/image';
import { ProductResolver } from '../resolvers/product';
import { UserResolver } from '../resolvers/user';

const createSchema = async () =>
  buildSchema({
    resolvers: [UserResolver, ImageResolver, ProductResolver],
    validate: false,
    authChecker: isAuth,
  });
export default createSchema;
