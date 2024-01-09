import Lend from '../entity/lend.entity';
import LendRepository from '../repository/lend.repository';
import lendapplyReq from '../type/lend/lendapply.req';

export default class LendService {
  static async createApply(applyInfo: lendapplyReq): Promise<Lend> {
    const newApply = LendRepository.create(applyInfo);
    return await LendRepository.save(newApply);
  }
}
