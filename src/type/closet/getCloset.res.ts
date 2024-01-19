import getClosetClothes from '../clothes/getClosetClothes';
import UserRes from '../user/user.res';

export default interface getClosetRes {
  id?: number;
  name: string;
  owner: UserRes;
  clothes: Array<getClosetClothes>;
}
