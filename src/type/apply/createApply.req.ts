import User from '../../entity/user.entity';
import Clothes from '../../entity/clothes.entity';

export default interface createApplyReq {
  user?: User;
  clothes?: Clothes;
  isAccepted?: boolean;
  isRejected?: boolean;
  detail?: string;
}
