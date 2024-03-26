export interface Place {
  location: {
    address: string;
    district: string;
    province: string;
  };
  placeId: string;
  placeName: string;
  coverImg: string;
  latitude: number;
  longitude: number;
  alreadyAdd: boolean;
}

export interface PlanPlace {
  placeId: string;
  placeName: string;
  latitude: number;
  longitude: number;
}
