import { RequestHandler } from 'express';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import WishService from '../../service/wish.service';
import CreateWishReq from '../../type/wish/createWish.req';
import DefaultRes from '../../type/default.res';
import LoginUser from '../../type/user/loginUser';
import GetWishListRes from '../../type/wish/getWishList.res';

export const createWish: RequestHandler = async (req, res, next) => {
  try {
    const clothesId = Number(req.params.clothesId);

    if (!clothesId) throw new BadRequestError('찜할 옷 항목이 없습니다.');

    const user = req.user as LoginUser;

    if (!user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다.');
    }

    const wishInfo: CreateWishReq = {
      clothesId,
    };

    await WishService.createWish(wishInfo, user.id);

    const message: DefaultRes = { message: '찜이 생성되었습니다.' };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const deleteWish: RequestHandler = async (req, res, next) => {
  try {
    const clothesId = Number(req.params.clothesId);

    if (!clothesId)
      throw new BadRequestError('찜을 삭제할 옷 항목이 없습니다.');

    const user = req.user as LoginUser;

    if (!user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다.');
    }

    const wishInfo: CreateWishReq = { clothesId };

    await WishService.deleteWish(wishInfo, user.id);

    const message: DefaultRes = { message: '찜이 삭제되었습니다.' };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const getWishList: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as LoginUser;

    if (!user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다.');
    }

    const wishList: GetWishListRes = await WishService.getWishList(user.id);
    res.json(wishList);
  } catch (error) {
    next(error);
  }
};
