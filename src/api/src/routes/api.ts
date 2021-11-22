import { Router } from 'express';
import { notFound } from '../middlewares';
import { authRouter } from './auth';

const router = Router();

router.use('/auth', authRouter);
router.use(notFound);

export default router;
