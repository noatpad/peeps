import nc from 'next-connect';
import morgan from 'morgan';
import { getToken } from '@api-utils/cookies';
import { ADD_LIMIT, DEL_LIMIT } from '@api-utils/config';
import { checkCookies } from '@api-utils/middleware';
import { errorStatus, post } from '@api-utils/twitter';

const removeMembers = async (token, secret, { id, users }) => {
  try {
    let count = 0;
    for (let i = 0; i < users.length; i += DEL_LIMIT) {
      const user_ids = users.slice(i, i + DEL_LIMIT);
      const { data } = await post(token, secret, '/lists/members/destroy_all', { list_id: id, user_id: user_ids.join(',') });
      console.log(`Removed members ${i}-${i + user_ids.length} from list ${data.name} (${data.id_str})`);
      count += user_ids.length;
    }
    console.log(`Successfully removed all ${count} members from the list`);
  } catch (err) {
    console.error('Error removing members at this point');
    console.error(err);
    return err;
    // return Promise.reject(err);
  }
}

const addMembers = async (token, secret, { id, users }) => {
  try {
    let count = 0;
    for (let i = 0; i < users.length; i += ADD_LIMIT) {
      const user_ids = users.slice(i, i + ADD_LIMIT);
      const { data } = await post(token, secret, '/lists/members/create_all', { list_id: id, user_id: user_ids.join(',') });
      console.log(`Added members ${i}-${i + user_ids.length} from list ${data.name} (${data.id_str})`);
      count += user_ids.length;
    }
    console.log(`Successfully added all ${count} members from the list`);
  } catch (err) {
    console.error('Error adding members at this point');
    console.error(err);
    return err;
    // return Promise.reject(err);
  }
}

const apply = nc()
  .use(morgan('dev'))
  .use(checkCookies)
  .post(async (req, res) => {
    if (!req.body) { return res.status(400).send('Expected body') }

    const [token, secret] = getToken(req.cookies);
    const { add, del } = req.body;

    try {
      for (let i = 0; i < del.length; i++) {
        await removeMembers(token, secret, del[i]);
      }

      for (let i =0; i < add.length; i++) {
        await addMembers(token, secret, add[i]);
      }

      return res.status(200).send({});
    } catch (err) {
      console.error('Error applying changes');
      return res.status(errorStatus(err)).send(err);
    }
  })

export default apply;
