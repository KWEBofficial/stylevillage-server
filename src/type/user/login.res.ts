import City from '../../common/enum/city.enum';
import Gender from '../../common/enum/gender.enum';

export default interface LoginRes {
  accessToken: string;
  id?: number;
  username: string;
  nickname: string | null;
  isBannded: boolean | null;
  gender: Gender | null;
  location: City | null;
}
