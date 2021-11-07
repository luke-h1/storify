/* eslint-disable no-console */
import compression from "compression";
import cors from 'cors';
import express from "express";
import fileUpload from "express-fileupload";
import rateLimit from 'express-rate-limit';

const main = async () => {
  const app = express();
  app.use(compression());
  app.set('trust proxy', 1);
  app.use(express.json());
  app.disable('x-powered-by')
  app.use(fileUpload({ safeFileNames: true }));

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

}
main().catch(e => console.error(e));
