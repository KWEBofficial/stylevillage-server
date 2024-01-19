import { UpdateResult } from 'typeorm';
import LendRepository from '../repository/lend.repository';
import getLendsRes from '../type/lend/getLends.res';
import createLendReq from '../type/lend/createLend.req';
import Lend from '../entity/lend.entity';
import { BadRequestError, UnauthorizedError } from '../util/customErrors';

export default class LendService {
  static async createLend(lendInfo: createLendReq): Promise<Lend> {
    const newLend = LendRepository.create(lendInfo);
    return await LendRepository.save(newLend);
  }

  static async getLendsAsLender(userId: number): Promise<getLendsRes[]> {
    const lendsAsLender: getLendsRes[] =
      await LendRepository.findByLenderId(userId);
    return lendsAsLender;
  }

  static async getLendAsLoanee(userId: number): Promise<getLendsRes[]> {
    const lendsAsLoanee: getLendsRes[] =
      await LendRepository.findByLoaneeId(userId);
    return lendsAsLoanee;
  }

  static async deleteReview(
    userId: number,
    lendId: number,
  ): Promise<UpdateResult> {
    const lend = await LendRepository.findOneByLendId(lendId);

    if (lend.loanee.id != userId) {
      throw new BadRequestError('본인이 작성한 리뷰만 삭제할 수 있습니다.');
    }
    if (!lend.review) {
      throw new BadRequestError('삭제할 리뷰가 없습니다.');
    }

    return await LendRepository.update({ id: lendId }, { review: '' });
  }

  static async modifyReview(
    review: string,
    lendId: number,
    userId: number,
  ): Promise<UpdateResult> {
    const loanee = await LendRepository.findLoaneeById(lendId);

    if (loanee.id != userId) {
      throw new UnauthorizedError(
        '본인이 빌렸던 대여내역에 대해서만 리뷰를 작성할 수 있습니다.',
      );
    }
    return await LendRepository.update({ id: lendId }, { review });
  }
}
