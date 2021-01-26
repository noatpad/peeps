import nc from 'next-connect';
import morgan from 'morgan';
import { errorStatus, post } from '@api-utils/twitter';
import { checkCookies } from '@api-utils/middleware';

const del = nc()
  .use(morgan(('dev')))
  .use(checkCookies)
  .post(async (req, res) => {
    const { token, secret } = req.cookies;
    const { id } = req.query;
    try {
      const { data } = await post(token, secret, 'lists/destroy', { list_id: id });
      console.log(`Deleted list ${data.name} (${data.id_str})`);
      return res.status(200).send(data);
    } catch (err) {
      console.error(`Error deleting list ${id}`);
      return res.status(errorStatus(err)).send(err);
    }
  })

export default del;
