export interface UserPublic {
  userId: string;
  email: string;
}

export interface User extends UserPublic {
  password: string;
  itineraryIds: Set<string>;
}

export interface PlaceInput {
  place_id: string;
  duration: number;
}

export interface ReviewPublic {
  reviewId: string;
  ownerId: string;
  comment: string;
  rating: number;
}

export interface PlaceOutput extends PlaceInput {
  name: string;
  imgUrl: string;
  travelTimeFromPrevLocation: number;
  latitude: number;
  longitude: number;
  startTime: number;
  endTime: number;
  types?: string[];
  // Debug
  prevLocationId?: string;
}

export interface PlanInput {
  startDate: Date;
  endDate: Date;
  accomodation: PlaceInput;
  places: PlaceInput[];
  location: string;
}

export type PlanOutput = Record<string, PlaceOutput[]>

export interface Itinerary {
  id: string;
  ownerId: string;
  location: string;
  plan: Record<string, PlaceOutput[]>;
  dateCreated: Date;
}

export interface ItineraryNew {
  itineraryId: string;
}

export interface Review {
  reviewId: string;
  ownerId: string;
  itineraryId: string;
  rating: number;
  comment: string;
}

export interface UploadedPhoto {
  photoId: string;
  // Preferably frontend use base64
  itineraryId: string;
  url: string;
  ownerId: string;
  caption?: string;
}
