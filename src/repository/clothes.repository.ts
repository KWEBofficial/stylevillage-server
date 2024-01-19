import { In, Like } from 'typeorm';
import AppDataSource from '../config/dataSource';
import Clothes from '../entity/clothes.entity';
import SearchClothesReq from '../type/clothes/searchClothes.req';
import { BadRequestError } from '../util/customErrors';
import WishRepository from './wish.repository';

const ClothesRepository = AppDataSource.getRepository(Clothes).extend({
  async findOneByClothesId(id: number): Promise<Clothes> {
    return this.findOne({
      where: { id },
      relations: { owner: true, closet: true },
    }).then((clothes) => {
      if (!clothes) throw new BadRequestError('등록되어있지 않은 의류입니다.');
      return clothes;
    });
  },

  async findOpenByClosetId(closetId: number): Promise<Clothes[]> {
    return this.find({
      where: { closet: { id: closetId }, isOpen: true },
    });
  },

  async findVisibleByClosetId(
    closetId: number,
    userId: number,
  ): Promise<Clothes[]> {
    return this.find({
      where: [
        { closet: { id: closetId }, isOpen: true },
        { closet: { id: closetId }, owner: { id: userId } },
      ],
    });
  },

  async findByUserId(
    userId: number,
    isOpen: boolean | undefined,
  ): Promise<Clothes[]> {
    return this.find({
      where: { owner: { id: userId }, isOpen },
    });
  },

  async findOrderByWishCount(clothesCount: number): Promise<Clothes[]> {
    const clothesList = await Promise.all(
      (
        await this.find({
          where: { isOpen: true },
          relations: { owner: true },
        })
      ).map(async (clothes) => {
        const count = await WishRepository.findAndCountByclothesId(clothes.id);
        return { ...clothes, count };
      }),
    );

    return clothesList.sort((a, b) => b.count - a.count).slice(0, clothesCount);
  },

  async findByOptions(options: SearchClothesReq): Promise<Clothes[]> {
    const { text, season, category, status } = options;

    const commonOptions = {
      season: season ? In(season) : undefined,
      category: category ? In(category) : undefined,
      status: status ? In(status) : undefined,
      isOpen: true,
    };

    const clothesList = this.find({
      where: [
        { name: text ? Like(`%${text}%`) : undefined, ...commonOptions },
        { tag: text ? Like(`%${text}%`) : undefined, ...commonOptions },
      ],
      relations: { closet: true, owner: true },
    });
    return clothesList;
  },
});

export default ClothesRepository;
