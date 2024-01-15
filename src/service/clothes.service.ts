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
import Category from '../common/enum/category.enum';
import Season from '../common/enum/season.enum';
import Status from '../common/enum/season.enum';
import LendRepository from '../repository/lend.repository';
import reviewRes from '../type/lend/review.res';
import WishRepository from '../repository/wish.repository';
import SearchClothesRes from '../type/clothes/searchClothes.res';

export default class ClothesService {
  static async createClothes(
    clothesInfo: CreateClothesReq,
    userId: number,
  ): Promise<Clothes> {
    //Todo. image 유효성 검사
    const userInfo = (await UserRepository.findOneByUserId(userId)) as User;

    const clothes: Clothes = {
      closet: clothesInfo.closet,
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

    let isWished = false;

    if (userId) {
      const wish = await WishRepository.findWishByData(userId, clothesId, true);
      if (wish) {
        isWished = true;
      }
    }
    const getClothesRes: GetClothesRes = {
      id: clothes.id,
      closet: clothes.closet,
      category: clothes.category,
      season: clothes.season,
      status: clothes.status,
      isOpen: clothes.isOpen,
      name: clothes.name,
      tag: clothes.tag,
      image: clothes.image,
      owner: clothes.owner,
      review: review,
      isWished: isWished,
    };

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

  static async searchClothes(
    categories: Category[],
    seasons: Season[],
    filter: Status[],
    text: string,
  ): Promise<SearchClothesRes[]> {
    return await ClothesRepository.findByCategorySeasonName(
      categories,
      seasons,
      filter,
      text,
    );
  }
}
