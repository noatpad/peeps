import nc from 'next-connect';
import morgan from 'morgan';
import { errorStatus, get, post } from '@api-utils/twitter';
import { USER_LOOKUP_LIMIT } from '@api-utils/config';
import { checkCookies } from '@api-utils/middleware';

const verify = (token, secret) => (
  get(token, secret, 'account/verify_credentials')
    .then(({ data }) => {
      console.log(`Got user data of ${data.name} (@${data.screen_name})`);
      return data;
    })
    .catch(err => {
      console.error("Error getting user data");
      return Promise.reject(err);
    })
)

const lookup = (token, secret, user_id) => {
  return (
    post(token, secret, 'users/lookup', { user_id })
      .then(({ data }) => data.map(user => ({
        ...user,
        lowercase_name: user.name.toLowerCase(),
        lowercase_screen_name: user.screen_name.toLowerCase()
      })))
      .catch(err => Promise.reject(err))
  )
}

const followingLookup = (token, secret, ids) => {
  const chunks = [];
  for (let i = 0; i < ids.length; i += USER_LOOKUP_LIMIT) {
    chunks.push(ids.slice(i, i + USER_LOOKUP_LIMIT));
  }

  return Promise.all(chunks.map(c => lookup(token, secret, c.join(','))))
    .then(arrays => {
      const following = [].concat(...arrays);
      console.log(`Got ${following.length} users they follow`);
      return following;
    })
    .catch(errors => Promise.reject(errors))
}

const getFollowing = (token, secret, cursor = -1, following = []) => (
  get(token, secret, 'friends/ids', { cursor, stringify_ids: true })
    .then(({ data }) => {
      following.push(...data.ids);
      if (data.next_cursor_str === '0') { return followingLookup(token, secret, following) }
      return getFollowing(token, secret, data.next_cursor_str, following);
    })
    .catch(err => {
      console.error("Error getting user's following list");
      return Promise.reject(err);
    })
)

const user = nc()
  .use(morgan('dev'))
  .use(checkCookies)
  .get(async (req, res) => {
    const { token, secret } = req.cookies;
    try {
      const user = await verify(token, secret);
      const following = await getFollowing(token, secret);
      return res.status(200).send({ user, following });
    } catch (err) {
      return res.status(errorStatus(err)).send(err);
    }
  })

export default user;
