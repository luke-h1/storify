/* eslint-disable no-console */
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getSessionUser } from '../lib/auth';
import { AuthConstants } from '../lib/constants';
import { IRequest } from '../types/IRequest';

export async function withAuth(
  req: IRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const token = req.cookies[AuthConstants.cookieName] || req.headers.session;
  const secret = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).json({ error: 'invalid token', status: 'error' });
  }
  try {
    const vToken = jwt.verify(token, secret);
    const user = await getSessionUser(vToken as string);
    if (!user) {
      return res.status(401).json({
        error: 'user not found',
        status: 'error',
      });
    }

    req.userId = user.id;

    return next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: 'invalid token', status: 'error' });
  }
}
