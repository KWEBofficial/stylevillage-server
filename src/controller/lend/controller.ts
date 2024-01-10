import LendService from '../../service/lend.service';
import UserRepository from '../../repository/user.repository';
import LoginUser from '../../type/user/loginUser';
//import ClosetRepository from '../../repository/closet.repository';
import ClothesRepository from '../../repository/clothes.repository';
import { RequestHandler } from 'express';
import lendapplyReq from '../../type/lend/lendapply.req';
import { BadRequestError } from '../../util/customErrors';
import DefaultRes from '../../type/default.res';

export const applyLend: RequestHandler = async (req, res, next) => {
  try {
    const { clothes, price, start_date, end_date } = req.body;
    const user = req.user as LoginUser;

    const foundUser = await UserRepository.findOneByUsername(user.username);

    if (!foundUser) {
      throw new BadRequestError('User not found.');
    }

    const lender = (await ClothesRepository.findOneByClothesId(clothes)).closet
      .owner;

    if (!lender) {
      throw new BadRequestError('Loanee not found.');
    }

    const applyInfo: lendapplyReq = {
      clothes,
      price,
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      loanee: foundUser,
      lender,
      review: '',
    };

    await LendService.createApply(applyInfo);

    const message: DefaultRes = {
      message: 'Apply created successful',
    };

    res.json(message);
  } catch (error) {
    next(error);
  }
};
