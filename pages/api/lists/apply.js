import { post } from '@api-utils/twitter';
const ADD_LIMIT = 100;
const DEL_LIMIT = 100;

const apply = (req, res) => {
  if (req.method !== 'POST') { return res.status(404).send('Wrong method') }
  if (!req.body) { return res.status(400).send('Expected body') }

  const { token, secret } = req.cookies;
  const { add, del } = req.body;
  const promises = [];

  del.forEach(({ id, users }) => {
    for (let i = 0; i < users.length; i += DEL_LIMIT) {
      const user_ids = users.slice(i, i + DEL_LIMIT);
      promises.push(new Promise((resolve, reject) => (
        post(token, secret, '/lists/members/destroy_all', { list_id: id, user_id: user_ids })
          .then(({ data }) => {
            console.log(`Deleted ${users.length} users from list ${data.name} (${data.id_str})`);
            return resolve(data);
          })
          .catch(err => {
            console.error(`Error deleting members from list ${id}`);
            return reject(err);
          })
      )))
    }
  });

  add.forEach(({ id, users }) => {
    for (let i = 0; i < users.length; i += ADD_LIMIT) {
      const user_ids = users.slice(i, i + ADD_LIMIT);
      promises.push(new Promise((resolve, reject) => (
        post(token, secret, '/lists/members/create_all', { list_id: id, user_id: user_ids })
          .then(({ data }) => {
            console.log(`Added ${users.length} users from list ${data.name} (${data.id_str})`);
            return resolve(data);
          })
          .catch(err => {
            console.error(`Error adding members from list ${id}`);
            return reject(err);
          })
      )))
    }
  });

  return promises.reduce((chain, current) => chain.then(current), Promise.resolve())
    .then(_ => {
      const additions = add.reduce((accum, { users }) => accum + users.length, 0);
      const deletions = del.reduce((accum, { users }) => accum + users.length, 0);
      console.log(`Successfully added ${additions} member${additions !== 1 ? 's' : ''} in ${add.length} list${add.length !== 1 ? 's' : ''} & deleted ${deletions} member${deletions !== 1 ? 's' : ''} from ${del.length} list${del.length !== 1 ? 's' : ''}`);
      return res.status(200).send({});
    })
    .catch(err => {
      console.error('Error upon applying changes', err);
      return res.status(500).send(err);
    })
}

export default apply;
