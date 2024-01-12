import AppDataSource from '../config/dataSource';
import Lend from '../entity/lend.entity';
import User from '../entity/user.entity';
import { BadRequestError } from '../util/customErrors';

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
      .leftJoin('lend.lender', 'lender')
      .leftJoin('lend.loanee', 'loanee')
      .where({ lender })
      .addSelect(getLendsResFields)
      .orderBy('lend.createdAt', 'DESC')
      .getMany();
  },

  async findByLoaneeId(loanee: number): Promise<Lend[]> {
    return this.createQueryBuilder('lend')
      .leftJoin('lend.lender', 'lender')
      .leftJoin('lend.loanee', 'loanee')
      .where({ loanee })
      .addSelect(getLendsResFields)
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
});

const getLendsResFields = [
  'lender.id',
  'lender.username',
  'lender.nickname',
  'loanee.id',
  'loanee.username',
  'loanee.nickname',
];

export default LendRepository;
