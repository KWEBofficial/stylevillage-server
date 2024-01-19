import AppDataSource from '../config/dataSource';
import Lend from '../entity/lend.entity';
import User from '../entity/user.entity';
import { BadRequestError } from '../util/customErrors';
import ReviewRes from '../type/lend/review.res';

const LendRepository = AppDataSource.getRepository(Lend).extend({
  async findLoaneeById(id: number): Promise<User> {
    return this.findOne({
      where: { id },
      relations: { loanee: true },
    }).then((lend) => {
      if (!lend) throw new BadRequestError('존재하지 않는 대여 내역입니다.');
      return lend.loanee;
    });
  },

  async findByLenderId(lender: number): Promise<Lend[]> {
    return this.createQueryBuilder('lend')
      .leftJoinAndSelect('lend.lender', 'lender')
      .leftJoinAndSelect('lend.loanee', 'loanee')
      .leftJoinAndSelect('lend.clothes', 'clothes')
      .where({ lender })
      .select(getLendsResFields)
      .orderBy('lend.createdAt', 'DESC')
      .getMany();
  },

  async findByLoaneeId(loanee: number): Promise<Lend[]> {
    return this.createQueryBuilder('lend')
      .leftJoinAndSelect('lend.lender', 'lender')
      .leftJoinAndSelect('lend.loanee', 'loanee')
      .leftJoinAndSelect('lend.clothes', 'clothes')
      .where({ loanee })
      .select(getLendsResFields)
      .orderBy('lend.createdAt', 'DESC')
      .getMany();
  },

  async findOneByLendId(id: number): Promise<Lend> {
    return this.findOne({
      where: { id },
      relations: { loanee: true },
    }).then((lend) => {
      if (!lend) throw new BadRequestError('존재하지 않는 대여 내역입니다.');
      return lend;
    });
  },

  async findByClothesId(clothesId: number): Promise<Lend[]> {
    return this.find({
      where: { clothes: { id: clothesId } },
      relations: { loanee: true },
    });
  },

  async getReviewByClothesId(clothesId: number): Promise<ReviewRes[]> {
    const lends = await this.findByClothesId(clothesId);
    const reviewsPromises = lends.map(async (lend: Lend) => {
      if (!lend || !lend.review || !lend.id) return undefined;
      else {
        const reviewObject: ReviewRes = {
          review: lend.review,
          reviewer: {
            id: lend.loanee.id,
            username: lend.loanee.username,
            nickname: lend.loanee.nickname,
          },
        };
        return reviewObject;
      }
    });
    const reviews = await Promise.all(reviewsPromises);

    return reviews.filter((review) => review !== undefined) as ReviewRes[];
  },
});

const getLendsResFields = [
  'lend.id',
  'clothes.id',
  'clothes.name',
  'clothes.image',
  'lend.price',
  'lend.startDate',
  'lend.endDate',
  'lend.review',
  'lender.id',
  'lender.username',
  'lender.nickname',
  'loanee.id',
  'loanee.username',
  'loanee.nickname',
];

export default LendRepository;
