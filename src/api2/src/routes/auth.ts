import { validateSchema } from '@casper124578/utils';
import { withAuth } from '@hooks/withAuth';
import { AuthConstants } from '@lib/constants';
import { authenticateSchema } from '@schemas/auth';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { Response, Router } from 'express';
import { prisma } from '../db/prisma';
import * as redis from '../db/redis';
import {
  createSessionToken,
  getSessionUser,
  setCookie,
  validateUserPassword,
} from '../lib/auth';
import { IRequest } from '../types/IRequest';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, name, password } = req.body;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [error] = await validateSchema(authenticateSchema(true), {
    email,
    name,
    password,
  });

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: 'error',
    });
  }
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    return res.status(404).json({
      error: 'Email already in use',
      status: 'error',
    });
  }

  const hash = hashSync(password, genSaltSync(15));

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  });

  const token = createSessionToken(createdUser.id);
  setCookie(token, res);
  return res.json({ userId: createdUser.id });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [error] = await validateSchema(authenticateSchema(false), {
    email,
    password,
  });

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: 'error',
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      error: 'user not found',
      status: 'error',
    });
  }

  const validPassword = compareSync(password, user.password);

  if (!validPassword) {
    return res.status(400).json({
      error: 'invalid credentials',
      status: 'error',
    });
  }
  const token = createSessionToken(user.id);
  setCookie(token, res);

  return res.json({ userId: user.id });
});

router.post('/user', withAuth, async (req: IRequest, res) => {
  if (!req.userId) {
    return res.status(400).json({
      error: 'user id is required',
      status: 'error',
    });
  }

  const user = await getSessionUser(req.userId);
  return res.status(200).json({ user });
});

router.put('/user', withAuth, async (req: IRequest, res: Response) => {
  const { body } = req;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [error] = await validateSchema(authenticateSchema(true), body);

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: 'error',
    });
  }
  if (!req.userId) {
    return res.status(400).json({
      error: 'user id is required',
      status: 'error',
    });
  }

  const validPassword = await validateUserPassword(
    req.userId,
    req.body.password,
  );

  if (!validPassword) {
    res.status(400).json({
      error: 'passwords do not match',
      status: 'error',
    });
  }

  const user = await prisma.user.update({
    where: {
      id: req.userId,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
    },
    select: {
      id: true,
      createdAt: true,
      name: true,
      email: true,
      products: { select: { name: true, id: true } },
    },
  });
  await redis.set(req.userId, JSON.stringify(user));
  return res.json({ user });
});

router.post('/logout', withAuth, async (req: IRequest, res: Response) => {
  if (!req.userId) {
    return res.status(400).json({
      error: 'user id is required',
      status: 'error',
    });
  }
  await redis.del(req.userId);

  req.userId = '';

  res.clearCookie(AuthConstants.cookieName);

  return res.status(200).json({ status: 'success' });
});

export const authRouter = router;
