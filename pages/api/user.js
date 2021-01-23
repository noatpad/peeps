import nc from 'next-connect';
import morgan from 'morgan';
import { get, post } from '@api-utils/twitter';
import { USER_LOOKUP_LIMIT } from '@api-utils/config';

const verify = (token, secret) => (
  get(token, secret, 'account/verify_credentials')
    .then(({ data }) => data)
    .catch(err => err)
)

const lookup = (token, secret, user_id) => {
  return (
    post(token, secret, 'users/lookup', { user_id })
      .then(({ data }) => data.map(user => ({
        ...user,
        lowercase_name: user.name.toLowerCase(),
        lowercase_screen_name: user.screen_name.toLowerCase()
      })))
      .catch(err => err)
  )
}

const followingLookup = (token, secret, ids) => {
  const chunks = [];
  for (let i = 0; i < ids.length; i += USER_LOOKUP_LIMIT) {
    chunks.push(ids.slice(i, i + USER_LOOKUP_LIMIT));
  }

  return Promise.all(chunks.map(c => lookup(token, secret, c.join(','))))
    .then(arrays => [].concat(...arrays))
    .catch(errors => errors)
}

const getFollowing = (token, secret, cursor = -1, following = []) => (
  get(token, secret, 'friends/ids', { cursor, stringify_ids: true })
    .then(({ data }) => {
      following.push(...data.ids);
      if (data.next_cursor_str === '0') { return followingLookup(token, secret, following) }
      return getFollowing(token, secret, data.next_cursor_str, following);
    })
)

const user = nc()
  .use(morgan('dev'))
  .get((req, res) => {
    const { token, secret } = req.cookies;
    return Promise.all([verify(token, secret), getFollowing(token, secret)])
      .then(([user, following]) => {
        console.log(`Got user data of ${user.name} (@${user.screen_name}), as well as ${following.length} users they follow`);
        return res.status(200).send({ user, following })
      })
      .catch(errors => {
        console.error('Error getting user data', res.status(500).send(errors));
        return res.status(500).send(errors)
      });
  })

export default user;
