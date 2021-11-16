import { buildSchema } from 'type-graphql';

const createSchema = async () =>
  buildSchema({
    resolvers: [],
    validate: false,
  });
export default createSchema;
