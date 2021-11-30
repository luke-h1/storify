import { buildSchema } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { ImageResolver } from '../resolvers/image';
import { productResolver } from '../resolvers/product';
import { UserResolver } from '../resolvers/user';

const createSchema = async () =>
  buildSchema({
    resolvers: [UserResolver, ImageResolver, productResolver],
    validate: false,
    authChecker: isAuth,
  });
export default createSchema;
