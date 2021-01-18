import { get } from '@api-utils/twitter';

const members = (req, res) => {
  const { token, secret } = req.cookies;
  const { id } = req.query;
  return get(token, secret, 'lists/members', { list_id: id, count: 5000 })
    .then(({ data }) => {
      const { users } = data;
      console.log(`Got ${users.length} members from list ${id}`);
      return res.status(200).send(users);
    })
    .catch(err => {
      console.error(`Error getting members from list ${id}`, res.status(500).send(err))
      return res.status(500).send(err);
    })
}

export default members;
