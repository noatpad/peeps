import nc from 'next-connect';
import morgan from 'morgan';
import { serialize } from 'cookie';
import { getAccessToken } from '@api-utils/auth';
import { errorStatus } from '@api-utils/twitter';

const options = {
  path: '/',
  maxAge: 60 * 60 * 24 * 7,   // 1 week
  httpOnly: true,
  secure: true
}

const done = nc()
  .use(morgan('dev'))
  .post(async (req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const { request_token, request_secret, verifier } = req.body;
    try {
      const data = await getAccessToken(request_token, request_secret, verifier);
      // TODO: Use a single cookie instead of 2
      res.setHeader('Set-Cookie', [
        serialize('token', data.oauth_token, options),
        serialize('secret', data.oauth_token_secret, options)
      ]);
      console.log('Authenticated!');
      return res.status(200).send(data);
    } catch (err) {
      console.error('Error authenticating');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default done;
