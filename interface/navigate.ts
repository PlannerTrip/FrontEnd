export type StackParamList = {
  tab: undefined;
  invitation: { tripId: string };
  signIn: undefined;
  signUp: undefined;
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
  };
  loading: undefined;

  inviteVerify: {
    inviteLink?: string;
  };
};
