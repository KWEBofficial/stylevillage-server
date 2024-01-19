import AppDataSource from '../config/dataSource';
import Wish from '../entity/wish.entity';
import { BadRequestError } from '../util/customErrors';

const WishRepository = AppDataSource.getRepository(Wish).extend({
  async findWishByData(
    userId: number,
    clothesId: number,
    isWished: boolean,
  ): Promise<Wish | null> {
    return this.findOne({
      where: {
        user: { id: userId },
        clothes: { id: clothesId },
        isWished: isWished,
      },
    });
  },

  async findAndCountByclothesId(clothesId: number): Promise<number> {
    return this.find({
      where: { clothes: { id: clothesId }, isWished: true },
    }).then((wishes) => wishes.length);
  },

  async findWishByUserIdClothesId(
    userId: number,
    clothesId: number,
  ): Promise<Wish | null> {
    return this.findOne({
      where: {
        user: { id: userId },
        clothes: { id: clothesId },
      },
      relations: ['clothes', 'user'],
    });
  },

  async findWishesByUser(userId: number): Promise<Wish[]> {
    return this.find({
      where: {
        user: { id: userId },
        isWished: true,
      },
      relations: { clothes: { owner: true }, user: true },
      order: {
        id: 'DESC',
      },
    }).then((wish) => {
      if (!wish)
        throw new BadRequestError('찜 내역을 불러오는 데 실패하였습니다.');
      return wish;
    });
  },
});

export default WishRepository;
