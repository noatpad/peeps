import nc from 'next-connect';
import morgan from 'morgan';
import { getToken } from '@api-utils/cookies';
import { getMinifiedList } from '@api-utils/helpers';
import { checkCookies } from '@api-utils/middleware';
import { errorStatus, get } from '@api-utils/twitter';

const lists = nc()
  .use(morgan('dev'))
  .use(checkCookies)
  .get(async (req, res) => {
    const [token, secret] = getToken(req.cookies);
    try {
      const { data } = await get(token, secret, 'lists/ownerships', { count: 1000 });
      const lists = data.lists.map(l => ({
        ...getMinifiedList(l),
        lowercase_name: l.name.toLowerCase(),
        add: [],
        del: []
      }));
      console.log(`Got ${lists.length} lists from user`);
      return res.status(200).send(lists);
    } catch (err) {
      console.error('Error getting lists');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default lists;
