import nc from 'next-connect';
import morgan from 'morgan';
import { get } from '@api-utils/twitter';

const verify = (token, secret) => (
  get(token, secret, 'account/verify_credentials')
    .then(({ data }) => data)
    .catch(err => err)
)

const getFollowing = (token, secret, cursor = -1, following = []) => (
  get(token, secret, 'friends/ids', { cursor, strigify_ids: true })
    .then(({ data }) => {
      following.push(...data.ids);
      if (data.next_cursor_str === '0') { return following }
      return getFollowing(token, secret, data.next_cursor_str, following);
    })
)

const user = nc()
  .use(morgan('dev'))
  .get((req, res) => {
    const { token, secret } = req.cookies;
    return Promise.all([verify(token, secret), getFollowing(token, secret)])
      .then(([user, following]) => {
        console.log(`Got user data of ${user.name} (@${user.screen_name})`);
        return res.status(200).send({ user, following })
      })
      .catch(errors => {
        console.error('Error getting user data', res.status(500).send(errors));
        return res.status(500).send(errors)
      });
  })

export default user;
