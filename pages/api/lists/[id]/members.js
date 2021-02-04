import nc from 'next-connect';
import morgan from 'morgan';
import { getToken } from '@api-utils/cookies';
import { getMinifiedUser, getRateLimitHeaders } from '@api-utils/helpers';
import { checkCookies } from '@api-utils/middleware';
import { errorStatus, get } from '@api-utils/twitter';

const members = nc()
  .use(morgan('dev'))
  .use(checkCookies)
  .get(async (req, res) => {
    const [token, secret] = getToken(req.cookies);
    const { id } = req.query;
    try {
      const { data, resp: { headers }} = await get(token, secret, 'lists/members', { list_id: id, count: 5000 });
      const users = data.users.map(u => ({
        ...getMinifiedUser(u),
        lowercase_name: u.name.toLowerCase(),
        lowercase_screen_name: u.screen_name.toLowerCase()
      }));
      console.log(`Got ${users.length} members from list ${id}`);
      const [limit, remaining, reset] = getRateLimitHeaders(headers);
      res.setHeader('x-rate-limit-limit', limit);
      res.setHeader('x-rate-limit-remaining', remaining);
      res.setHeader('x-rate-limit-reset', reset);
      return res.status(200).send(users);
    } catch (err) {
      console.error(`Error getting members from list ${id}`)
      return res.status(errorStatus(err)).send(err);
    }
  })

export default members;
