import { Router } from 'express';
import { applyLend } from './controller';

const lendRouter = Router();

lendRouter.post('/', applyLend);

export default lendRouter;
