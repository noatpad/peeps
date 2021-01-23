import nc from 'next-connect';
import morgan from 'morgan';
import { get } from '@api-utils/twitter';

const search = nc()
  .use(morgan('dev'))
  .get((req, res) => {
    const { token, secret } = req.cookies;
    const { q } = req.query;
    return get(token, secret, 'users/search', { q, count: 5 })
      .then(({ data }) => {
        const users = data.map(u => ({
          ...u,
          lowercase_name: u.name.toLowerCase(),
          lowercase_screen_name: u.screen_name.toLowerCase()
        }))
        console.log(`Got search results of "${q}"`);
        return res.status(200).send(users);
      })
      .catch(err => {
        console.error("Error getting search results", err);
        return res.status(500).send(err);
      })
  })

export default search;
