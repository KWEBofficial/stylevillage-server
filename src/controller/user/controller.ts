import { RequestHandler } from 'express';
import UserService from '../../service/user.service';
// import CreateUserInput from '../../type/user/create.input';
import { BadRequestError } from '../../util/customErrors';
import LoginUser from '../../type/user/loginUser';
import UserRepository from '../../repository/user.repository';

// 예시 controller입니다. 필요에 따라 수정하거나 삭제하셔도 됩니다.
export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.query.id);
    const user = id
      ? await UserService.getUserById(id)
      : (req.user as LoginUser);
    if (!user) throw new BadRequestError('해당하는 유저가 없습니다.');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as LoginUser;

    const { nickname, gender, location, phoneNumber } = req.body;

    if (!nickname || !gender || !location || !phoneNumber) {
      throw new BadRequestError('All fields are required.');
    }

    const foundUser = await UserRepository.findOneByUsername(user.username);

    if (!foundUser) {
      throw new BadRequestError('User not found.'); // Handle appropriately
    }

    foundUser.nickname = nickname;
    foundUser.gender = gender;
    foundUser.location = location;
    foundUser.phoneNumber = phoneNumber;

    await UserService.updateUserProfile(foundUser);

    res.json({ isSuccess: true });
  } catch (error) {
    next(error);
  }
};

// export const getUsersByAge: RequestHandler = async (req, res, next) => {
//   try {
//     const age = Number(req.params.age);

//     const users = await UserService.getUsersByAge(age);

//     res.json(users);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createUser: RequestHandler = async (req, res, next) => {
//   try {
//     const { firstName, lastName, age } = req.body as CreateUserInput;
//     const createUserInput: CreateUserInput = { firstName, lastName, age };

//     const user = await UserService.saveUser(createUserInput);

//     res.status(201).json(user.id);
//   } catch (error) {
//     next(error);
//   }
