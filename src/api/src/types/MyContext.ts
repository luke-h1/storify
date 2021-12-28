import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createOrderLoader } from 'src/loaders/createOrderLoader';
import { createProductLoader } from '../loaders/createProductLoader';
import { createUserLoader } from '../loaders/createUserLoader';

export type MyContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: Request & { session: any };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  orderLoader: ReturnType<typeof createOrderLoader>;
  productLoader: ReturnType<typeof createProductLoader>;
};
