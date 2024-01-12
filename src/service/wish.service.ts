import Wish from '../entity/wish.entity';
import { UpdateResult } from 'typeorm';
import CreateWishReq from '../type/wish/createWish.req';
import ClothesRepository from '../repository/clothes.repository';
import UserRepository from '../repository/user.repository';
import WishRepository from '../repository/wish.repository';
import { BadRequestError } from '../util/customErrors';
import GetWishListRes from '../type/wish/getWishList.res';

export default class WishService {
  static async createWish(
    wishInfo: CreateWishReq,
    username: string,
  ): Promise<UpdateResult | Wish> {
    const clothes = await ClothesRepository.findOneByClothesId(
      wishInfo.clothesId,
    );
    const user = await UserRepository.findOneByUsername(username);

    const wish = await WishRepository.findWishByData(user, clothes, false);

    if (!wish) {
      const newWish = WishRepository.create({
        user: user,
        clothes: clothes,
        isWished: true,
      });

      return await WishRepository.save(newWish);
    } else {
      return await WishRepository.update({ id: wish.id }, { isWished: true });
    }
  }

  static async deleteWish(
    wishInfo: CreateWishReq,
    username: string,
  ): Promise<UpdateResult> {
    const clothes = await ClothesRepository.findOneByClothesId(
      wishInfo.clothesId,
    );
    const user = await UserRepository.findOneByUsername(username);
    const wish = await WishRepository.findWishByData(user, clothes, true);

    if (!wish)
      throw new BadRequestError('해당 옷에 대한 찜 정보를 찾을 수 없습니다.');
    return await WishRepository.update({ id: wish.id }, { isWished: false });
  }

  static async getWishList(userId: number): Promise<GetWishListRes> {
    const wishesInfo = await WishRepository.findWishesByUser(userId);
    const wishListPromises = wishesInfo.map(async (wish) => {
      if (!wish.clothes)
        throw new BadRequestError('찜 목록에 존재하지 않는 옷이 있습니다');
      return wish.clothes;
    });
    const wishList = await Promise.all(wishListPromises);
    return { wishList };
  }
}