import Clothes from '../type/clothes/Clothes';
import User from '../entity/user.entity';
import CreateClothesReq from '../type/clothes/createClothes.req';
import ClothesRepository from '../repository/clothes.repository';
import ModifyClothesReq from '../type/clothes/modifyClothes.req';
import { UpdateResult } from 'typeorm';
import GetClothesReq from '../type/clothes/getClothes.req';
import GetClothesRes from '../type/clothes/getClothes.res';
import { BadRequestError, ForbiddenError } from '../util/customErrors';
import UserRepository from '../repository/user.repository';
import LendRepository from '../repository/lend.repository';
import reviewRes from '../type/lend/review.res';
import WishRepository from '../repository/wish.repository';
import GetClothesListRes from '../type/clothes/getClothesList.res';
import UserRes from '../type/user/user.res';
import SearchClothesRes from '../type/clothes/searchClothes.res';
import SearchClothesReq from '../type/clothes/searchClothes.req';

export default class ClothesService {
  static async createClothes(
    clothesInfo: CreateClothesReq,
    userId: number,
  ): Promise<Clothes> {
    //Todo. image 유효성 검사
    const userInfo = (await UserRepository.findOneByUserId(userId)) as User;

    const clothes: Clothes = {
      closet: clothesInfo.closet,
      description: clothesInfo.description,
      category: clothesInfo.category,
      season: clothesInfo.season,
      status: clothesInfo.status,
      isOpen: clothesInfo.isOpen,
      name: clothesInfo.name,
      tag: clothesInfo.tag,
      image: clothesInfo.image,
      owner: userInfo,
    };

    if (clothesInfo.closet && clothesInfo.closet?.owner.id != userId) {
      throw new BadRequestError('본인의 옷장만 지정할 수 있습니다.');
    }

    const newClothes: Clothes = ClothesRepository.create(clothes);
    return await ClothesRepository.save(newClothes);
  }

  static async modifyClothes(
    userId: number,
    clothesId: number,
    clothesInfo: ModifyClothesReq,
  ): Promise<UpdateResult> {
    const clothes = await ClothesRepository.findOneByClothesId(clothesId);

    if (clothes.owner.id != userId) {
      throw new BadRequestError('본인의 옷만 수정할 수 있습니다.');
    }

    if (clothesInfo.closet && clothesInfo.closet?.owner.id != userId) {
      throw new BadRequestError('본인의 옷장만 지정할 수 있습니다.');
    }

    return await ClothesRepository.update({ id: clothesId }, clothesInfo);
  }

  static async getClothes(
    id: GetClothesReq,
    userId: number | null,
  ): Promise<GetClothesRes> {
    const { clothesId } = id;
    const clothes = await ClothesRepository.findOneByClothesId(clothesId);

    if (!(clothes.isOpen || (userId && userId === clothes.owner.id)))
      throw new ForbiddenError('공개되지 않은 옷입니다.');

    const review: reviewRes[] =
      await LendRepository.getReviewByClothesId(clothesId);
    const owner: UserRes = {
      id: clothes.owner.id,
      username: clothes.owner.username,
      nickname: clothes.owner.nickname,
    };
    const wishCount = await WishRepository.findAndCountByclothesId(clothesId);

    const getClothesRes: GetClothesRes = {
      id: clothes.id,
      description: clothes.description,
      closet: clothes.closet,
      category: clothes.category,
      season: clothes.season,
      status: clothes.status,
      isOpen: clothes.isOpen,
      name: clothes.name,
      tag: clothes.tag,
      image: clothes.image,
      owner: owner,
      review,
      isWished: false,
      wishCount,
    };

    if (userId) {
      const wish = await WishRepository.findWishByData(userId, clothesId, true);
      if (wish) {
        getClothesRes.isWished = true;
      }
    }

    return getClothesRes;
  }

  static async deleteClothes(
    clothesId: number,
    userId: number,
  ): Promise<UpdateResult> {
    const clothes = await ClothesRepository.findOneByClothesId(clothesId);

    if (clothes.owner.id != userId) {
      throw new BadRequestError('본인의 옷만 삭제할 수 있습니다.');
    }

    return await ClothesRepository.softDelete(clothesId);
  }

  static async getPopularClothes(
    count: number,
    userId: number | null,
  ): Promise<GetClothesListRes[]> {
    const clothesList = await ClothesRepository.findOrderByWishCount(count);
    const clothesListWithIsWished: GetClothesListRes[] = await Promise.all(
      clothesList.map(async (clothes) => {
        const clothesWithIsWished: GetClothesListRes = {
          id: clothes.id,
          closetId: clothes.closet?.id ?? null,
          category: clothes.category ?? null,
          season: clothes.season ?? null,
          status: clothes.status,
          isOpen: clothes.isOpen,
          name: clothes.name,
          tag: clothes.tag ?? null,
          isWished: false,
        };
        if (userId) {
          const isWished = await WishRepository.findWishByData(
            userId,
            clothes.id,
            true,
          );
          clothesWithIsWished.isWished = isWished ? true : false;
        }
        return clothesWithIsWished;
      }),
    );
    return clothesListWithIsWished;
  }

  static async searchClothes(
    userId: number | undefined,
    searchClothesReq: SearchClothesReq,
  ): Promise<SearchClothesRes[]> {
    const clothes = await ClothesRepository.findByOptions(searchClothesReq);

    const clothesList = Promise.all(
      clothes.map(async (clothes) => {
        const owner: UserRes = {
          id: clothes.owner.id,
          username: clothes.owner.username,
          nickname: clothes.owner.nickname,
        };

        const searchClothesRes: SearchClothesRes = {
          id: clothes.id,
          closetId: clothes.closet?.id,
          category: clothes.category,
          season: clothes.season,
          status: clothes.status,
          isOpen: clothes.isOpen,
          name: clothes.name,
          tag: clothes.tag,
          image: clothes.image,
          owner: owner,
          isWished: false,
        };

        if (userId) {
          const isWished = await WishRepository.findWishByData(
            userId,
            clothes.id,
            true,
          );
          searchClothesRes.isWished = isWished ? true : false;
        }

        return searchClothesRes;
      }),
    );
    return clothesList;
  }
}
