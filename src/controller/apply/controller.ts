import UserRepository from '../../repository/user.repository';
import LoginUser from '../../type/user/loginUser';
import { RequestHandler } from 'express';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import DefaultRes from '../../type/default.res';
import createApplyReq from '../../type/apply/createApply.req';
import ApplyService from '../../service/apply.service';

export const createApply: RequestHandler = async (req, res, next) => {
  try {
    const { clothes, detail } = req.body;
    const user = req.user as LoginUser;

    const foundUser = await UserRepository.findOneByUsername(user.username);

    if (!foundUser) {
      throw new BadRequestError('User not found.');
    }

    const applyInfo: createApplyReq = {
      user: foundUser,
      clothes,
      isAccepted: false,
      isRejected: false,
      detail,
    };

    await ApplyService.createApply(applyInfo);

    const message: DefaultRes = {
      message: 'Apply created successful',
    };

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const approveApply: RequestHandler = async (req, res, next) => {
  try {
    const applyId = Number(req.params.applyId);

    const user = req.user as LoginUser;
    if (!user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다');
    }

    await ApplyService.approveApply(applyId, user.id);

    const message: DefaultRes = { message: '대여신청이 수락되었습니다.' };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const rejectApply: RequestHandler = async (req, res, next) => {
  try {
    const applyId = Number(req.params.applyId);

    const user = req.user as LoginUser;
    if (!user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다');
    }

    await ApplyService.rejectApply(applyId, user.id);

    const message: DefaultRes = { message: '대여신청이 거절되었습니다.' };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const getArrivedApply: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as LoginUser;
    if (!user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다');
    }
    const userId = Number(user.id);
    const response = await ApplyService.findArrivedApply(userId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getSendedApply: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as LoginUser;
    if (!user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다');
    }
    const userId = Number(user.id);
    const response = await ApplyService.findSendedApply(userId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
