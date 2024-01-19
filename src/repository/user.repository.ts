import AppDataSource from '../config/dataSource';
import User from '../entity/user.entity';
import { BadRequestError } from '../util/customErrors';

// 예시 repository입니다. 필요에 따라 수정하거나 삭제하셔도 됩니다.

const UserRepository = AppDataSource.getRepository(User).extend({
  async checkDuplicateUser(username: string): Promise<boolean> {
    return this.findOneBy({ username }).then((user) => {
      if (user) return true;
      return false;
    });
  },

  async findOneByUsername(username: string): Promise<User> {
    return this.findOneBy({ username }).then((user) => {
      if (!user)
        throw new BadRequestError(
          'username과 일치하는 사용자가 존재하지 않습니다.',
        );
      return user;
    });
  },

  async findOneByUserId(id: number): Promise<User> {
    return this.findOne({ where: { id } }).then((user) => {
      if (!user)
        throw new BadRequestError('일치하는 사용자가 존재하지 않습니다.');
      return user;
    });
  },
});

export default UserRepository;
