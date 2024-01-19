import { RequestHandler } from 'express';
import LendService from '../../service/lend.service';
import LoginUser from '../../type/user/loginUser';
import DefaultRes from '../../type/default.res';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import UserRepository from '../../repository/user.repository';
import ClothesRepository from '../../repository/clothes.repository';
import createLendReq from '../../type/lend/createLend.req';

export const createLend: RequestHandler = async (req, res, next) => {
  try {
    const { clothes, price, start_date, end_date } = req.body;
    const user = req.user as LoginUser;

    const foundUser = await UserRepository.findOneByUsername(user.username);

    if (!foundUser) {
      throw new BadRequestError('User not found.');
    }

    const lender = (await ClothesRepository.findOneByClothesId(clothes)).owner;

    if (!lender) {
      throw new BadRequestError('Lender not found.');
    }

    const lendInfo: createLendReq = {
      clothes,
      price,
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      loanee: foundUser,
      lender,
      review: '',
    };

    await LendService.createLend(lendInfo);

    const message: DefaultRes = {
      message: 'Apply created successful',
    };

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const getMyLends: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as LoginUser;
    if (!user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다.');
    }
    const lendsAsLender = await LendService.getLendsAsLender(user.id);
    const lendsAsLoanee = await LendService.getLendAsLoanee(user.id);

    res.json({ lendsAsLender, lendsAsLoanee });
  } catch (error) {
    next(error);
  }
};
