interface clothes {
  id?: number;
  name: string;
  image?: string;
}
interface user {
  id?: number;
  username: string;
  nickname?: string;
}
export default interface getSendedApply {
  id?: number;
  clothes?: clothes;
  owner?: user;
  isAccepted: boolean;
  isRejected: boolean;
  detail?: string;
}
