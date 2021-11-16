import { buildSchema } from 'type-graphql';
import { User } from '../entities/User';

const createSchema = async () =>
  buildSchema({
    resolvers: [User],
    validate: false,
  });
export default createSchema;
