import { compareSync } from 'bcryptjs';
import { CookieOptions, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as redis from '../db/redis';
import { User } from '../entities/User';
import { AuthConstants } from './constants';

export function createSessionToken(userId: string) {
  return jwt.sign(userId, process.env.JWT_SECRET);
}

export function setCookie(token: string, res: Response) {
  const options: CookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + AuthConstants.cookieExpires),
  };
  if (process.env.NODE_ENV === 'production') {
    options.sameSite = 'lax';
    options.secure = true;
  }
  res.cookie(AuthConstants.cookieName, token, options);
}

export async function validateUserPassword(userId: string, password: string) {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return false;
  }
  return compareSync(password, user.password);
}

export async function getUser(userId: string) {
  return User.findOne({ where: { id: userId } });
}

/**
 * get the authenticated user from the db or redis
 * @param userId The userId of the authenticated user
 */

export async function getSessionUser(
  userId: string,
): Promise<Omit<User, 'password' | 'productId'> | null> {
  const cache = await redis.get(userId);
  if (!cache) {
    const user = await getUser(userId);

    if (!user) {
      redis.del(userId);
      return null;
    }
    redis.set(userId, JSON.stringify(user));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return user;
  }
  try {
    return JSON.parse(cache);
  } catch {
    return null;
  }
}
