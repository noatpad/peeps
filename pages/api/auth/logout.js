import nc from 'next-connect';
import morgan from 'morgan';
import { expireCookie, getToken } from '@api-utils/cookies';
import { errorStatus, post } from '@api-utils/twitter';


const logout = nc()
  .use(morgan('dev'))
  .post(async (req, res) => {
    const [token, secret] = getToken(req.cookies);
    try {
      await post(token, secret, '/oauth/invalidate_token');
      res.setHeader('Set-Cookie', expireCookie());
      console.log('Logged off!');
      return res.status(200).send('Logged off!');
    } catch (err) {
      console.error('Error logging off');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default logout;
