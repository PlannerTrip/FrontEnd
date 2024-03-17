import { Member } from "./tripSummary";

export type StackParamList = {
  tab: undefined;
  invitation: { tripId: string };
  placeSelect: { tripId: string };
  placeDiscovery: { tripId: string };
  planSelect: { tripId: string };
  tripSummary: { tripId: string };
  tripMember: {
    tripId: string;
    member: Member[];
  };
  stopSelect: { tripId: string; day: number };

  achievement: undefined;
  blog: undefined;
  discovery: undefined;
  profile: undefined;
  tripPlanner: undefined;
  placeInformation: {
    placeId: string;
    type: string;
    forecastDate?: string;
    forecastDuration?: string;
    from: string;
  };

  writeReview: {
    placeId: string;
    placeName: string;
  };

  loading: undefined;
  inviteVerify: {
    inviteLink?: string;
  };
  // blog
  writeBlog: undefined;

  // authentication
  signIn: undefined;
  signUp: undefined;
  welcome: undefined;
  forgot: {
    forgotCode?: string;
  };
};
