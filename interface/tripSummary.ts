export interface TripSummaryInformation {
  information: {
    date: {
      start: string;
      end: string;
      name: string;
      note: string;
    };
    member: Member[];
  };
  plan: Plan[];
  owner: boolean;
}

export interface Member {
  userId: string;
  username: string;
  userprofile: string;
}

export interface Plan {
  places: [
    {
      startTime: string;
      endTime: string;
      placeName: string;
      covetImg: string[];
      location: {
        address: string;
        district: string;
        province: string;
      };
      selectBy: string[];
      latitude: number;
      longitude: number;
      placeId: string;
    }
  ];
  day: number;
  date: string;
  activity: {
    name: string;
    startTime: string;
    endTime: string;
    activityId: string;
    selectBy: string[];
  }[];
}
