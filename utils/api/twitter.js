import Twit from 'twit';
import { API_KEY, API_SECRET } from './config';

const twitter = (token, secret) => (
  new Twit({
    consumer_key: API_KEY,
    consumer_secret: API_SECRET,
    access_token: token,
    access_token_secret: secret
  })
)

// Common GET request through twit
export const get = (token, secret, endpoint, params = {}) => {
  const T = twitter(token, secret);
  return T.get(endpoint, params)
    .then(resp => resp)
    .catch(err => err)
}

// Common POST request through twit
export const post = (token, secret, endpoint, params = {}) => {
  const T = twitter(token, secret);
  return T.post(endpoint, params)
    .then(resp => resp)
    .catch(err => err)
}
