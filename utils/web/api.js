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
  return axios.get('/auth/done', { params: { request_token, request_secret, verifier }})
    .then(_ => {
      sessionStorage.removeItem('request_token');
      sessionStorage.removeItem('request_secret');
    })
    .catch(err => console.error(err))
}

// Get user data and his following list
export const getUser = () => (
  axios.get('/user')
    .then(({ data }) => data)
    .catch(err => err)
)

// Get all lists owned by the user
export const getLists = () => (
  axios.get('/lists')
    .then(({ data }) => data.map(i => ({
      ...i,
      lowercase_name: i.name.toLowerCase(),
      add: [],
      del: []
    })))
    .catch(err => console.error(err))
)

// Get all members from a given list
export const getMembersFromList = ({ id_str }) => (
  axios.get(`/lists/${id_str}/members`)
    .then(({ data }) => data.map(i => ({
      ...i,
      lowercase_name: i.name.toLowerCase(),
      lowercase_screen_name: i.screen_name.toLowerCase()
    })))
    .catch(err => console.error(err))
)

// Create a new list
export const addList = (list) => (
  axios.post('/lists/add', { ...list })
    .then(({ data }) => ({
      ...data,
      lowercase_name: data.name.toLowerCase(),
      add: [],
      del: []
    }))
    .catch(err => console.error(err))
)

// Delete a list
export const deleteList = ({ id_str }) => (
  axios.post(`/lists/${id_str}/delete`)
    .then(({ data }) => data)
    .catch(err => console.error(err))
)

// Search for a user
export const search = (q) => (
  axios.get('/search', { params: { q }})
    .then(({ data }) => data)
    .catch(err => console.error(err))
)
