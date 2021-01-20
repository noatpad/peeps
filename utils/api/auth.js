import axios from 'axios';
import jsSHA from 'jssha';
import qs from 'query-string';

import { API_KEY, API_SECRET, CALLBACK_URL } from './config';
const AUTH_URL = 'https://api.twitter.com';

// "Percent encode" a string
const percentEncode = (str) => encodeURIComponent(str).replace(/[!*()']/g, c => '%' + c.charCodeAt(0).toString(16))

// Finalize signature generation by running a hashing function
const hmac_sha1 = (str, secret) => {
  let shaObj = new jsSHA("SHA-1", "TEXT");
  shaObj.setHMACKey(secret, "TEXT");
  shaObj.update(str);
  return shaObj.getHMAC("B64");
}

// Generate a signature for a request
const getSignature = (method, url, sig_params, secret) => {
  const paramString = Object.keys(sig_params)
    .sort()
    .map(p => `${percentEncode(p)}=${percentEncode(sig_params[p])}`)
    .join('&');
  const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(paramString)}`;
  const signingKey = `${percentEncode(API_SECRET)}&${secret ? percentEncode(secret) : ''}`;
  return hmac_sha1(baseString, signingKey);
}

// Generate authorization header
const getAuthHeader = (method, url, access_token = null, access_secret = null, params = {}) => {
  console.log(CALLBACK_URL);
  const oauth_callback = CALLBACK_URL;
  const oauth_consumer_key = API_KEY;
  const oauth_timestamp = Math.round(Date.now() / 1000);
  const oauth_nonce = Buffer.from(`${oauth_consumer_key}:${oauth_timestamp}`).toString('base64');
  const oauth_signature_method = 'HMAC-SHA1';
  const oauth_token = access_token;
  const oauth_version = '1.0';

  const sig_params = oauth_token ? (
    { oauth_consumer_key, oauth_nonce, oauth_signature_method, oauth_timestamp, oauth_token, oauth_version, ...params }
  ) : (
    { oauth_callback, oauth_consumer_key, oauth_nonce, oauth_signature_method, oauth_timestamp, oauth_version, ...params }
  );
  const oauth_signature = getSignature(method, url, sig_params, access_secret);

  const auth_params = oauth_token ? (
    { oauth_consumer_key, oauth_nonce, oauth_signature, oauth_signature_method, oauth_timestamp, oauth_token, oauth_version }
  ) : (
    { oauth_callback, oauth_consumer_key, oauth_nonce, oauth_signature, oauth_signature_method, oauth_timestamp, oauth_version }
  );
  const header = 'OAuth ' + Object.keys(auth_params)
    .map(a => `${percentEncode(a)}="${percentEncode(auth_params[a])}"`)
    .join(', ')
    .trim();
  return header;
}

// Obtain a request token
export const getRequestToken = () => {
  const url = `${AUTH_URL}/oauth/request_token`;
  return axios.post(url, null, { headers: { 'Authorization': getAuthHeader('POST', url) }})
    .then(({ data }) => qs.parse(data))
    .catch(err => err)
}

// Obtain an access token
export const getAccessToken = (request_token, request_secret, verifier) => {
  const url = `${AUTH_URL}/oauth/access_token`;
  const params = { oauth_token: request_token, oauth_verifier: verifier };
  return axios.post(url, null, { params, headers: { 'Authorization': getAuthHeader('POST', url, request_token, request_secret, params) }})
    .then(({ data }) => qs.parse(data))
    .catch(err => err)
}
