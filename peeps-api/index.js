require('dotenv').config();
const { PORT, WEB_URL } = require('./config');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const auth = require('./auth');
const { get } = require('./api');

/* INITIALIZATION */
const app = express();
app.use(morgan('dev'));
app.use(cors({
  origin: WEB_URL,
  method: 'GET,POST',
  credentials: true
}));
app.use(cookieSession({
  name: 'blue-peeps-session',
  keys: ['token', 'verifier'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(cookieParser());
app.use(bodyParser.json());

/* AUTHENTICATION */
// Start authentication with a request token
app.get('/auth', (_, res) => {
  auth.getRequestToken()
    .then(data => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error getting OAuth request token');
    })
})

// Obtain access token to complete authentication
app.get('/auth/complete', ({ query: { request_token, request_secret, verifier }}, res) => {
  auth.getAccessToken(request_token, request_secret, verifier)
    .then(data => {
      console.log(data);
      res.cookie('token', data.oauth_token);
      res.cookie('secret', data.oauth_token_secret);
      res.status(200).send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error getting OAuth access token');
    })
})

/* API */
// Retrieve user info
app.get('/api/getUser', (req, res) => {
  const { token, secret } = req.cookies;
  get(token, secret, 'account/verify_credentials')
    .then(({ data }) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error getting user data')
    })
})

/* LISTEN */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
})
