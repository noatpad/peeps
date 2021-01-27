import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { getUser, getLists, getMembersFromList, applyChanges } from '@web-utils/api';
import { listSortCompare, userSortCompare, numberNoun } from '@web-utils/helpers';

import ApplyChangesModal from '@components/Modal/ApplyChangesModal';
import Button from '@components/Button';
import ClearChangesModal from '@components/Modal/ClearChangesModal';
import ErrorModal from '@components/Modal/ErrorModal';
import ListSelector from '@components/ListSelector';
import Loading from '@components/Loading';
import MemberSelector from '@components/MemberSelector';
import SelectorPane from '@components/SelectorPane';
import Title from '@components/Title';
import UnauthorizedModal from '@components/Modal/UnauthorizedModal';

const Home = ({ auth, setAuth }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ user: {}, following: [] });
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [activeListID, setActiveListID] = useState(-1);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [add, setAdd] = useState([]);
  const [del, setDel] = useState([]);
  const [showApplyChangesModal, setShowApplyChangesModal] = useState(false);
  const [showClearChangesModal, setShowClearChangesModal] = useState(false);
  const [apiError, setApiError] = useState({});
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const fuseListRef = useRef(new Fuse([], { keys: ['lowercase_name'] }));
  const fuseMemberRef = useRef(new Fuse([], { keys: ['lowercase_name', 'lowercase_screen_name'] }));
  const router = useRouter();

  const activeList = activeListID === -1 ? undefined : lists.find(l => l.id_str === activeListID);
  const activeAdds = activeListID === -1 ? [] : add.find(a => a.id === activeListID)?.users ?? [];
  const activeDels = activeListID === -1 ? [] : del.find(d => d.id === activeListID)?.users ?? [];

  // Verify that you can make API calls
  useEffect(() => {
    getUser()
      .then(data => {
        setUserData(data);
        setAuth(true);
        setLoading(false);
      })
      .catch(err => {
        if (err.status === 401) {
          setTimeout(() => router.replace('/hello'), 500);
        } else {
          errorHandler(err);
        }
      })
  }, []);

  // Get all owned lists when authenticated
  useEffect(() => {
    if (!auth) { return }
    setLoadingLists(true);
    getLists()
      .then(lists => setLists(lists.sort(listSortCompare)))
      .catch(err => errorHandler(err))
      .finally(() => setLoadingLists(false));
  }, [auth]);

  // Update fuse searching for lists when lists are updated
  useEffect(() => {
    fuseListRef.current.setCollection(lists);
  }, [lists]);

  // Update fuse searching for members when members are updated
  useEffect(() => {
    fuseMemberRef.current.setCollection(users);
  }, [users]);

  // Get users when selecting a list
  useEffect(() => {
    if (!auth) { return }
    if (activeListID === -1) {
      setUsers([]);
    } else {
      setLoadingUsers(true);
      getMembersFromList(activeListID)
        .then((users) => setUsers(users.sort(userSortCompare)))
        .catch(err => {
          errorHandler(err);
          setActiveListID(-1);
        })
        .finally(() => setLoadingUsers(false));
    }
  }, [activeListID]);

  // Simple error handler for unauthorized or other errored responses
  const errorHandler = ({ data, status }) => {
    console.error(data);
    setApiError(data);
    if (status === 401) {
      setShowUnauthorizedModal(true);
    } else {
      setShowErrorModal(true);
    }
  }

  // Helper to merge changes by list
  const mergedChanges = () => {
    const changesPerList = add.map(a => ({ id: a.id, name: a.name, additions: a.users }));
    del.forEach(d => {
      const index = changesPerList.findIndex(c => c.id === d.id);
      if (index !== -1) {
        changesPerList[index].deletions = d.users;
      } else {
        changesPerList.push({ id: d.id, name: d.name, deletions: d.users });
      }
    })
    return changesPerList.sort(listSortCompare);
  }

  // Select a list
  const selectList = (id_str) => {
    if (id_str === activeListID) { return }
    setLoadingUsers(true);
    setActiveListID(id_str);
  }

  // Prepare a user to be added to a list
  const prepareToAddUser = ({ id_str, name, screen_name, profile_image_url_https }) => {
    const userToAdd = { id_str, name, screen_name, profile_image_url_https };

    const newAdd = [...add];
    let index = newAdd.findIndex(a => a.id === activeListID);
    if (index === -1) {
      newAdd.push({ id: activeListID, name: activeList.name, users: [] });
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
      newDel.push({ id: activeListID, name: activeList.name, users: [] });
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
      .then(_ => router.replace('/done'))
      .catch(err => errorHandler(err))
      .finally(() => setShowApplyChangesModal(false))
  }

  // Clear all changes
  const handleClearChanges = () => {
    setAdd([]);
    setDel([]);
    setShowClearChangesModal(false);
    console.log('Clear changes!');
  }

  // Loading screen when not authenticated
  if (loading) {
    return (
      <main>
        <Title/>
        <div className="text-center">
          <Loading size={100}/>
        </div>
        {/* MODALS */}
        <UnauthorizedModal
          show={showUnauthorizedModal}
          close={() => setShowUnauthorizedModal(false)}
          error={apiError}
        />
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          error={apiError}
        />
      </main>
    )
  }

  return (
    <main>
      <Title user={userData.user}/>
      <motion.div
        className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 my-12"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.45, delay: 0.3 }}
      >
        <SelectorPane
          title="Your lists"
          subtitle={numberNoun(lists.length, "list")}
        >
          <ListSelector
            fuse={fuseListRef.current}
            loading={loadingLists}
            lists={lists}
            setLists={setLists}
            activeListID={activeListID}
            add={add}
            del={del}
            selectList={selectList}
            errorHandler={errorHandler}
          />
        </SelectorPane>
        <SelectorPane
          title={activeList?.name ?? 'Select a list!'}
          subtitle={activeListID === -1 ? 'List members will be displayed here...' : numberNoun(activeList?.member_count ?? 0, "member")}
          addCount={activeAdds.length}
          delCount={activeDels.length}
          italic={activeListID === -1}
        >
          <MemberSelector
            fuse={fuseMemberRef.current}
            following={userData?.following ?? []}
            inactive={activeListID === -1}
            loading={loadingUsers}
            users={users}
            adds={activeAdds}
            dels={activeDels}
            prepareToAddUser={prepareToAddUser}
            unprepareToAddUser={unprepareToAddUser}
            prepareToDelUser={prepareToDelUser}
            unprepareToDelUser={unprepareToDelUser}
            errorHandler={errorHandler}
          />
        </SelectorPane>
      </motion.div>
      <div className="flex justify-center">
        <Button run={() => setShowClearChangesModal(true)} disabled={!add.length && !del.length} warning>Clear</Button>
        <Button run={() => setShowApplyChangesModal(true)} disabled={!add.length && !del.length} primary>Apply</Button>
      </div>
      {/* MODALS */}
      <ApplyChangesModal
        show={showApplyChangesModal}
        close={() => setShowApplyChangesModal(false)}
        changes={mergedChanges()}
        applyChanges={handleApplyChanges}
      />
      <ClearChangesModal
        show={showClearChangesModal}
        close={() => setShowClearChangesModal(false)}
        clearChanges={handleClearChanges}
      />
      <UnauthorizedModal
        show={showUnauthorizedModal}
        close={() => setShowUnauthorizedModal(false)}
        error={apiError}
      />
      <ErrorModal
        show={showErrorModal}
        close={() => setShowErrorModal(false)}
        error={apiError}
      />
    </main>
  )
}

export default Home;
