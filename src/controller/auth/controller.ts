import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import AuthService from '../../service/auth.service';
import RegisterReq from '../../type/user/register.req';
import RegisterRes from '../../type/user/register.res';
import getProfileRes from '../../type/user/getProfileRes.res';
import LoginReq from '../../type/user/login.req';
import bcrypt from 'bcrypt';
import UserRepository from '../../repository/user.repository';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, password, nickname, gender, location, phoneNumber } =
      req.body;

    if (
      !username ||
      !password ||
      !nickname ||
      !gender ||
      !location ||
      !phoneNumber
    ) {
      throw new BadRequestError('모든 항목을 입력해야 합니다.');
    }

    const user: RegisterReq = {
      username,
      password,
      nickname,
      gender,
      location,
      phoneNumber,
    };

    await AuthService.register(user);

    const registerRes: RegisterRes = { username };
    res.json(registerRes);
  } catch (error) {
    next(error);
  }
};

export const isduplicated: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.body;
    const isDuplicate = await UserRepository.checkDuplicateUser(username);
    res.json(isDuplicate);
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new BadRequestError('모든 항목을 입력해야 합니다.');
    }

    const loginInfo: LoginReq = { username, password };
    const loginRes = await AuthService.login(loginInfo);

    res.json(loginRes);
  } catch (error) {
    next(error);
  }
};

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!currentPassword || !newPassword || !token) {
      throw new BadRequestError('모든 항목을 입력해야 합니다.');
    }

    const user = await AuthService.getUserFromToken(token);

    const isSame = await bcrypt.compare(currentPassword, user.password);
    if (!isSame) {
      throw new BadRequestError('현재 비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await UserRepository.save(user);

    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    next(error);
  }
};

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new BadRequestError('유효하지 않은 토큰입니다.');
    }
    const user = await AuthService.getUserFromToken(token);

    if (!user) {
      throw new BadRequestError('유저를 검색할 수 없습니다.');
    }

    const getProfileRes: getProfileRes = {
      username: user.username,
      nickname: user.nickname,
      location: user.location,
      phoneNumber: user.phoneNumber,
    };

    res.json(getProfileRes);
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const { nickname, location, phoneNumber } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!nickname || !location || !phoneNumber) {
      throw new BadRequestError('모든 항목을 입력해야 합니다.');
    }

    if (!token) {
      throw new BadRequestError('유효하지 않은 토큰입니다.');
    }
    const user = await AuthService.getUserFromToken(token);

    if (!user) {
      throw new BadRequestError('유저를 검색할 수 없습니다.');
    }

    if (!/^\d+$/.test(phoneNumber) || phoneNumber.length !== 11) {
      throw new BadRequestError('전화번호는 11자리의 숫자로 입력해 주세요.');
    }

    user.nickname = nickname;
    user.location = location;
    user.phoneNumber = phoneNumber;

    await UserRepository.save(user);

    res.json({ message: '프로필이 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    next(error);
  }
};
