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
  selectBy: { username: string; userprofile: string; userId: string }[];
}
export interface PlaceCardInput {
  name: string;
  introduction: string;
  tag: string[];
  forecast: Forecast[];
  location: { district: string; province: string };
  selectBy?: { username: string; userprofile: string }[];
  tripId: string;
  coverImg: string[];
  onPressIcon: () => void;
  showIcon?: boolean;
  showSelectBy?: boolean;
  iconType?: string;
}

export interface Forecast {
  time: string;
  data: {
    cond: number;
    rh: number;
    tc: number;
  };
}
