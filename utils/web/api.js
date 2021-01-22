import axios from 'axios';
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

// Start authentication with a request token
export const startAuth = () => (
  axios.post('/auth')
    .then(({ data }) => {
      const { oauth_token, oauth_token_secret } = data;
      sessionStorage.setItem('request_token', oauth_token);
      sessionStorage.setItem('request_secret', oauth_token_secret);
      window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
    })
    .catch(err => console.error(err))
)

// Wrap up authentication with an access token
export const completeAuth = (request_token, verifier) => {
  const request_secret = sessionStorage.getItem('request_secret');
  return axios.post('/auth/done', { request_token, request_secret, verifier })
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
    .then(({ data }) => data)
    .catch(err => console.error(err))
)

// Get all members from a given list
export const getMembersFromList = (id) => (
  axios.get(`/lists/${id}/members`)
    .then(({ data }) => data)
    .catch(err => console.error(err))
)

// Create a new list
export const addList = (list) => (
  axios.post('/lists/add', { ...list })
    .then(({ data }) => data)
    .catch(err => console.error(err))
)

// Delete a list
export const deleteList = (id) => (
  axios.post(`/lists/${id}/delete`)
    .then(({ data }) => data)
    .catch(err => console.error(err))
)

// Update a list's info
export const updateList = ({ id, ...rest }) => (
  axios.post(`lists/${id}/update`, { ...rest })
    .then(({ data }) => data)
    .catch(err => console.error(err))
)

// Search for a user
export const search = (q) => (
  axios.get('/search', { params: { q }})
    .then(({ data }) => data)
    .catch(err => console.error(err))
)

// Apply all changes
export const applyChanges = (add, del) => {
  const min_add = add.map((a) => ({ id: a.id, users: a.users.map(u => u.id_str) }));
  const min_del = del.map((d) => ({ id: d.id, users: d.users.map(u => u.id_str) }));
  return axios.post('/lists/apply', { add: min_add, del: min_del })
    .then(({ data }) => data)
    .catch(err => console.error(err));
}
