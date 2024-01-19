import Clothes from '../../entity/clothes.entity';
import UserRes from '../user/user.res';

export default interface getLendsRes {
  id?: number;
  clothes: Clothes;
  price: number;
  startDate: Date;
  endDate: Date;
  lender: UserRes;
  loanee: UserRes;
  review?: string;
}
