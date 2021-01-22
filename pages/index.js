import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Cookies from 'universal-cookie';
import Fuse from 'fuse.js';
import { getUser, getLists, getMembersFromList, applyChanges } from '@web-utils/api';
import { sortLists, sortUsers, userSortCompare, changeObj } from '@web-utils/helpers';

import Title from '@components/Title';
import Loading from '@components/Loading';
import SelectorPane from '@components/SelectorPane';
import ListSelector from '@components/ListSelector';
import UserSelector from '@components/UserSelector';
import Button from '@components/Button';
import ApplyChangesModal from '@components/Modal/ApplyChangesModal';
import ClearChangesModal from '@components/Modal/ClearChangesModal';

const Home = ({ auth, setAuth }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [activeListID, setActiveListID] = useState(-1);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [add, setAdd] = useState([]);
  const [del, setDel] = useState([]);
  const [showApplyChangesModal, setShowApplyChangesModal] = useState(false);
  const [showClearChangesModal, setShowClearChangesModal] = useState(false);
  const fuseListRef = useRef(new Fuse([], { keys: ['lowercase_name'] }));
  const fuseUserRef = useRef(new Fuse([], { keys: ['lowercase_name', 'lowercase_screen_name'] }));
  const router = useRouter();
  const cookies = new Cookies();

  const activeList = activeListID === -1 ? undefined : lists.find(l => l.id_str === activeListID);
  const activeAdds = activeListID === -1 ? undefined : add.find(a => a.id === activeListID);
  const activeDels = activeListID === -1 ? undefined : del.find(d => d.id === activeListID);

  // Helper-to-hook function to get and set lists
  const handleGetLists = () => {
    setLoadingLists(true);
    getLists()
      .then((lists) => {
        setLists(sortLists(lists));
        setLoadingLists(false);
      })
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
    handleGetLists();
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

  // Apply all changes
  const handleApplyChanges = () => {
    applyChanges(add, del)
      .then(_ => {
        setActiveListID(-1);
        setUsers([]);
        setAdd([]);
        setDel([]);
        console.log('Changes applied!');
      })
      .then(_ => {
        setTimeout(() => {
          handleGetLists();
          setShowApplyChangesModal(false);
          console.log('Refreshed lists!');
        }, 5000);
      })
      .catch(err => console.error(err))
  }

  // Clear all changes
  const handleClearChanges = () => {
    setAdd([]);
    setDel([]);
    setShowClearChangesModal(false);
    console.log('Clear changes!');
  }

  // Loading screen
  if (loading) {
    return (
      <main>
        <div className="py-40">
          <Title/>
        </div>
        <div className="text-center">
          <Loading size={100}/>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="py-40">
        <Title user={userData.user}/>
      </div>
      <motion.div
        className="flex my-12"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'tween', duration: 0.45, ease: 'easeOut' }}
      >
        <SelectorPane
          title="Your lists"
          subtitle={`${lists.length} list${lists.length !== 1 ? 's' : ''}`}
        >
          <ListSelector
            fuseRef={fuseListRef}
            loading={loadingLists}
            lists={lists}
            setLists={setLists}
            activeListID={activeListID}
            add={add}
            del={del}
            selectList={selectList}
          />
        </SelectorPane>
        <SelectorPane
          title={activeListID === -1 ? 'Select a list!' : activeList.name}
          subtitle={activeListID === -1 ? 'The list members will be displayed here...' : `${activeList.member_count} member${activeList.member_count !== 1 ? 's' : ''}`}
          adds={activeAdds !== undefined ? activeAdds.users.length : 0}
          dels={activeDels !== undefined ? activeDels.users.length : 0}
          italic={activeListID === -1}
        >
          <UserSelector
            fuseRef={fuseUserRef}
            loading={loadingUsers}
            users={users}
            adds={activeAdds !== undefined ? activeAdds.users : []}
            dels={activeDels !== undefined ? activeDels.users : []}
            prepareToAddUser={prepareToAddUser}
            unprepareToAddUser={unprepareToAddUser}
            prepareToDelUser={prepareToDelUser}
            unprepareToDelUser={unprepareToDelUser}
          />
        </SelectorPane>
      </motion.div>
      <div className="flex justify-center">
        <Button run={() => setShowClearChangesModal(true)} disabled={!add.length && !del.length} warning>Clear</Button>
        <Button run={() => setShowApplyChangesModal(true)} disabled={!add.length && !del.length} primary>Apply</Button>
      </div>
      <ApplyChangesModal
        show={showApplyChangesModal}
        close={() => setShowApplyChangesModal(false)}
        applyChanges={handleApplyChanges}
        add={add}
        del={del}
      />
      <ClearChangesModal
        show={showClearChangesModal}
        close={() => setShowClearChangesModal(false)}
        clearChanges={handleClearChanges}
      />
    </main>
  )
}

export default Home;
