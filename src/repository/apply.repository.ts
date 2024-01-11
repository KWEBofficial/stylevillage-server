import AppDataSource from '../config/dataSource';
import Apply from '../entity/apply.entity';
import { BadRequestError } from '../util/customErrors';

const ApplyRepository = AppDataSource.getRepository(Apply).extend({
  async findOneByApplyId(id: number): Promise<Apply> {
    return this.findOne({
      where: { id },
      relations: { clothes: { closet: { owner: true } } },
    }).then((apply) => {
      if (!apply) throw new BadRequestError('존재하지 않는 신청입니다.');
      return apply;
    });
  },
});

export default ApplyRepository;