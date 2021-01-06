import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import Fuse from 'fuse.js';
import { verify, getLists, getMembersFromList } from '../utils/api';
import { sortLists, sortUsers } from '../utils/helpers';

import Title from '../components/Title';
import SelectorPane from '../components/SelectorPane';
import ListSelector from '../components/ListSelector';
import UserSelector from '../components/UserSelector';
import Button from '../components/Button';

const Home = ({ auth, setAuth }) => {
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [users, setUsers] = useState([]);
  const fuseListRef = useRef(new Fuse([], { keys: ['lowercase_name'] }));
  const fuseUserRef = useRef(new Fuse([], { keys: ['lowercase_name', 'lowercase_screen_name'] }));
  const router = useRouter();
  const cookies = new Cookies();

  // Verify that you can make API calls
  useEffect(() => {
    const tokenInCookie = cookies.get('token') !== undefined && cookies.get('secret') !== undefined;
    if (loading && tokenInCookie) {
      verify()
        .then(_ => setAuth(true))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    } else if (!auth) {
      router.replace('/hello');
    }
  }, [loading]);

  // Update fuse searching for lists when lists are updated
  useEffect(() => {
    fuseListRef.current.setCollection(lists);
  }, [lists]);

  // Update fuse searching for users when users are updated
  useEffect(() => {
    fuseUserRef.current.setCollection(users);
  }, [users]);

  // Get all owned lists when authenticated
  useEffect(() => {
    if (!auth) { return }
    getLists()
      .then((lists) => setLists(lists.sort(sortLists)))
      .catch(err => console.error(err))
  }, [auth]);

  // Get users when selecting a list
  useEffect(() => {
    if (!auth || activeList === null) { return }
    getMembersFromList(activeList)
      .then((users) => setUsers(users.sort(sortUsers)))
      .catch(err => console.error(err))
  }, [activeList]);

  // TODO: Implement a better loading screen
  if (loading) {
    return (
      <main className="text-center">
        <Title/>
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main>
      <div className="my-40">
        <Title/>
      </div>
      <div className="flex my-12">
        <SelectorPane
          title="Your lists"
          subtitle={`${lists.length} list${lists.length !== 1 ? 's' : ''}`}
        >
          <ListSelector
            fuseRef={fuseListRef}
            lists={lists}
            setLists={setLists}
            activeList={activeList}
            setActiveList={setActiveList}
          />
        </SelectorPane>
        <SelectorPane
          title={activeList === null ? 'List name...' : activeList.name}
          subtitle={activeList === null ? 'nothing...' : `${activeList.member_count} member${activeList.member_count !== 1 ? 's' : ''}`}
        >
          <UserSelector
            fuseRef={fuseUserRef}
            users={users}
          />
        </SelectorPane>
      </div>
      <div className="flex justify-center">
        <Button text="Apply"/>
        <Button text="Clear" warning/>
      </div>
    </main>
  )
}

export default Home;
