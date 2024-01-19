import { Router } from 'express';
import {
  createClothes,
  getClothes,
  modifyClothes,
  deleteClothes,
  getPopularClothes,
  getClothesList,
} from './controller';

const clothesRouter = Router();

clothesRouter.post('/', createClothes);
clothesRouter.put('/:clothesId', modifyClothes);
clothesRouter.get('/user/:userId', getClothesList);
clothesRouter.get('/:clothesId', getClothes);
clothesRouter.delete('/:clothesId', deleteClothes);
clothesRouter.get('/popular/:count', getPopularClothes);
export default clothesRouter;
