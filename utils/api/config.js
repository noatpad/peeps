// Dev stuff
export const DEV_MODE = process.env.VERCEL_ENV === 'development';
export const DEV_AUTH = DEV_MODE ? {
  token: process.env.DEV_TOKEN,
  secret: process.env.DEV_SECRET
} : {}
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
export const CALLBACK_URL = `${process.env.BASE_URL}/callback`;
export const ENC_KEY = process.env.COOKIE_ENC_KEY;

// Twitter API shenanigans
export const USER_LOOKUP_LIMIT = 25;
export const ADD_LIMIT = 100;
export const DEL_LIMIT = 100;
