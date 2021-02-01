import nc from 'next-connect';
import morgan from 'morgan';
import { getToken } from '@api-utils/cookies';
import { getMinifiedList } from '@api-utils/helpers';
import { checkCookies } from '@api-utils/middleware';
import { errorStatus, post } from '@api-utils/twitter';

const del = nc()
  .use(morgan(('dev')))
  .use(checkCookies)
  .post(async (req, res) => {
    const [token, secret] = getToken(req.cookies);
    const { id } = req.query;
    try {
      const { data } = await post(token, secret, 'lists/destroy', { list_id: id });
      console.log(`Deleted list ${data.name} (${data.id_str})`);
      const list = getMinifiedList(data);
      return res.status(200).send(list);
    } catch (err) {
      console.error(`Error deleting list ${id}`);
      return res.status(errorStatus(err)).send(err);
    }
  })

export default del;
