import User from '../entity/user.entity';
import UserRepository from '../repository/user.repository';
import { InternalServerError } from '../util/customErrors';

// 예시 service입니다. 필요에 따라 수정하거나 삭제하셔도 됩니다.

export default class UserService {
  static async getUserById(id: number): Promise<User | null> {
    try {
      return await UserRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오는데 실패했습니다.');
    }
  }

  static async updateUserProfile(user: User): Promise<void> {
    try {
      await UserRepository.save(user);
    } catch (error) {
      throw new InternalServerError('프로필 업데이트에 실패했습니다.');
    }
  }

  // static async getUsersByAge(age: number): Promise<User[]> {
  //   try {
  //     return await UserRepository.find({ where: { age } });
  //   } catch (error) {
  //     throw new InternalServerError('유저 정보를 불러오는데 실패했습니다.');
  //   }
  // }

  // static async saveUser(registerInput: RegisterInput): Promise<User> {
  //   try {
  //     const userEntity = UserRepository.create(registerInput);
  //     return await UserRepository.save(userEntity);
  //   } catch (error) {
  //     throw new InternalServerError('유저 정보를 저장하는데 실패했습니다.');
  //   }
  // }
}
