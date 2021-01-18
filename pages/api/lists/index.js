import { get } from '@api-utils/twitter';

const lists = (req, res) => {
  if (req.method !== 'GET') { return res.status(404).send('Wrong method') }

  const { token, secret } = req.cookies;
  return get(token, secret, 'lists/ownerships', { count: 1000 })
    .then(({ data }) => {
      const { lists } = data;
      console.log(`Got ${lists.length} lists from user`);
      return res.status(200).send(lists);
    })
    .catch(err => {
      console.log('Error getting lists', err);
      return res.status(500).send(err);
    })
}

export default lists;
