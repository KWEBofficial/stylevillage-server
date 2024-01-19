import Category from '../../common/enum/category.enum';
import Season from '../../common/enum/season.enum';
import Status from '../../common/enum/status.enum';
import UserRes from '../user/user.res';

export default interface SearchClothesRes {
  id?: number;
  closetId?: number;
  category?: Category;
  season?: Season;
  status: Status;
  isOpen: boolean;
  name: string;
  tag?: string;
  image?: string;
  owner: UserRes;
  isWished: boolean;
}
