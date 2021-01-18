import { getRequestToken } from '@api-utils/auth';

const auth = (req, res) => {
  if (req.method !== 'GET') { return res.status(404).send('Wrong method') }

  return getRequestToken()
    .then(data => {
      console.log('Got request token. Redirecting to authentication page...');
      res.status(200).send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error getting OAuth request token');
    })
}

export default auth;
