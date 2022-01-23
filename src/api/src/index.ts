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
  const RedisStore = connectRedis(session);
  app.set('trust-proxy', 1);

  app.use(
    cors({
      origin: isProd
        ? process.env.CORS_ORIGIN
        : [process.env.CORS_ORIGIN, 'https://studio.apollographql.com'],
      credentials: true,
    }),
  );

  app.use(
    session({
      name: '_storify-fid',
      proxy: true,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        domain: isProd ? '.storify-ecommerce-mock.xyz' : undefined,
        signed: !!isProd,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    }),
  );

  const apolloServer = new ApolloServer({
    plugins: [
      isProd
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginInlineTrace(),
    ],
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
