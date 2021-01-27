import nc from 'next-connect';
import morgan from 'morgan';
import { getToken } from '@api-utils/cookies';
import { checkCookies } from '@api-utils/middleware';
import { errorStatus, get } from '@api-utils/twitter';

const search = nc()
  .use(morgan('dev'))
  .use(checkCookies)
  .get(async (req, res) => {
    const [token, secret] = getToken(req.cookies);
    const { q } = req.query;
    try {
      const { data } = await get(token, secret, 'users/search', { q, count: 5 });
      const users = data.map(u => ({
        ...u,
        lowercase_name: u.name.toLowerCase(),
        lowercase_screen_name: u.screen_name.toLowerCase()
      }));
      console.log(`Got search results of "${q}"`);
      return res.status(200).send(users);
    } catch (err) {
      console.error(`Error getting search results for ${q}`)
      return res.status(errorStatus(err)).send(err);
    }
  })

export default search;
