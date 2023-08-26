import createHttpError from 'http-errors';
import { GOOGLE_MAPS_API_KEY } from '../../shared/constants';
import { User, PlanInput, PlanOutput, ItineraryNew } from '../../shared/types';
import { Client, TravelMode, DirectionsResponse } from '@googlemaps/google-maps-services-js';
import { NumericConstants as c } from '../../shared/constants';
import { randomUUID } from 'crypto';
import { getData, saveData } from '../app/data';

const client = new Client({});

const calculateTravelTime = async (originPlaceId: string, destinationPlaceId: string, mode: TravelMode = TravelMode.driving) => {
  let response: DirectionsResponse;
  try {
    response = await client.directions({
      params: {
        origin: `place_id:${originPlaceId}`,
        destination: `place_id:${destinationPlaceId}`,
        key: GOOGLE_MAPS_API_KEY,
        mode,
        // departure_time: new Date(),
        // arrival_time: new Date(),
      },
      timeout: 5000,
    });
  } catch (error: any) {
    throw new createHttpError.BadRequest('Error: ' + error.message);
  }
  const duration = response.data.routes[0].legs[0].duration;
  if (duration === undefined || !duration.value) {
    throw new createHttpError.BadRequest(`Cannot find duration between ${originPlaceId} and ${destinationPlaceId}`);
  }
  // Duration returned in seconds - do duration.text
  return duration.value;
};

const getPlaceDetails = async (placeId: string) => {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
      },
      timeout: 5000,
    });
    const result = response.data.result;
    let mainImageUrl = 'none';
    if (result.photos && result.photos.length > 0) {
      const url = 'https://maps.googleapis.com/maps/api/place/photo';
      const reference = result.photos[0].photo_reference;
      mainImageUrl = `${url}?maxwidth=800&photoreference=${reference}&key=${GOOGLE_MAPS_API_KEY}`;
    }
    if (!result.name) {
      throw new createHttpError.BadRequest('Missing name!');
    }
    if (!result.geometry) {
      throw new createHttpError.BadRequest(`${result.name} (${placeId}) does not have a geometry key, pick a different place!`);
    }
    return {
      id: placeId,
      name: result.name,
      imgUrl: mainImageUrl,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      // https://developers.google.com/maps/documentation/places/web-service/supported_types
      types: result.types,
    };
  } catch (error: any) {
    throw new createHttpError.BadRequest(`Failed to get info about placeId ${placeId}: ${error.message}`);
  }
};

/**
 * Given an itinerary id, returns the Itinerary object from data
 */
const getItineraryById = (id: string) => {
  const itinerary = getData().itineraries[id];
  if (itinerary === undefined) {
    throw new createHttpError.BadRequest(`Itinerary with id ${id} does not exist!`);
  }
  return itinerary;
};

/**
 * Given the plan input, returns an itinerary id corresponding to the itinerary
 */
export const itineraryGenerate = async (user: User, plan: PlanInput): Promise<ItineraryNew> => {
  const { startDate, endDate, accomodation, places } = plan;
  const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  if (totalDays < 1) throw new createHttpError.BadRequest(`Total days must be > 0. Given: ${totalDays}`);
  if (places.length < 1) throw new createHttpError.BadRequest(`Must have at least one place. Given: ${places}`);

  const sortedPlaces = places.slice().sort((p1, p2) => p1.duration - p2.duration);

  let currPlaceId = accomodation.place_id;
  let daysAccountedFor = 0;
  const planResult: PlanOutput = {};
  while (daysAccountedFor < totalDays && sortedPlaces.length > 0) {
    let dailyHours = 0;
    for (let i = sortedPlaces.length - 1; i >= 0; --i) {
      const nextPlace = sortedPlaces[i];
      const travelTimeSeconds = await calculateTravelTime(currPlaceId, nextPlace.place_id);
      const travelTimeHours = Math.ceil(travelTimeSeconds / 3600);
      const additionalTime = nextPlace.duration + travelTimeHours;
      if (dailyHours + additionalTime > c.MAX_HOURS_PER_DAY) {
        continue;
      }

      const place = sortedPlaces.splice(i, 1)[0];
      const placeDetails = await getPlaceDetails(place.place_id);
      const key = `day${daysAccountedFor + 1}`;
      if (!planResult[key]) {
        planResult[key] = [];
      }
      planResult[key].push({
        duration: nextPlace.duration,
        travelTimeFromPrevLocation: travelTimeHours,
        prevLocationId: currPlaceId,
        startTime: c.STARTING_HOUR + dailyHours,
        endTime: c.STARTING_HOUR + dailyHours + additionalTime,
        ...placeDetails,
        place_id: ''
      });
      currPlaceId = nextPlace.place_id;
      dailyHours += additionalTime;
    }
    ++daysAccountedFor;
  }

  const id = randomUUID();
  user.itineraryIds.add(id);
  getData().itineraries[id] = {
    id,
    ownerId: user.userId,
    location: plan.location,
    plan: planResult,
    dateCreated: new Date(),
  };
  saveData();
  return { itineraryId: id };
};

/**
 * Get an itinerary based on the given Id. User not really needed.
 */
export const itineraryView = (user: User, itineraryId: string) => {
  return getItineraryById(itineraryId);
};

/**
 * Add a review to the given itinerary
 */
export const addItineraryReview = (user: User, itineraryId: string, rating: number, comment: string) => {
  if (!rating || rating < 0) {
    throw new createHttpError.BadRequest(`Rating was not provided or is negative! (given: ${rating}`);
  }
  if (!comment) {
    throw new createHttpError.BadRequest('Comment cannot be empty!');
  }
  const itinerary = getItineraryById(itineraryId);
  const reviewId = randomUUID();
  const review = {
    reviewId,
    rating,
    comment,
    ownerId: user.userId,
    itineraryId: itinerary.id,
  };
  getData().reviews[reviewId] = review;
  saveData();
  return { reviewId };
};

/**
 * View all reviews for the given itinerary
 */
export const viewItineraryReviews = (user: User, itineraryId: string) => {
  return {
    reviews: Object.values(getData().reviews)
      .filter(r => r.itineraryId === itineraryId)
      .map(r => ({
        reviewId: r.reviewId,
        ownerId: r.ownerId,
        comment: r.comment,
        rating: r.rating,
      }))
  };
};

/**
 * Get list of all itineraries for a given location
 */
export const viewLocationItinerarys = (user: User, dest: string) => {
  return {
    itineraries: Object.values(getData().itineraries)
      .filter(r => r.location === dest)
  };
};

/**
 * Frontend upload photo url (preferably as base 64) with optional caption
 */
export const uploadItineraryPhoto = (user: User, itineraryId: string, url: string, caption?: string) => {
  if (!url) {
    throw new createHttpError.BadRequest(`Url was not provided (given: ${url}`);
  }
  const itinerary = getItineraryById(itineraryId);
  const photoId = randomUUID();
  const photo = {
    photoId,
    url,
    caption,
    ownerId: user.userId,
    itineraryId: itinerary.id,
  };
  getData().uploadedPhotos[photoId] = photo;
  saveData();
  return { photoId };
};

/**
 * View all uploaded photos for the given itinerary
 */
export const viewItineraryPhotos = (user: User, itineraryId: string) => {
  return {
    photos: Object.values(getData().uploadedPhotos)
      .filter(p => p.itineraryId === itineraryId)
      .map(p => ({
        photoId: p.photoId,
        ownerId: p.ownerId,
        url: p.url,
        caption: p.caption,
      }))
  };
};
