// ========================================================================= //
// Environment
// ========================================================================= //

import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT || 49152);
export const HOST: string = process.env.IP || '127.0.0.1';
export const DEBUG = Boolean(process.env.DEBUG);
export const SERVER_URL = `http://${HOST}:${PORT}`;
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'hackathon';
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'invalid key';
export const DATABASE_FILE = 'data.json';

// ========================================================================= //
// Settings
// ========================================================================= //

export const NumericConstants = Object.freeze({
  STARTING_HOUR: 9, // 9 am
  MAX_HOURS_PER_DAY: 12, // 9 am - 9 pm
});
