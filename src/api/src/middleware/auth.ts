/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { IRequest } from '../types';

const protect = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // eslint-disable-next-line prefer-destructuring
        token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // @ts-ignore
        req.user = await User.findById(decoded.id).select('-password');
        next();
      } catch (e) {
        console.error(e);
        res.status(401).json({ message: 'Unauthorized' });
      }
    }
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  },
);

const admin = (req: IRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
export { protect, admin };
