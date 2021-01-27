import nc from 'next-connect';
import morgan from 'morgan';
import { expireCookie } from '@api-utils/cookies';
import { errorStatus } from '@api-utils/twitter';


const logout = nc()
  .use(morgan('dev'))
  .post(async (req, res) => {
    try {
      res.setHeader('Set-Cookie', expireCookie());
      console.log('Logged off!');
      return res.status(200).send('Logged off!');
    } catch (err) {
      console.error('Error logging off');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default logout;
