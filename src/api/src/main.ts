import 'reflect-metadata';
import 'dotenv/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csurf from 'csurf';
import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import connect from './db/connect';
import { fileSizeLimit, notFound } from './middlewares';
import apiRouter from './routes/api';

const main = async () => {
  const server = express();

  const conn = await connect();
  await conn.runMigrations();

  server.disable('x-powered-by');
  server.use(cookieParser());

  server.use(
    cors({
      origin: process.env.CORS_ORIGIN_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'HEAD'],
    }),
  );
  server.use(compression());
  server.use(express.json());
  server.use(helmet());
  server.use(fileUpload({ safeFileNames: true }));
  server.use(fileSizeLimit);

  server.use('/api', apiRouter, csurf({ cookie: true }));

  server.use(notFound);

  server.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
  });
};
// eslint-disable-next-line no-console
main().catch(e => console.error(e));
