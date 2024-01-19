interface Closet {
  id?: number;
  name: string;
}

export default interface getClosetListRes {
  closets: Array<Closet>;
}
