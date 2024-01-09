import AppDataSource from '../config/dataSource';
import Lend from '../entity/lend.entity';
import { BadRequestError } from '../util/customErrors';

const LendRepository = AppDataSource.getRepository(Lend).extend({
  async findOneByApplyId(id: number): Promise<Lend> {
    return this.findOneBy({ id }).then((lend) => {
      if (!lend) throw new BadRequestError('not found');
      return lend;
    });
  },
});

export default LendRepository;
