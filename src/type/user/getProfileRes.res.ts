import City from '../../common/enum/city.enum';

export default interface getProfileRes {
  username: string | undefined;
  nickname: string | undefined;
  location: City | undefined;
  phoneNumber: string | undefined;
}
