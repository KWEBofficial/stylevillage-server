import { RequestHandler } from 'express';
import LoginUser from '../../type/user/loginUser';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import LendService from '../../service/lend.service';
import DefaultRes from '../../type/default.res';

export const modifyReview: RequestHandler = async (req, res, next) => {
  try {
    const lendId = Number(req.params.lendId);
    const user = req.user as LoginUser;
    const { review } = req.body;

    if (!user) {
      throw new BadRequestError('로그인이 필요한 기능입니다.');
    }

    await LendService.modifyReview(review, lendId, user.id);

    const message: DefaultRes = { message: '리뷰가 작성되었습니다.' };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const deleteReview: RequestHandler = async (req, res, next) => {
  try {
    const lendId = Number(req.params.lendId);
    if (!lendId) {
      throw new BadRequestError('해당 대여 내역이 없습니다.');
    }
    const user = req.user as LoginUser;
    if (!user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다.');
    }
    await LendService.deleteReview(user.id, lendId);
    const message: DefaultRes = { message: '리뷰가 삭제되었습니다.' };
    res.json(message);
  } catch (error) {
    next(error);
  }
};
