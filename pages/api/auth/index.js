import nc from 'next-connect';
import morgan from 'morgan';
import { getRequestToken } from '@api-utils/auth';

const auth = nc()
  .use(morgan('dev'))
  .get((req, res) => {
    return getRequestToken()
      .then(data => {
        console.log('Got request token. Redirecting to authentication page...');
        res.status(200).send(data);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error getting OAuth request token');
      })
  })

export default auth;
