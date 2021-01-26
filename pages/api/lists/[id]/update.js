import nc from 'next-connect';
import morgan from 'morgan';
import { errorStatus, post } from '@api-utils/twitter';
import { checkCookies } from '@api-utils/middleware';

const update = nc()
  .use(morgan(('dev')))
  .use(checkCookies)
  .post(async (req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const { token, secret } = req.cookies;
    const { id } = req.query;
    const { name, description, mode } = req.body;
    try {
      const { data } = await post(token, secret, 'lists/update', { list_id: id, name, description, mode: mode ? 'private' : 'public' });
      console.log(`Updated list from ${name} -> ${data.name} (${data.id_str})`);
      return res.status(200).send(data);
    } catch (err) {
      console.error(`Error updating list ${id}`);
      return res.status(errorStatus(err)).send(err);
    }
  })

export default update;
