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
}

export interface Plan {
  place: {
    type: String;
    location: {
      address: string;
      district: string;
      province: string;
    };
    id: string;
    placeName: string;
    coverImg: string[];
    distant: number;
    selectBy: { username: string; userprofile: string }[];
  }[];

  date: string;
  day: Number;
  activity: [
    {
      selectBy: String[];
      name: string;
      activityId: string;
    }
  ];
}

export interface PlaceCardInput {
  name: string;
  forecast: Forecast[];
  location: { district: string; province: string };
  tripId: string;
  coverImg: string[];
}
