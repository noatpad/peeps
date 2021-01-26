import nc from 'next-connect';
import morgan from 'morgan';
import { getRequestToken } from '@api-utils/auth';
import { errorStatus } from '@api-utils/twitter';

const auth = nc()
  .use(morgan('dev'))
  .post(async (req, res) => {
    try {
      const data = await getRequestToken();
      console.log('Got request token. Redirecting to authentication page...');
      return res.status(200).send(data);
    } catch (err) {
      console.error('Error getting request token');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default auth;
