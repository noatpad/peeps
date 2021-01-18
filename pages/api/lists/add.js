import nc from 'next-connect';
import morgan from 'morgan';
import { post } from '@api-utils/twitter';

const add = nc()
  .use(morgan('dev'))
  .post((req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const { token, secret } = req.cookies;
    const { name, description, mode_private } = req.body;
    return post(token, secret, 'lists/create', { name, description, mode: mode_private ? 'private' : 'public' })
      .then(({ data }) => {
        console.log(`Created list ${data.name} (${data.id_str})`);
        return res.status(200).send(data);
      })
      .catch(err => {
        console.error(`Error creating list ${name}`, err);
        return res.status(500).send(err)
      })
  })

export default add;
