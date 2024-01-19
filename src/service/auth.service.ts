import User from '../entity/user.entity';
import bcrypt from 'bcrypt';
import UserRepository from '../repository/user.repository';
import RegisterReq from '../type/user/register.req';
import { BadRequestError, DuplicateValueError } from '../util/customErrors';
import LoginReq from '../type/user/login.req';
import jwt from 'jsonwebtoken';
import LoginRes from '../type/user/login.res';
import { JwtPayload } from 'jsonwebtoken';

// 예시 service입니다. 필요에 따라 수정하거나 삭제하셔도 됩니다.

export default class AuthService {
  static async register(user: RegisterReq): Promise<User> {
    const isDuplicate = await UserRepository.checkDuplicateUser(user.username);

    if (isDuplicate)
      throw new DuplicateValueError('중복되는 사용자 이름입니다.');

    user.password = await bcrypt.hash(user.password, 10);

    const newUser = UserRepository.create(user);
    return await UserRepository.save(newUser);
  }

  static async login(loginInfo: LoginReq): Promise<LoginRes> {
    const user = await UserRepository.findOneByUsername(loginInfo.username);

    const isSame = await bcrypt.compare(loginInfo.password, user.password);
    if (!isSame) {
      throw new BadRequestError('비밀번호가 일치하지 않습니다.');
    }

    const accessToken = jwt.sign(
      { id: user.id, nickname: user.nickname, username: user.username },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '3h' }, // 로그인 유지 3시간
    );

    const loginRes: LoginRes = {
      accessToken,
      id: user.id,
      username: user.username,
      nickname: user.nickname ?? null,
      gender: user.gender ?? null,
      location: user.location ?? null,
      isBannded: user.isBanned ?? null,
    };

    return loginRes;
  }

  static async getUserFromToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string,
      ) as JwtPayload;
      const username = decoded.username;
      return await UserRepository.findOneByUsername(username);
    } catch (error) {
      throw new BadRequestError('유효하지 않은 토큰입니다.');
    }
  }
}
