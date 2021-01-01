import { API_URL } from './config';
import axios from 'axios';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Start authentication with a request token
export const startAuth = () => (
  axios.get('/auth')
    .then(({ data: { oauth_token: request_token, oauth_token_secret: request_secret }}) => {
      sessionStorage.setItem('request_token', request_token);
      sessionStorage.setItem('request_secret', request_secret);
      window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${request_token}`;
    })
    .catch(err => console.error(err))
)

// Wrap up authentication with an access token
export const completeAuth = (request_token, verifier) => {
  const request_secret = sessionStorage.getItem('request_secret');
  return axios.get('/auth/complete', { params: { request_token, request_secret, verifier }})
    .then(_ => {
      sessionStorage.removeItem('request_token');
      sessionStorage.removeItem('request_secret');
    })
    .catch(err => console.error(err))
}

// Verify user info
export const verify = () => {
  return axios.get('/api/verify')
    .then(({ data }) => data)
    .catch(err => console.error(err))
}

// Get all lists owned by the user
export const getLists = () => {
  return axios.get('/api/getLists')
    .then(({ data }) => data)
    .catch(err => console.error(err))
}
