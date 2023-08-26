import fs from 'fs';
import { Itinerary, Review, UploadedPhoto, User } from '../../shared/types';
import { DATABASE_FILE } from '../../shared/constants';

interface Data {
  users: Record<string, User>;
  sessions: Set<string>;
  itineraries: Record<string, Itinerary>,
  reviews: Record<string, Review>,
  uploadedPhotos: Record<string, UploadedPhoto>,
}

let data: Data = {
  users: {},
  sessions: new Set(),
  itineraries: {},
  reviews: {},
  uploadedPhotos: {},
};

const convertArraysToSets = (obj: any): any => {
  if (Array.isArray(obj)) {
    return new Set(obj.map(convertArraysToSets));
  } else if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertArraysToSets(obj[key]);
      }
    }
    return result;
  }
  return obj;
};

const convertSetsToArrays = (obj: any): any => {
  if (obj instanceof Set) {
    return Array.from(obj).map(convertSetsToArrays);
  } else if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertSetsToArrays(obj[key]);
      }
    }
    return result;
  }
  return obj;
};

export const getData = () => data;
export const getDataAsJson = () => convertSetsToArrays(data);

export const loadData = () => {
  if (fs.existsSync(DATABASE_FILE)) {
    data = convertArraysToSets(JSON.parse(fs.readFileSync(DATABASE_FILE, 'utf-8')));
  }
};

export const saveData = () => {
  const savedData = JSON.stringify(convertSetsToArrays(data));
  fs.writeFileSync(DATABASE_FILE, savedData);
};
