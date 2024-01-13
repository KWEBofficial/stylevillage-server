import AppDataSource from '../config/dataSource';
import Clothes from '../entity/clothes.entity';
import { BadRequestError } from '../util/customErrors';
import Category from '../common/enum/category.enum';
import Season from '../common/enum/season.enum';

const ClothesRepository = AppDataSource.getRepository(Clothes).extend({
  async findOneByClothesId(id: number): Promise<Clothes> {
    return this.findOne({
      where: { id },
      relations: { owner: true },
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

  async findByCategorySeasonName(
    categories: Category[],
    seasons: Season[],
    text: string,
  ): Promise<Clothes[]> {
    let query = this.createQueryBuilder('clothes')
      .leftJoin('clothes.owner', 'owner')
      .leftJoinAndSelect('clothes.closet', 'closet')
      .addSelect(['owner.id', 'owner.username', 'owner.nickname'])
      .where({
        isOpen: true,
      });

    //Category와 Season에 여러 개의 값을 지정가능.
    //ex) seasons = ['여름','겨울'] 이면 season값이 여름인 옷들과 겨울인 옷들을 모두 가져옴
    if (categories.length > 0) {
      query = query.andWhere('clothes.category IN (:...categories)', {
        categories,
      });
    }
    if (seasons.length > 0) {
      query = query.andWhere('clothes.season IN (:...seasons)', { seasons });
    }

    //띄어쓰기가 있을 경우. 공백을 기준으로 string을 쪼개고 쪼개진 각각의 단어들을
    //name에 모두 포함하고 있거나, tag에 모두 포함하고나 있는 옷들을 가져옴
    if (text) {
      const words = text.split(/\s+/);

      const nameConditions = words
        .map((word) => `clothes.name LIKE '%${word}%'`)
        .join(' AND ');
      const tagConditions = words
        .map((word) => `clothes.tag LIKE '%${word}%'`)
        .join(' AND ');

      query = query.andWhere(`(${nameConditions}) OR (${tagConditions})`);
    }

    return query.getMany();
  },
});

export default ClothesRepository;
