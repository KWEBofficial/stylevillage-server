import { Router } from 'express';
import { createLend, getMyLends } from './controller';

const lendRouter = Router();

lendRouter.post('/', createLend);
lendRouter.get('/', getMyLends);

export default lendRouter;
