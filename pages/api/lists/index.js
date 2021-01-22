import nc from 'next-connect';
import morgan from 'morgan';
import { get } from '@api-utils/twitter';

const lists = nc()
  .use(morgan('dev'))
  .get((req, res) => {
    const { token, secret } = req.cookies;
    return get(token, secret, 'lists/ownerships', { count: 1000 })
      .then(({ data }) => {
        const lists = data.lists.map(l => ({
          ...l,
          lowercase_name: l.name.toLowerCase(),
          add: [],
          del: []
        }))
        console.log(`Got ${lists.length} lists from user`);
        return res.status(200).send(lists);
      })
      .catch(err => {
        console.log('Error getting lists', err);
        return res.status(500).send(err);
      })
  })

export default lists;
