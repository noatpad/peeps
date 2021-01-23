import React, { useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import { MEMBERS_PER_PAGE, MEMBER_COUNT_LIMIT } from '@web-utils/config';

import Loading from './Loading';
import SearchOrAddMember from './SearchOrAddMember';
import MemberItem from './MemberItem';
import { Prev, Next } from './Icons';

const MemberSelector = ({ fuse, following, inactive, loading, users, adds, dels, prepareToAddUser, unprepareToAddUser, prepareToDelUser, unprepareToDelUser }) => {
  const [searchActive, setSearchActive] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limitReached, setLimitReached] = useState(false);

  // Fuzzy search list and pagination
  let searchResults = query ? fuse.search(query.toLowerCase()) : users.map(l => ({ item: l }));
  dels.forEach(d => {
    const delIndex = searchResults.findIndex(s => s.item.id_str === d.id_str);
    if (delIndex === -1) { return }
    searchResults[delIndex].del = true;
  })
  searchResults = [...adds.map(a => ({ item: a, add: true })), ...searchResults];
  const offset = (page - 1) * MEMBERS_PER_PAGE;
  const pageResults = searchResults.slice(offset, offset + MEMBERS_PER_PAGE);

  // Go back to the start page when searching
  useEffect(() => {
    if (page === 1) { return }
    setPage(1);
  }, [query]);

  // Check if member count limit has been reached for a given list
  useEffect(() => {
    setLimitReached((users.length + adds.length - dels.length) >= MEMBER_COUNT_LIMIT);
  }, [adds.length, dels.length]);

  // Helper function to pick the right handler for selecting a suggestion
  const handleSuggestionClick = (user, aboutToDelete, alreadyAdded) => {
    if (alreadyAdded) { return }
    if (aboutToDelete) {
      unprepareToDelUser(user.id_str);
    } else {
      prepareToAddUser(user);
    }
  }

  // Helper function to pick the right handler for selecting an item
  const handleItemClick = (user, add, del) => {
    if (add) {
      unprepareToAddUser(user.id_str);
    } else if (del) {
      unprepareToDelUser(user.id_str);
    } else {
      prepareToDelUser(user);
    }
  }

  // Sub-component for results
  const results = () => {
    // When the list has no members or soon-to-be-added members
    if (!users.length && !searchResults.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
          <h4 className="text-2xl">There are no members in this list!</h4>
          <p>Why not add one to it?</p>
        </div>
      )
    }

    // When no member could be found through a search query
    if (!searchResults.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
          <h4 className="text-2xl">Couldn&apos;t find any members!</h4>
          <p>Maybe a typo?</p>
        </div>
      )
    }

    // Display all members of the selected list
    return pageResults.map(({ item: user, add, del }) => (
      <MemberItem
        key={user.id_str}
        onClick={() => handleItemClick(user, add, del)}
        user={user}
        add={add}
        del={del}
        limitReached={limitReached}
      />
    ))
  }

  // Display when no list is selected
  if (inactive) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
        <h4 className="text-2xl">No list selected.</h4>
        <p>On standby though...</p>
      </div>
    )
  }

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-400 italic">
        <Loading size={50}/>
        <p>Loading members of your list...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full pt-6">
      <SearchOrAddMember
        following={following}
        users={users}
        query={query}
        setQuery={setQuery}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        adds={adds}
        dels={dels}
        handleSuggestionClick={handleSuggestionClick}
        limitReached={limitReached}
      />
      <div className="flex-1 px-12 my-4 overflow-scroll scrollGradient">
        {results()}
      </div>
      {searchResults.length > MEMBERS_PER_PAGE && (
        <div className="flex-initial flex justify-center items-center mb-4">
          <Pagination
            totalItemsCount={searchResults.length}
            itemsCountPerPage={MEMBERS_PER_PAGE}
            onChange={(selected) => setPage(selected)}
            activePage={page}
            pageRangeDisplayed={5}
            prevPageText={<Prev size={20}/>}
            nextPageText={<Next size={20}/>}
            innerClass="inline-flex justify-center items-center p-2 rounded-lg shadow"
            itemClass="h-8 w-8 mx-1.5 rounded-lg"
            linkClass="flex justify-center items-center h-full w-full"
            hideFirstLastPages={true}
            activeClass="ring"
            disabledClass="opacity-40"
          />
        </div>
      )}
    </div>
  )
}

export default MemberSelector;
