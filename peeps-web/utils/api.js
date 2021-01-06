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
export const verify = () => (
  axios.get('/api/verify')
    .then(({ data }) => data)
    .catch(err => console.error(err))
)

// Get all lists owned by the user
export const getLists = () => (
  axios.get('/api/getLists')
    .then(({ data }) => data.lists.map(i => ({ ...i, lowercase_name: i.name.toLowerCase() })))
    .catch(err => console.error(err))
)

// Get all members from a given list
export const getMembersFromList = (list) => {
  const { id_str } = list;
  return axios.get('/api/getMembersFromList', { params: { id: id_str }})
    .then(({ data }) => data.users.map(i => ({ ...i, lowercase_name: i.name.toLowerCase(), lowercase_screen_name: i.screen_name.toLowerCase() })))
    .catch(err => console.error(err))
}

// Create a new list
export const addList = (list) => (
  axios.post('/api/addList', null, { params: list })
    .then(({ data }) => ({ ...data, lowercase_name: data.name.toLowerCase() }))
    .catch(err => console.error(err))
)

// Delete a list
export const deleteList = (list) => {
  const { id_str } = list;
  return axios.post('/api/deleteList', null, { params: { list_id: id_str }})
    .then(({ data }) => data)
    .catch(err => console.error(err))
}

// Search for a user
export const search = (q) => (
  axios.get('/api/search', { params: { q }})
    .then(({ data }) => data)
    .catch(err => console.error(err))
)
