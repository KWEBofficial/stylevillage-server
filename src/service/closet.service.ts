import Closet from '../entity/closet.entity';
import Clothes from '../entity/clothes.entity';
import ClosetRepository from '../repository/closet.repository';
import ClothesRepository from '../repository/clothes.repository';
import getClosetRes from '../type/closet/getCloset.res';
import getClosetClothes from '../type/clothes/getClosetClothes';
import userRes from '../type/user/user.res';
import PostClosetReq from '../type/closet/postCloset.req';
import modifyClosetReq from '../type/closet/modifyCloset.req';
import { UpdateResult } from 'typeorm';
import { BadRequestError } from '../util/customErrors';
import getClosetListRes from '../type/closet/getClosetList.res';

export default class ClosetService {
  static async getCloset(
    closetId: number,
    userId: number | undefined,
  ): Promise<getClosetRes> {
    const closet: Closet = await ClosetRepository.findOneByClosetId(closetId);
    const clothes: Clothes[] = !userId
      ? await ClothesRepository.findOpenByClosetId(closetId)
      : await ClothesRepository.findVisibleByClosetId(closetId, userId);

    const clothesInfo: Array<getClosetClothes> = clothes.map((clothes) => {
      const eachClothes: getClosetClothes = {
        id: clothes.id,
        category: clothes.category,
        season: clothes.season,
        status: clothes.status,
        name: clothes.name,
        tag: clothes.tag,
        image: clothes.image,
        isOpen: clothes.isOpen,
      };
      return eachClothes;
    });

    const ownerInfo: userRes = {
      id: closet.owner.id,
      username: closet.owner.username,
      nickname: closet.owner.nickname,
    };

    const closetInfo: getClosetRes = {
      id: closet.id,
      name: closet.name,
      owner: ownerInfo,
      clothes: clothesInfo,
    };

    return closetInfo;
  }

  static async postCloset(closet: PostClosetReq): Promise<Closet> {
    const newCloset = ClosetRepository.create(closet);
    return await ClosetRepository.save(newCloset);
  }

  static async getClosetList(userId: number): Promise<getClosetListRes> {
    const closetInfo = await ClosetRepository.findByUserId(userId);
    const closets = closetInfo.map((closet) => ({
      id: closet.id,
      name: closet.name,
    }));
    return { closets };
  }

  static async modifyCloset(
    closet: modifyClosetReq,
    userId: number,
  ): Promise<UpdateResult> {
    const ownerId = await ClosetRepository.getOwnerId(closet.id);
    if (ownerId != userId)
      throw new BadRequestError('본인의 옷장만 수정할 수 있습니다.');

    return await ClosetRepository.update(closet.id, { name: closet.name });
  }

  static async deleteCloset(
    closetId: number,
    userId: number,
  ): Promise<UpdateResult> {
    const ownerId = await ClosetRepository.getOwnerId(closetId);
    if (ownerId != userId)
      throw new BadRequestError('본인의 옷장만 삭제할 수 있습니다.');

    await ClothesRepository.update(
      { closet: { id: closetId } },
      { closet: undefined },
    );

    return await ClosetRepository.softDelete(closetId);
  }
}
