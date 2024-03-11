export type StackParamList = {
    tab: undefined;
    invitation: { tripId: string };
    placeSelect: { tripId: string };
    placeDiscovery: { tripId: string };
    planSelect: { tripId: string };

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
    review: {
        placeId: string;
        placeName: string;
    };
    loading: undefined;
    inviteVerify: {
        inviteLink?: string;
    };

    // authentication
    signIn: undefined;
    signUp: undefined;
    welcome: undefined;
    forgot: {
        forgotCode?: string;
    };
};
