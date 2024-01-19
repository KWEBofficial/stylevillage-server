import { Router } from 'express';
import { getClosetList, postCloset } from './controller';
import { getCloset } from './controller';
import { modifyCloset } from './controller';
import { deleteCloset } from './controller';

const closetRouter = Router();

closetRouter.post('/', postCloset);
closetRouter.get('/', getClosetList);
closetRouter.get('/:closetId', getCloset);
closetRouter.put('/:closetId', modifyCloset);
closetRouter.delete('/:closetId', deleteCloset);

export default closetRouter;
