export interface GetMember {
  owner: boolean;
  data: MemberData[];
}

export interface MemberData {
  userId: string;
  username: string;
  profileUrl: string;
  date: { start: string; end: string }[];
}
