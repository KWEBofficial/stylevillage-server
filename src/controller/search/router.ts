import { Router } from 'express';
import { searchClothes } from './controller';

const searchRouter = Router();

searchRouter.get('/', searchClothes);

export default searchRouter;
