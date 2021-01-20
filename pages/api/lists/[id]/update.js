import nc from 'next-connect';
import morgan from 'morgan';
import { post } from '@api-utils/twitter';

const update = nc()
  .use(morgan(('dev')))
  .post((req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const { token, secret } = req.cookies;
    const { id } = req.query;
    const { name, description, mode } = req.body;

    return post(token, secret, 'lists/update', { list_id: id, name, description, mode: mode ? 'private' : 'public' })
      .then(({ data }) => {
        console.log(`Updated list from ${name} -> ${data.name} (${data.id_str})`);
        return res.status(200).send(data);
      })
      .catch(err => {
        console.error(`Error updating list ${id}`, err);
        return res.status(500).send(err);
      })
  })

export default update;
