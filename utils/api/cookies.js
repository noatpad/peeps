import { serialize } from 'cookie';

// Set cookie to expire in 1 week
const cookieOptions = {
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: true,
  secure: true
}

// Expire cookie immediately
const expireOptions = {
  path: '/',
  maxAge: -1,
  httpOnly: true,
  secure: true
}

export const authCookie = (token, secret) => serialize('peeps-auth', [token, secret].join('~'), cookieOptions);
export const expireCookie = () => serialize('peeps-auth', '', expireOptions);
export const getToken = ({ 'peeps-auth': cookie }) => cookie.split('~');
