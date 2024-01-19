import { Router } from 'express';
import { modifyReview } from './controller';
import { deleteReview } from './controller';

const reviewRouter = Router();
reviewRouter.put('/:lendId', modifyReview);
reviewRouter.delete('/:lendId', deleteReview);

export default reviewRouter;
