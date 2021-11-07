/* eslint-disable no-console */
import compression from "compression";
import cors from 'cors';
import express from "express";
import fileUpload from "express-fileupload";
import rateLimit from 'express-rate-limit';
import morgan from 'morgan'
import { join, resolve } from 'path';
import connect from "./db/connect";
import 'dotenv/config';

const main = async () => {
  const app = express();
  connect()
  app.use(compression());
  app.set('trust proxy', 1);
  app.use(express.json());
  app.disable('x-powered-by')
  app.use(fileUpload({ safeFileNames: true }));
  app.use(morgan('dev'))
  const dirname = resolve()
  app.use('/uploads', express.static(join(dirname, '/uploads')))
  
  
  app.use(
    cors({
      origin: process.env.NODE_ENV !== 'production' ? ['http://localhost:3000', 'http://localhost:4000'] : [''],
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
  // app.use('/api/products', productRoutes)
  // app.use('/api/users', userRoutes)
  // app.use('/api/orders', orderRoutes)
  // app.use('/api/upload', uploadRoutes)


}
main().catch(e => console.error(e));
