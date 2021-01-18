import nc from 'next-connect';
import morgan from 'morgan';
import { serialize } from 'cookie';
import { getAccessToken } from '@api-utils/auth';

const done = nc()
  .use(morgan('dev'))
  .get((req, res) => {
    const { request_token, request_secret, verifier } = req.query;
    return getAccessToken(request_token, request_secret, verifier)
      .then(data => {
        console.log('Authenticated!');
        res.setHeader('Set-Cookie', [serialize('token', data.oauth_token), serialize('secret', data.oauth_token_secret)]).status(200).send(data);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error getting OAuth access token');
      })
  })

export default done;
