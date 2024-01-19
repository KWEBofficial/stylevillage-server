import Clothes from '../../entity/clothes.entity';
import User from '../../entity/user.entity';

export default interface createLendReq {
  clothes?: Clothes;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  lender: User;
  loanee: User;
  review?: string;
}
