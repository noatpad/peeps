import nc from 'next-connect';
import morgan from 'morgan';
import { errorStatus, post } from '@api-utils/twitter';
import { checkCookies } from '@api-utils/middleware';

const add = nc()
  .use(morgan('dev'))
  .use(checkCookies)
  .post(async (req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const { token, secret } = req.cookies;
    const { name, description, mode } = req.body;
    try {
      const { data } = await post(token, secret, 'lists/create', { name, description, mode: mode ? 'private' : 'public' });
      const list = {
        ...data,
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
