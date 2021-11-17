import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers/user';

const createSchema = async () =>
  buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });
export default createSchema;
