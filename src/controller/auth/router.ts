import { Router } from 'express';
import {
  login,
  register,
  changePassword,
  getProfile,
  updateProfile,
  isduplicated,
} from './controller';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.put('/password', changePassword);
authRouter.get('/profile', getProfile);
authRouter.put('/profile', updateProfile);
authRouter.post('/isduplicated', isduplicated);
export default authRouter;
