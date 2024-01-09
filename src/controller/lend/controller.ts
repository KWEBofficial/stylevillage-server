import LendService from '../../service/lend.service';
import UserRepository from '../../repository/user.repository';
import LoginUser from '../../type/user/loginUser';
//import ClosetRepository from '../../repository/closet.repository';
import ClothesRepository from '../../repository/clothes.repository';
import { RequestHandler } from 'express';
import lendapplyReq from '../../type/lend/lendapply.req';
import { BadRequestError } from '../../util/customErrors';

export const applyLend: RequestHandler = async (req, res, next) => {
  try {
    const { clothes, price, start_date, end_date } = req.body;
    const user = req.user as LoginUser;

    const foundUser = await UserRepository.findOneByUsername(user.username);

    if (!foundUser) {
      throw new BadRequestError('User not found.');
    }

    const loanee = (await ClothesRepository.findOneByClothesId(clothes)).closet
      .owner;

    if (!loanee) {
      throw new BadRequestError('Loanee not found.');
    }

    const applyInfo: lendapplyReq = {
      clothes,
      price,
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      lender: foundUser,
      loanee,
      review: '',
    };

    await LendService.createApply(applyInfo);

    res.json({ isSuccess: true });
  } catch (error) {
    next(error);
  }
};
