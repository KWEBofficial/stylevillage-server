import Closet from '../../entity/closet.entity';
import Category from '../../common/enum/category.enum';
import Season from '../../common/enum/season.enum';
import Status from '../../common/enum/status.enum';
import ReviewRes from '../lend/review.res';

interface Owner {
  id?: number;
  nickname?: string;
  location?: string;
}
export default interface GetClothesRes {
  id?: number;
  closet?: Closet;
  description?: string;
  category?: Category;
  season?: Season;
  status: Status;
  isOpen: boolean;
  name: string;
  tag?: string;
  image?: string;
  owner: Owner;
  review: ReviewRes[];
  isWished: boolean;
  wishCount: number;
  closetId?: number;
}
