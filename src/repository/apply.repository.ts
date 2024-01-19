import AppDataSource from '../config/dataSource';
import Apply from '../entity/apply.entity';
import { BadRequestError } from '../util/customErrors';

const ApplyRepository = AppDataSource.getRepository(Apply).extend({
  async findOneByApplyId(id: number): Promise<Apply> {
    return this.findOne({
      where: { id },
      relations: { clothes: { owner: true } },
    }).then((apply) => {
      if (!apply) throw new BadRequestError('존재하지 않는 신청입니다.');
      return apply;
    });
  },

  async findArrivedApplyByUserId(userId: number): Promise<Apply[]> {
    return this.find({
      where: {
        clothes: { owner: { id: userId } },
        isAccepted: false,
        isRejected: false,
      },
      relations: { clothes: { owner: true }, user: true },
    });
  },

  async findSendedApplyByUserId(userId: number): Promise<Apply[]> {
    return this.find({
      where: {
        user: { id: userId },
      },
      relations: { clothes: { owner: true }, user: true },
    });
  },
});

export default ApplyRepository;
