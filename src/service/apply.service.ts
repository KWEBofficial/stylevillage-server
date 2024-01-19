import { UpdateResult } from 'typeorm';
import ApplyRepository from '../repository/apply.repository';
import { UnauthorizedError } from '../util/customErrors';
import createApplyReq from '../type/apply/createApply.req';
import Apply from '../entity/apply.entity';
import getUserApplyRes from '../type/apply/getUserApply.res';
import getSendedApply from '../type/apply/getSendedApply.res copy';

export default class ApplyService {
  static async createApply(applyInfo: createApplyReq): Promise<Apply> {
    const newApply = ApplyRepository.create(applyInfo);
    return await ApplyRepository.save(newApply);
  }
  static async approveApply(
    applyId: number,
    userId: number,
  ): Promise<UpdateResult> {
    const apply = await ApplyRepository.findOneByApplyId(applyId);

    if (userId != apply.clothes.owner.id) {
      throw new UnauthorizedError(
        '본인의 옷에 대한 대여신청만 수락할 수 있습니다.',
      );
    }

    return await ApplyRepository.update({ id: apply.id }, { isAccepted: true });
  }

  static async rejectApply(
    applyId: number,
    userId: number,
  ): Promise<UpdateResult> {
    const apply = await ApplyRepository.findOneByApplyId(applyId);

    if (userId != apply.clothes.owner.id) {
      throw new UnauthorizedError(
        '본인의 옷에 대한 대여신청만 거절할 수 있습니다.',
      );
    }

    return await ApplyRepository.update({ id: apply.id }, { isRejected: true });
  }
  static async findArrivedApply(userId: number): Promise<getUserApplyRes[]> {
    const applies: Apply[] =
      await ApplyRepository.findArrivedApplyByUserId(userId);
    const applyInfos: Array<getUserApplyRes> = applies.map((apply) => {
      const eachApply: getUserApplyRes = {
        id: apply.id,
        clothes: {
          id: apply.clothes.id,
          name: apply.clothes.name,
          image: apply.clothes.image,
        },
        user: {
          id: apply.user.id,
          nickname: apply.user.nickname,
        },
        detail: apply.detail,
      };
      return eachApply;
    });
    return applyInfos;
  }

  static async findSendedApply(userId: number): Promise<getSendedApply[]> {
    const applies: Apply[] =
      await ApplyRepository.findSendedApplyByUserId(userId);
    const applyInfos: Array<getSendedApply> = applies.map((apply) => {
      const eachApply: getSendedApply = {
        id: apply.id,
        clothes: {
          id: apply.clothes?.id,
          name: apply.clothes?.name,
          image: apply.clothes?.image,
        },
        owner: {
          id: apply.clothes?.owner?.id,
          username: apply.clothes?.owner?.username,
          nickname: apply.clothes?.owner?.nickname,
        },
        isAccepted: apply.isAccepted,
        isRejected: apply.isRejected,
        detail: apply.detail,
      };
      return eachApply;
    });
    return applyInfos;
  }
}
