import nc from 'next-connect';
import morgan from 'morgan';
import { getToken } from '@api-utils/cookies';
import { getMinifiedUser, getRateLimitHeaders } from '@api-utils/helpers';
import { checkCookies } from '@api-utils/middleware';
import { errorStatus, get } from '@api-utils/twitter';

const search = nc()
  .use(morgan('dev'))
  .use(checkCookies)
  .get(async (req, res) => {
    const [token, secret] = getToken(req.cookies);
    const { q } = req.query;
    try {
      const { data, resp: { headers }} = await get(token, secret, 'users/search', { q, count: 5 });
      const users = data.map(u => ({
        ...getMinifiedUser(u),
        lowercase_name: u.name.toLowerCase(),
        lowercase_screen_name: u.screen_name.toLowerCase()
      }));
      console.log(`Got search results of "${q}"`);
      const [limit, remaining, reset] = getRateLimitHeaders(headers);
      res.setHeader('x-rate-limit-limit', limit);
      res.setHeader('x-rate-limit-remaining', remaining);
      res.setHeader('x-rate-limit-reset', reset);
      return res.status(200).send(users);
    } catch (err) {
      console.error(`Error getting search results for ${q}`)
      return res.status(errorStatus(err)).send(err);
    }
  })

export default search;
