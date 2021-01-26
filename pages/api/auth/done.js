import nc from 'next-connect';
import morgan from 'morgan';
import { serialize } from 'cookie';
import { getAccessToken } from '@api-utils/auth';
import { errorStatus } from '@api-utils/twitter';

const done = nc()
  .use(morgan('dev'))
  .post(async (req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const { request_token, request_secret, verifier } = req.body;
    try {
      const data = await getAccessToken(request_token, request_secret, verifier);
      console.log('Authenticated!');
      res.setHeader('Set-Cookie', [
        serialize('token', data.oauth_token, { path: '/' }),
        serialize('secret', data.oauth_token_secret, { path: '/' })
      ]);
      return res.status(200).send(data);
    } catch (err) {
      console.error('Error authenticating');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default done;
