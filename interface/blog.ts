export interface PlaceOption {
  location: {
    district: string;
    province: string;
  };
  placeId: string;
  placeName: string;
  coverImg: string;
}

export interface TripOption {
  tripName: string;
}

export interface Option {
  tripName?: string;
  location?: {
    district: string;
    province: string;
  };
  placeId?: string;
  placeName?: string;
  coverImg?: string;
  inTrip?: boolean;
}

export interface TripOption {
  name: string;
  places: {
    coverImg: string;
    location: {
      district: string;
      province: string;
    };
    placeId: string;
    placeName: string;
  }[];
  tripId: string;
}

export interface BlogCard_Props {
  alreadyLike: boolean;
  createDate: string;
  img: string;
  name: string;
  province: string[];
  totalLike: number;
  userId: string;
  username: string;
  userprofile: string;
  blogId: string;
}
