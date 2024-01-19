import { Router } from 'express';
import userRouter from './user/router';
import authRouter from './auth/router';
import closetRouter from './closet/router';
import clothesRouter from './clothes/router';
import lendRouter from './lend/router';
import reviewRouter from './review/router';
import applyRouter from './apply/router';
import wishRouter from './wish/router';
import { searchClothes } from './clothes/controller';

const router = Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/closet', closetRouter);
router.use('/clothes', clothesRouter);
router.use('/lend', lendRouter);
router.use('/review', reviewRouter);
router.use('/apply', applyRouter);
router.use('/wish', wishRouter);
router.get('/search', searchClothes);

export default router;
