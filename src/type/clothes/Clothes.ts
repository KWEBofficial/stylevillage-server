import Closet from '../../entity/closet.entity';
import User from '../../entity/user.entity';
import Category from '../../common/enum/category.enum';
import Season from '../../common/enum/season.enum';
import Status from '../../common/enum/status.enum';

export default interface GetClothesRes {
  id?: number;
  description?: string;
  closet?: Closet;
  category?: Category;
  season?: Season;
  status: Status;
  isOpen: boolean;
  name: string;
  tag?: string;
  image?: string;
  owner: User;
}
