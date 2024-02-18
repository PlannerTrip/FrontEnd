export interface GetMember {
  owner: boolean;
  data: MemberData[];
  date: { start: string; end: string };
}

export interface MemberData {
  userId: string;
  username: string;
  profileUrl: string;
  date: { start: string; end: string }[];
}
