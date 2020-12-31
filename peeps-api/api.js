const Twit = require('twit');
const { API_KEY, API_SECRET } = require('./config');

const twitter = (token, secret) => (
  new Twit({
    consumer_key: API_KEY,
    consumer_secret: API_SECRET,
    access_token: token,
    access_token_secret: secret
  })
)

const get = (token, secret, endpoint, params = {}) => {
  const T = twitter(token, secret);
  return T.get(endpoint, params)
    .then(resp => resp)
    .catch(err => err)
}

const post = (token, secret, endpoint, params = {}) => {
  const T = twitter(token, secret);
  return T.post(endpoint, params)
    .then(resp => resp)
    .catch(err => err)
}

module.exports = { get, post }
