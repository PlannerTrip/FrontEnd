export interface TripCard {
  coverImg: string;
  date: {
    end: string;
    start: string;
  };
  member: {
    userId: string;
    username: string;
    userprofile: string;
  }[];
  name: string;
  province: string[];
  tripId: string;
}
