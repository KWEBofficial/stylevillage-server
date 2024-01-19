import Wish from '../entity/wish.entity';
import { UpdateResult } from 'typeorm';
import CreateWishReq from '../type/wish/createWish.req';
import ClothesRepository from '../repository/clothes.repository';
import UserRepository from '../repository/user.repository';
import WishRepository from '../repository/wish.repository';
import { BadRequestError } from '../util/customErrors';
import GetClothesListRes from '../type/clothes/getClothesList.res';

export default class WishService {
  static async createWish(
    wishInfo: CreateWishReq,
    userId: number,
  ): Promise<UpdateResult | Wish> {
    const wish = await WishRepository.findWishByUserIdClothesId(
      userId,
      wishInfo.clothesId,
    );
    if (!wish) {
      const clothes = await ClothesRepository.findOneByClothesId(
        wishInfo.clothesId,
      );
      const user = await UserRepository.findOneByUserId(userId);
      const newWish = WishRepository.create({
        user: user,
        clothes: clothes,
        isWished: true,
      });
      return await WishRepository.save(newWish);
    } else if (wish?.isWished == true) {
      throw new BadRequestError('이미 찜한 옷입니다.');
    } else {
      return await WishRepository.update({ id: wish.id }, { isWished: true });
    }
  }

  static async deleteWish(
    wishInfo: CreateWishReq,
    userId: number,
  ): Promise<UpdateResult> {
    const wish = await WishRepository.findWishByUserIdClothesId(
      userId,
      wishInfo.clothesId,
    );

    if (!wish)
      throw new BadRequestError('해당 옷에 대한 찜 정보를 찾을 수 없습니다.');
    else if (wish?.isWished == false) {
      throw new BadRequestError('찜 목록에 없는 옷입니다');
    }
    return await WishRepository.update({ id: wish.id }, { isWished: false });
  }

  static async getWishList(userId: number): Promise<GetClothesListRes[]> {
    const wishesInfo = await WishRepository.findWishesByUser(userId);
    const wishList = Promise.all(
      wishesInfo.map(async (wish) => {
        if (!wish.clothes) {
          throw new BadRequestError('찜 목록에 존재하지 않는 옷이 있습니다');
        } else {
          const clothesRes: GetClothesListRes = {
            image: wish.clothes.image,
            id: wish.clothes.id,
            closetId: wish.clothes.closet?.id,
            category: wish.clothes.category,
            season: wish.clothes.season,
            status: wish.clothes.status,
            isOpen: wish.clothes.isOpen,
            name: wish.clothes.name,
            tag: wish.clothes.tag,
            isWished: true,
            ownerNickname: wish.clothes.owner.nickname,
          };
          return clothesRes;
        }
      }),
    );
    return wishList;
  }
}
