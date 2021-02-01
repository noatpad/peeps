import nc from 'next-connect';
import morgan from 'morgan';
import { getToken } from '@api-utils/cookies';
import { getMinifiedList } from '@api-utils/helpers';
import { checkCookies } from '@api-utils/middleware';
import { errorStatus, post } from '@api-utils/twitter';

const add = nc()
  .use(morgan('dev'))
  .use(checkCookies)
  .post(async (req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const [token, secret] = getToken(req.cookies);
    const { name, description, mode } = req.body;
    try {
      const { data } = await post(token, secret, 'lists/create', { name, description, mode: mode ? 'private' : 'public' });
      const list = {
        ...getMinifiedList(data),
        lowercase_name: data.name.toLowerCase(),
        add: [],
        del: []
      }
      console.log(`Created list ${list.name} (${list.id_str})`);
      return res.status(200).send(list);
    } catch (err) {
      console.error(`Error creating list ${name}`);
      return res.status(errorStatus(err)).send(err);
    }
  })

export default add;
