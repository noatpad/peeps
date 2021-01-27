import nc from 'next-connect';
import morgan from 'morgan';
import { getAccessToken } from '@api-utils/auth';
import { authCookie } from '@api-utils/cookies';
import { errorStatus } from '@api-utils/twitter';

const done = nc()
  .use(morgan('dev'))
  .post(async (req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const { request_token, request_secret, verifier } = req.body;
    try {
      const data = await getAccessToken(request_token, request_secret, verifier);
      res.setHeader('Set-Cookie', authCookie(data.oauth_token, data.oauth_token_secret));
      console.log('Authenticated!');
      return res.status(200).send(data);
    } catch (err) {
      console.error('Error authenticating');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default done;
