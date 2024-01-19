export default interface LoginUser extends Express.User {
  id: number;
  username: string;
  nickname: string;
}
