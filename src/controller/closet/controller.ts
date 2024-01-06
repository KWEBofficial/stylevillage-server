import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import ClosetService from '../../service/closet.service';
import Closet from '../../type/closet/closet';
import PostClosetReq from '../../type/closet/postCloset.req';
import PostClosetRes from '../../type/closet/postCloset.res';
import LoginUser from '../../type/user/loginUser';

export const postCloset: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new BadRequestError('옷장 이름을 입력하세요.');
    }
    const { id } = req.user as LoginUser;
    if (!id) {
      throw new BadRequestError('로그인이 필요한 기능입니다.');
    }
    const owner = Number(id);
    const closet: Closet = {
      name,
      owner,
    };
    await ClosetService.postCloset(closet);

    const postClosetRes: PostClosetRes = { name };
    res.json(postClosetRes);
  } catch (error) {
    next(error);
  }
};
