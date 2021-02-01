import CryptoJS from 'crypto-js';
import { serialize } from 'cookie';
import { ENC_KEY } from './config';

// Set cookie to expire in 1 week
const cookieOptions = {
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: true,
  secure: true
};

// Expire cookie immediately
const expireOptions = { ...cookieOptions, maxAge: -1 };

// Create an encrypted cookie with API tokens
export const authCookie = (token, secret) => {
  const val = [token, secret].join('~')
  return serialize('peeps-auth', CryptoJS.AES.encrypt(val, ENC_KEY), cookieOptions);
}

// Create a cookie set to expire the current one
export const expireCookie = () => serialize('peeps-auth', '', expireOptions);

// Get tokens from an encrypted cookie
export const getToken = ({ 'peeps-auth': cookie }) => {
  const decrypted = CryptoJS.AES.decrypt(cookie, ENC_KEY);
  return decrypted.toString(CryptoJS.enc.Utf8).split('~');
};
