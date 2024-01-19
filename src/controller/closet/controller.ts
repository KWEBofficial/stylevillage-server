import { RequestHandler } from 'express';
import ClosetService from '../../service/closet.service';
import getClosetRes from '../../type/closet/getCloset.res';
import modifyClosetReq from '../../type/closet/modifyCloset.req';
import Closet from '../../type/closet/closet';
import LoginUser from '../../type/user/loginUser';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import getClosetListRes from '../../type/closet/getClosetList.res';
import DefaultRes from '../../type/default.res';
import AuthService from '../../service/auth.service';
import ClosetRepository from '../../repository/closet.repository';

export const postCloset: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new BadRequestError('옷장 이름을 입력하세요.');
    }
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다.');
    }
    const { id: owner } = req.user as LoginUser;
    const closet: Closet = {
      name,
      owner,
    };
    await ClosetService.postCloset(closet);

    const message: DefaultRes = {
      message: '옷장이 등록되었습니다.',
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const getClosetList: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다.');
    }
    const { id } = req.user as LoginUser;
    const closetList: getClosetListRes = await ClosetService.getClosetList(id);
    res.json(closetList);
  } catch (error) {
    next(error);
  }
};

export const getCloset: RequestHandler = async (req, res, next) => {
  try {
    const closetId = Number(req.params.closetId);
    const user = req.user as LoginUser;
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new BadRequestError('유효하지 않은 토큰입니다.');
    }
    const userbytoken = await AuthService.getUserFromToken(token);
    if (
      userbytoken.id !== (await ClosetRepository.getUserIdbyClosetId(closetId))
    ) {
      throw new BadRequestError('접근 권한이 없습니다.');
    }

    const closetInfo: getClosetRes = await ClosetService.getCloset(
      closetId,
      req.user ? user.id : undefined,
    );

    res.json(closetInfo);
  } catch (error) {
    next(error);
  }
};

export const modifyCloset: RequestHandler = async (req, res, next) => {
  try {
    const closetId = Number(req.params.closetId);

    const user = req.user as LoginUser;
    if (!user) throw new UnauthorizedError('로그인이 필요한 기능입니다.');

    const { name } = req.body;
    if (!name) throw new BadRequestError('옷장 이름을 입력해 주세요.');

    const closet: modifyClosetReq = {
      id: closetId,
      name: name,
    };

    await ClosetService.modifyCloset(closet, user.id);

    const message: DefaultRes = {
      message: '옷장 이름이 변경되었습니다.',
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const deleteCloset: RequestHandler = async (req, res, next) => {
  try {
    const closetId = Number(req.params.closetId);

    if (!req.user) {
      throw new UnauthorizedError('로그인이 필요한 기능입니다.');
    }
    const { id } = req.user as LoginUser;

    await ClosetService.deleteCloset(closetId, id);

    const message: DefaultRes = {
      message: '옷장이 삭제되었습니다.',
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};
