import { post } from '@api-utils/twitter';

const del = (req, res) => {
  if (req.method !== 'POST') { return res.status(404).send('Wrong method') }

  const { token, secret } = req.cookies;
  const { id } = req.query;
  return post(token, secret, 'lists/destroy', { list_id: id })
    .then(({ data }) => {
      console.log(`Deleted list ${data.name} (${data.id_str})`);
      return res.status(200).send(data);
    })
    .catch(err => {
      console.error(`Error deleting list ${id}`, err);
      return res.status(500).send(err);
    })
}

export default del;
