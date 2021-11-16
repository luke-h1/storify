/* eslint-disable no-console */
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import 'dotenv-safe/config';
import { graphqlUploadExpress } from 'graphql-upload';
import createConn from './db/createConn';
import redis from './db/redis';
import { isProd } from './shared/constants';
import createSchema from './utils/createSchema';

const main = async () => {
  await createConn();

  const app = express();

  app.use(compression());
  app.set('trust-proxy', 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 15, // limit each IP to 15 requests per windowMs
    message: 'Too many health check requests',
  });

  app.get('/api/health', limiter, (_, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  const RedisStore = connectRedis(session);
  app.use(
    session({
      name: 'fid',
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: isProd,
        domain: isProd ? '.url' : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    }),
  );

  const apolloServer = new ApolloServer({
    allowBatchedHttpRequests: true,
    schema: await createSchema(),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`),
  );
};
main().catch(e => console.error(e));
