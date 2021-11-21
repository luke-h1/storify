import 'dotenv/config';
import { logger } from '@utils/logger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csurf from 'csurf';
import express from 'express';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { fileSizeLimit, notFound } from './middlewares';
import apiRouter from './routes/api';

const server = express();

server.disable('x-powered-by');
server.use(cookieParser());
server.use(
  cors({
    origin: [process.env.CORS_ORIGIN_URL],
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
  logger.log('API', `Server listening on http://localhost:${process.env.PORT}`);
});
