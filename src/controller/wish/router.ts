import { Router } from 'express';
import { createWish, deleteWish, getWishList } from './controller';

const wishRouter = Router();

wishRouter.post('/:clothesId', createWish);
wishRouter.put('/:clothesId', deleteWish);
wishRouter.get('/', getWishList);

export default wishRouter;
