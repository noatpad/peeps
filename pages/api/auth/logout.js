import nc from 'next-connect';
import morgan from 'morgan';
import { serialize } from 'cookie';
import { errorStatus } from '@api-utils/twitter';

const options = {
  path: '/',
  maxAge: -1,      // expire right away
  httpOnly: true,
  secure: true
}

const logout = nc()
  .use(morgan('dev'))
  .post(async (req, res) => {
    try {
      res.setHeader('Set-Cookie', [
        serialize('token', '', options),
        serialize('secret', '', options)
      ]);
      console.log('Logged off!');
      return res.status(200).send('Logged off!');
    } catch (err) {
      console.error('Error logging off');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default logout;
