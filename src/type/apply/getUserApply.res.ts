interface clothes {
  id?: number;
  name?: string;
  image?: string;
}
interface user {
  id?: number;
  nickname?: string;
}
export default interface getUserApplyRes {
  id?: number;
  clothes: clothes;
  user: user;
  detail?: string;
}
