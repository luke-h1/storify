import { buildSchema } from 'type-graphql';
import { ImageResolver } from '../resolvers/image';
import { productResolver } from '../resolvers/product';
import { UserResolver } from '../resolvers/user';

const createSchema = async () =>
  buildSchema({
    resolvers: [UserResolver, ImageResolver, productResolver],
    validate: false,
  });
export default createSchema;
