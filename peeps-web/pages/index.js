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
  const [activeListIndex, setActiveListIndex] = useState(-1);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fuseListRef = useRef(new Fuse([], { keys: ['lowercase_name'] }));
  const fuseUserRef = useRef(new Fuse([], { keys: ['lowercase_name', 'lowercase_screen_name'] }));
  const router = useRouter();
  const cookies = new Cookies();

  const activeList = activeListIndex === -1 ? null : lists[activeListIndex];

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
    setHasChanges(lists.some(l => l.add.length > 0 || l.del.length > 0));
  }, [lists]);

  // Update fuse searching for users when users are updated
  useEffect(() => {
    fuseUserRef.current.setCollection(users);
  }, [users]);

  // Get all owned lists when authenticated
  useEffect(() => {
    if (!auth) { return }
    getLists()
      .then((lists) => setLists(sortLists(lists)))
      .catch(err => console.error(err))
  }, [auth]);

  // Get users when selecting a list
  useEffect(() => {
    if (!auth || activeListIndex === -1) { return }
    setLoadingUsers(true);
    getMembersFromList(activeList)
      .then((users) => {
        setUsers(sortUsers(users));
        setLoadingUsers(false);
      })
      .catch(err => console.error(err))
  }, [activeListIndex]);

  // TODO: Implement a better loading screen
  if (loading) {
    return (
      <main className="text-center">
        <Title/>
        <p>Loading...</p>
      </main>
    )
  }

  const listPaneSub = (`${lists.length} list${lists.length !== 1 ? 's' : ''}`);
  const userPaneTitle = (activeListIndex === -1 ? 'List name...' : activeList.name);
  const userPaneSub = (activeListIndex === -1 ? 'nothing...' : `${activeList.member_count} member${activeList.member_count !== 1 ? 's' : ''}`);
  const activeListAdditions = (activeListIndex === -1 ? 0 : activeList.add.length);
  const activeListDeletions = (activeListIndex === -1 ? 0 : activeList.del.length);

  return (
    <main>
      <div className="my-40">
        <Title/>
      </div>
      <div className="flex my-12">
        <SelectorPane
          title="Your lists"
          subtitle={listPaneSub}
        >
          <ListSelector
            fuseRef={fuseListRef}
            lists={lists}
            setLists={setLists}
            activeListIndex={activeListIndex}
            setActiveListIndex={setActiveListIndex}
          />
        </SelectorPane>
        <SelectorPane
          title={userPaneTitle}
          subtitle={userPaneSub}
          adds={activeListAdditions}
          dels={activeListDeletions}
        >
          {activeListIndex !== -1 && !loadingUsers && (
            <UserSelector
              fuseRef={fuseUserRef}
              users={users}
              lists={lists}
              setLists={setLists}
              activeListIndex={activeListIndex}
            />
          )}
          {loadingUsers && (
            <p>Loading...</p>
          )}
        </SelectorPane>
      </div>
      <div className="flex justify-center">
        <Button text="Apply" disabled={!hasChanges}/>
        <Button text="Clear" warning/>
      </div>
    </main>
  )
}

export default Home;
