export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
export const CALLBACK_URL = `${process.env.VERCEL_ENV === 'development' ? 'http' : 'https'}://${process.env.VERCEL_URL}/callback`;
