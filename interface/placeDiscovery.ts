import { Forecast } from "./placeSelect";

export interface Place {
  contact: {
    phone: string;
    url: string;
  };
  location: {
    address: string;
    district: string;
    province: string;
  };
  placeId: string;
  placeName: string;
  type: string;
  coverImg: string[];
  introduction: string;
  tag: string[];
  latitude: number;
  longitude: number;
  weekDay: null;
  __v: 0;
  forecasts: Forecast[];
  alreadyAdd: boolean;
}
