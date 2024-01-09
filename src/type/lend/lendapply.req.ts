import Clothes from '../../entity/clothes.entity';
import User from '../../entity/user.entity';

export default interface lendapplyReq {
  clothes?: Clothes;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  lender: User;
  loanee: User;
  review: string;
}
