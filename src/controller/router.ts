import { Router } from 'express';
import userRouter from './user/router';
import authRouter from './auth/router';
import closetRouter from './closet/router';
import clothesRouter from './clothes/router';
import lendRouter from './lend/router';
import wishRouter from './wish/router';

const router = Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/closet', closetRouter);
router.use('/clothes', clothesRouter);
router.use('/lend', lendRouter);
router.use('/wish', wishRouter);

export default router;
