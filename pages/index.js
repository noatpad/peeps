import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import Fuse from 'fuse.js';
import { getUser, getLists, getMembersFromList, applyChanges } from '@web-utils/api';
import { sortLists, sortUsers, userSortCompare, changeObj } from '@web-utils/helpers';

import Title from '../components/Title';
import SelectorPane from '../components/SelectorPane';
import ListSelector from '../components/ListSelector';
import UserSelector from '../components/UserSelector';
import Button from '../components/Button';
import ChangesModal from '../components/ChangesModal';

const Home = ({ auth, setAuth }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [lists, setLists] = useState([]);
  const [activeListID, setActiveListID] = useState(-1);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [add, setAdd] = useState([]);
  const [del, setDel] = useState([]);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const fuseListRef = useRef(new Fuse([], { keys: ['lowercase_name'] }));
  const fuseUserRef = useRef(new Fuse([], { keys: ['lowercase_name', 'lowercase_screen_name'] }));
  const router = useRouter();
  const cookies = new Cookies();

  const activeList = activeListID === -1 ? undefined : lists.find(l => l.id_str === activeListID);
  const activeAdds = activeListID === -1 ? undefined : add.find(a => a.id === activeListID);
  const activeDels = activeListID === -1 ? undefined : del.find(d => d.id === activeListID);

  // Helper-to-hook function to get and set lists
  const helperGetLists = () => {
    getLists()
      .then((lists) => setLists(sortLists(lists)))
      .catch(err => console.error(err))
  }

  // Verify that you can make API calls
  useEffect(() => {
    const tokenInCookie = cookies.get('token') !== undefined && cookies.get('secret') !== undefined;
    if (loading && tokenInCookie) {
      getUser()
        .then(data => {
          setUserData(data);
          setAuth(true);
        })
        .catch(err => console.log(err))
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
    helperGetLists();
  }, [auth]);

  // Get users when selecting a list
  useEffect(() => {
    if (!auth || activeListID === -1) { return }
    setLoadingUsers(true);
    getMembersFromList(activeListID)
      .then((users) => {
        setUsers(sortUsers(users));
        setLoadingUsers(false);
      })
      .catch(err => console.error(err))
  }, [activeListID]);

  // Select a list
  const selectList = (id_str) => {
    setActiveListID(id_str);
  }

  // Prepare a user to be added to a list
  const prepareToAddUser = ({ id_str, name, screen_name, profile_image_url_https }) => {
    const userToAdd = { id_str, name, screen_name, profile_image_url_https };

    const newAdd = [...add];
    let index = newAdd.findIndex(a => a.id === activeListID);
    if (index === -1) {
      newAdd.push(changeObj(activeListID, activeList.name));
      index = newAdd.length - 1;
    }

    // Skip if the user is already in the list or prepared to be added
    if (users.some(u => u.id_str === id_str) || newAdd[index].users.some(a => a.id_str === id_str)) { return }

    newAdd[index].users.push(userToAdd);
    newAdd[index].users.sort(userSortCompare);
    setAdd(newAdd);
  }

  // Undo the preparation above for user addition
  const unprepareToAddUser = (id_str) => {
    const newAdd = [...add];
    const list_index = newAdd.findIndex(a => a.id === activeListID);
    const user_index = newAdd[list_index].users.findIndex(u => u.id_str === id_str);

    newAdd[list_index].users.splice(user_index, 1);
    if (!newAdd[list_index].users.length) {
      newAdd.splice(list_index, 1);
    }
    setAdd(newAdd);
  }

  // Prepare a user to be deleted from a list
  const prepareToDelUser = ({ id_str, name, screen_name, profile_image_url_https }) => {
    const userToDel = { id_str, name, screen_name, profile_image_url_https };
    const newDel = [...del];
    let index = newDel.findIndex(a => a.id === activeListID);
    if (index === -1) {
      newDel.push(changeObj(activeListID, activeList.name));
      index = newDel.length - 1;
    }
    newDel[index].users.push(userToDel);
    newDel[index].users.sort(userSortCompare);
    setDel(newDel);
  }

  // Undo the preparation above for user deletion
  const unprepareToDelUser = (id_str) => {
    const newDel = [...del];
    const list_index = newDel.findIndex(a => a.id === activeListID);
    const user_index = newDel[list_index].users.findIndex(u => u.id_str === id_str);

    newDel[list_index].users.splice(user_index, 1);
    if (!newDel[list_index].users.length) {
      newDel.splice(list_index, 1);
    }
    setDel(newDel);
  }

  // Clear changes
  const clearChanges = () => {
    setAdd([]);
    setDel([]);
  }

  // Apply all changes
  const handleApplyChanges = () => {
    applyChanges(add, del)
      .then(_ => {
        setActiveListID(-1);
        setUsers([]);
        clearChanges();
        console.log('Changes applied!');
      })
      .then(_ => {
        setTimeout(() => {
          helperGetLists();
          setShowChangesModal(false);
          console.log('Refreshed lists!');
        }, 5000);
      })
      .catch(err => console.error(err))
  }

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
            activeListID={activeListID}
            add={add}
            del={del}
            selectList={selectList}
          />
        </SelectorPane>
        <SelectorPane
          title={activeListID === -1 ? 'List name...' : activeList.name}
          subtitle={activeListID === -1 ? 'nothing...' : `${activeList.member_count} member${activeList.member_count !== 1 ? 's' : ''}`}
          adds={activeAdds !== undefined ? activeAdds.users.length : 0}
          dels={activeDels !== undefined ? activeDels.users.length : 0}
        >
          {activeListID !== -1 && !loadingUsers && (
            <UserSelector
              fuseRef={fuseUserRef}
              users={users}
              adds={activeAdds !== undefined ? activeAdds.users : []}
              dels={activeDels !== undefined ? activeDels.users : []}
              prepareToAddUser={prepareToAddUser}
              unprepareToAddUser={unprepareToAddUser}
              prepareToDelUser={prepareToDelUser}
              unprepareToDelUser={unprepareToDelUser}
            />
          )}
          {loadingUsers && (
            <p>Loading...</p>
          )}
        </SelectorPane>
      </div>
      <div className="flex justify-center">
        <Button text="Apply" run={() => setShowChangesModal(true)} disabled={!add.length && !del.length}/>
        <Button text="Clear" run={clearChanges} warning/>
      </div>
      <ChangesModal
        showModal={showChangesModal}
        closeModal={() => setShowChangesModal(false)}
        applyChanges={handleApplyChanges}
        add={add}
        del={del}
      />
    </main>
  )
}

export default Home;
