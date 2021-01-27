import nc from 'next-connect';
import morgan from 'morgan';
import { serialize } from 'cookie';
import { getRequestToken } from '@api-utils/auth';
import { errorStatus } from '@api-utils/twitter';
import { DEV_AUTH, DEV_MODE } from '@api-utils/config';

const options = {
  path: '/',
  maxAge: 60 * 60 * 24 * 7,   // 1 week
  httpOnly: true,
  secure: true
}

const auth = nc()
  .use(morgan('dev'))
  .post(async (req, res) => {
    // Dev helper to use my own access token
    if (DEV_MODE && req.body.dev) {
      res.setHeader('Set-Cookie', [
        serialize('token', DEV_AUTH.token, options),
        serialize('secret', DEV_AUTH.secret, options)
      ]);
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
