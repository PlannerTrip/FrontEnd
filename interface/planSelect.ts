import { Forecast } from "./placeSelect";

export interface Place {
  location: {
    address: string;
    district: string;
    province: string;
  };
  placeId: string;
  placeName: string;
  coverImg: string[];
  forecasts: Forecast[];
  selectBy: string[];
}

export interface Plan {
  place: PlanPlace[];

  date: string;
  day: Number;
  activity: {
    selectBy: { username: string; userprofile: string; userId: string }[];
    name: string;
    activityId: string;
  }[];
}

export interface PlanPlace {
  type: String;
  location: {
    address: string;
    district: string;
    province: string;
  };
  placePlanId: string;
  placeName: string;
  coverImg: string[];
  distant: number;
  selectBy: { username: string; userprofile: string; userId: string }[];
}

export interface PlaceCardInput {
  name: string;
  forecast: Forecast[];
  location: { district: string; province: string };
  tripId: string;
  coverImg: string[];
  selectBy: string[];
}

export interface PlanPlaceCardInput {
  name: string;
  location: { district: string; province: string };
  coverImg: string[];
  distant: number;
  selectBy: { username: string; userprofile: string; userId: string }[];
  onPressRemove: () => void;
}
