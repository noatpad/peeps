import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { getUser, getLists, getMembersFromList, applyChanges, checkRateLimitStatus } from '@web-utils/api';
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
import RateLimitBar from '@components/RateLimitBar';

const Home = ({
  auth, setAuth,
  userData, setUserData,
  lists, setLists,
  add, setAdd,
  del, setDel
}) => {
  const [loading, setLoading] = useState(true);
  const [loadingLists, setLoadingLists] = useState(false);
  const [activeListID, setActiveListID] = useState(-1);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showApplyChangesModal, setShowApplyChangesModal] = useState(false);
  const [showClearChangesModal, setShowClearChangesModal] = useState(false);
  const [rateLimits, setRateLimits] = useState({});
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
  useEffect(async () => {
    if (userData) {
      await checkRateLimits();
      setAuth(true);
      setLoading(false);
    } else {
      await getUser()
        .then(async data => {
          await checkRateLimits();
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
    }
  }, []);

  // Get all owned lists when authenticated
  useEffect(() => {
    if (!auth || lists) { return }
    prepareLists();
  }, [auth]);

  // Update fuse searching for lists when lists are updated
  useEffect(() => {
    fuseListRef.current.setCollection(lists);
  }, [lists]);

  // Update fuse searching for members when members are updated
  useEffect(() => {
    console.log(users, activeAdds);
    fuseMemberRef.current.setCollection([...users, ...activeAdds]);
  }, [users, activeAdds]);

  // Get users when selecting a list
  useEffect(() => {
    if (!auth) { return }
    if (activeListID === -1) {
      setUsers([]);
    } else {
      setLoadingUsers(true);
      getMembersFromList(activeListID)
        .then(({ users, rate_limit }) => {
          setUsers(users.sort(userSortCompare));
          setRateLimits({ ...rateLimits, members: rate_limit });
        })
        .catch(err => {
          errorHandler(err);
          setActiveListID(-1);
        })
        .finally(() => setLoadingUsers(false));
    }
  }, [activeListID]);

  // Helper to get rate limit statuses
  const checkRateLimits = () => (
    checkRateLimitStatus()
      .then(limits => setRateLimits(limits))
      .catch(err => errorHandler(err))
  )

  // Refresh rate limit upon hitting the reset time
  const refreshRateLimit = (endpoint) => {
    const newRateLimits = { ...rateLimits };
    newRateLimits[endpoint].remaining = rateLimits[endpoint].limit;
    newRateLimits[endpoint].reset = -1;
    setRateLimits(newRateLimits);
  }

  // Helper to set rate limit status for searches
  const setSearchRateLimit = (rate_limit) => setRateLimits({ ...rateLimits, search: rate_limit });

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

  // Load lists
  const prepareLists = () => {
    setActiveListID(-1);
    setLoadingLists(true);
    getLists()
      .then(({ lists, rate_limit }) => {
        setLists(lists.sort(listSortCompare));
        setRateLimits({ ...rateLimits, lists: rate_limit });
      })
      .catch(err => errorHandler(err))
      .finally(() => setLoadingLists(false));
  }

  // Remove deleted changes
  const handleRemoveDeletedChanges = (id) => {
    setAdd(add.filter(a => a.id !== id));
    setDel(del.filter(a => a.id !== id));
  }

  // Prepare a user to be added to a list
  const prepareToAddUser = (userToAdd) => {
    const newAdd = [...add];
    let index = newAdd.findIndex(a => a.id === activeListID);
    if (index === -1) {
      newAdd.push({ id: activeListID, name: activeList.name, users: [] });
      index = newAdd.length - 1;
    }

    // Skip if the user is already in the list or prepared to be added
    if (users.some(u => u.id_str === userToAdd.id_str) || newAdd[index].users.some(a => a.id_str === userToAdd.id_str)) { return }

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
      <Title user={userData?.user}/>
      <motion.div
        className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 my-12"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.45, delay: 0.3 }}
      >
        <div className="lg:flex-1 mx-4 sm:mx-8 md:mx-12 lg:mx-8 xl:mx-14 2xl:mx-20 space-y-3">
          {rateLimits.user && (
            <RateLimitBar
              title="User"
              rateLimit={rateLimits.user}
              refresh={() => refreshRateLimit('user')}
              creditText="You use a credit when you refresh the page."
            />
          )}
          {rateLimits.lists && (
            <RateLimitBar
              title="Lists"
              rateLimit={rateLimits.lists}
              refresh={() => refreshRateLimit('lists')}
              creditText="You use a credit when you refresh the page or press the 'Refresh lists' button."
            />
          )}
          <SelectorPane
            title="Your lists"
            subtitle={numberNoun(lists?.length ?? 0, "list")}
          >
            <ListSelector
              fuse={fuseListRef.current}
              loading={loadingLists}
              lists={lists ?? []}
              setLists={setLists}
              activeListID={activeListID}
              add={add}
              del={del}
              selectList={selectList}
              handleRemoveDeletedChanges={handleRemoveDeletedChanges}
              errorHandler={errorHandler}
            />
          </SelectorPane>
        </div>
        <div className="lg:flex-1 mx-4 sm:mx-8 md:mx-12 lg:mx-8 xl:mx-14 2xl:mx-20 space-y-3">
          {rateLimits.members && (
            <RateLimitBar
              title="List Members"
              rateLimit={rateLimits.members}
              refresh={() => refreshRateLimit('members')}
              creditText="You use a credit when you select a list and view its members."
            />
          )}
          {rateLimits.search && (
            <RateLimitBar
              title="Search"
              rateLimit={rateLimits.search}
              refresh={() => refreshRateLimit('search')}
              creditText="You use a credit when you search for a user to add and a non-follower is shown in the suggestions."
            />
          )}
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
              setSearchRateLimit={setSearchRateLimit}
              errorHandler={errorHandler}
            />
          </SelectorPane>
        </div>
      </motion.div>
      <div className="flex justify-center">
        <Button run={prepareLists}>Refresh lists</Button>
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
