import Category from '../../common/enum/category.enum';
import Season from '../../common/enum/season.enum';
import Status from '../../common/enum/status.enum';

export default interface GetClothesListRes {
  id: number;
  closetId?: number;
  category?: Category;
  season?: Season;
  status: Status;
  isOpen: boolean;
  name: string;
  tag?: string;
  isWished: boolean;
  image?: string;
  description?: string;
  ownerNickname?: string;
}
