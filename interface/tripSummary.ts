export interface TripSummaryInformation {
  information: {
    date: {
      start: string;
      end: string;
    };
    name: string;
    note: string;
    member: Member[];
    coverImg: string;
    currentPlace: string;
    prevPlaceStatus: string;
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
  places: PlanPlace[];
  day: number;
  date: string;
  activity: PlanActivity[];
}

export interface PlanActivity {
  name: string;
  startTime: string;
  endTime: string;
  activityId: string;
  selectBy: string[];
}

export interface PlanPlace {
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
  status: string;
}

export interface PlaceCard {
  id: string;
  startTime: string;
  endTime: string;
  type: string;
  name: string;
  coverImg: string[];
  location: {
    address: string;
    district: string;
    province: string;
  };
  latitude: number;
  longitude: number;
  distant: number;
  firstPlace: boolean;
  prevPlace?: string;
  nextPlace?: string;
}
