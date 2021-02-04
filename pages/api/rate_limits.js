import nc from 'next-connect';
import morgan from 'morgan';
import { getToken } from '@api-utils/cookies';
import { checkCookies } from '@api-utils/middleware';
import { errorStatus, get } from '@api-utils/twitter';

const rate_limits = nc()
  .use(morgan('dev'))
  .use(checkCookies)
  .get(async (req, res) => {
    const [token, secret] = getToken(req.cookies);
    try {
      const { data } = await get(token, secret, 'application/rate_limit_status', { resources: 'friends,users,lists' });
      const limits = {
        user: data.resources.friends['/friends/ids'],
        search: data.resources.users['/users/search'],
        lists: data.resources.lists['/lists/ownerships'],
        members: data.resources.lists['/lists/members']
      }
      console.log(limits);
      console.log('Got rate limit statuses');
      return res.status(200).send(limits);
    } catch (err) {
      console.error('Error getting rate limit status');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default rate_limits;
