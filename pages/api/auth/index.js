import nc from 'next-connect';
import morgan from 'morgan';
import { getRequestToken } from '@api-utils/auth';
import { authCookie } from '@api-utils/cookies';
import { DEV_AUTH, DEV_MODE } from '@api-utils/config';
import { errorStatus } from '@api-utils/twitter';

const auth = nc()
  .use(morgan('dev'))
  .post(async (req, res) => {
    // Dev helper to use my own access token
    if (DEV_MODE && req.body.dev) {
      res.setHeader('Set-Cookie', authCookie(DEV_AUTH.token, DEV_AUTH.secret));
      console.log('Logging in with dev token...');
      return res.status(200).send('Logged in as dev!');
    }

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
