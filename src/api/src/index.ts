/* eslint-disable no-console */
import 'reflect-metadata';
import {
  ApolloServerPluginInlineTrace,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import 'dotenv-safe/config';
import createConn from './db/createConn';
import redis from './db/redis';
import { createOrderLoader } from './loaders/createOrderLoader';
import { createProductLoader } from './loaders/createProductLoader';
import { createUserLoader } from './loaders/createUserLoader';
import { isProd } from './shared/constants';
import createSchema from './utils/createSchema';

const main = async () => {
  const conn = await createConn();

  await conn.runMigrations();

  const app = express();

  app.use(compression());
  app.set('trust-proxy', 1);
  app.use(
    cors({
      origin: [process.env.CORS_ORIGIN, 'https://studio.apollographql.com'],
      credentials: true,
    }),
  );

  const RedisStore = connectRedis(session);
  app.use(
    session({
      name: 'fid',
      store: new RedisStore({
        logErrors: true,
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: isProd,
        domain: isProd ? 'deployed api URL' : undefined,
        signed: !!isProd,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    }),
  );

  const plugins = [];

  if (isProd) {
    plugins.push(ApolloServerPluginLandingPageDisabled());
  } else {
    plugins.push(ApolloServerPluginInlineTrace());
  }

  const apolloServer = new ApolloServer({
    plugins,
    debug: !!isProd,
    allowBatchedHttpRequests: true,
    schema: await createSchema(),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      orderLoader: createOrderLoader(),
      productLoader: createProductLoader(),
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
    path: '/api',
  });

  app.listen(process.env.PORT, () =>
    console.log(
      `Server running on http://localhost:${process.env.PORT}/api/graphql`,
    ),
  );
};
main().catch(e => console.error(e));
