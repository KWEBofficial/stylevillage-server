import AppDataSource from '../config/dataSource';
import Closet from '../entity/closet.entity';
import { BadRequestError } from '../util/customErrors';

const ClosetRepository = AppDataSource.getRepository(Closet).extend({
  async findOneByClosetId(id: number): Promise<Closet> {
    return this.findOne({ where: { id }, relations: { owner: true } }).then(
      (closet) => {
        if (!closet) throw new BadRequestError('옷장이 존재하지 않습니다.');
        return closet;
      },
    );
  },

  async findByUserId(userId: number): Promise<Closet[]> {
    return this.find({ where: { owner: { id: userId } } });
  },

  async getOwnerId(id: number): Promise<number | undefined> {
    const closet = await this.findOneByClosetId(id);
    return closet.owner.id;
  },

  async getUserIdbyClosetId(closetId: number): Promise<number | undefined> {
    const closet = await this.findOneByClosetId(closetId);
    if (!closet) {
      throw new BadRequestError('옷장이 존재하지 않습니다.');
    }
    return closet.owner.id;
  },
});

export default ClosetRepository;
