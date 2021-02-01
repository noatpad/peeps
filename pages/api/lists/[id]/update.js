import nc from 'next-connect';
import morgan from 'morgan';
import { getToken } from '@api-utils/cookies';
import { getMinifiedList } from '@api-utils/helpers';
import { checkCookies } from '@api-utils/middleware';
import { errorStatus, post } from '@api-utils/twitter';

const update = nc()
  .use(morgan(('dev')))
  .use(checkCookies)
  .post(async (req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const [token, secret] = getToken(req.cookies);
    const { id } = req.query;
    const { name, description, mode } = req.body;
    try {
      const { data } = await post(token, secret, 'lists/update', { list_id: id, name, description, mode: mode ? 'private' : 'public' });
      console.log(`Updated list from ${name} -> ${data.name} (${data.id_str})`);
      const list = getMinifiedList(data);
      return res.status(200).send(list);
    } catch (err) {
      console.error(`Error updating list ${id}`);
      return res.status(errorStatus(err)).send(err);
    }
  })

export default update;
