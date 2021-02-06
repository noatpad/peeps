import React, { useState, useEffect } from 'react';
import { MEMBERS_PER_PAGE, MEMBER_COUNT_LIMIT } from '@web-utils/config';

import MemberResults from './MemberResults';
import Loading from './Loading';
import PaginationBar from './PaginationBar';
import SearchOrAddMember from './SearchOrAddMember';

const MemberSelector = ({
  fuse,
  following,
  inactive,
  loading,
  users,
  adds,
  dels,
  prepareToAddUser,
  unprepareToAddUser,
  prepareToDelUser,
  unprepareToDelUser,
  setSearchRateLimit,
  errorHandler
}) => {
  const [searchActive, setSearchActive] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limitReached, setLimitReached] = useState(false);

  // Fuzzy search list and pagination
  let searchResults = query ? fuse.search(query.toLowerCase()) : [...adds, ...users].map(l => ({ item: l }));
  adds.forEach(a => {
    const addIndex = searchResults.findIndex(s => s.item.id_str === a.id_str);
    if (addIndex === -1) { return }
    searchResults[addIndex].add = true;
  })
  dels.forEach(d => {
    const delIndex = searchResults.findIndex(s => s.item.id_str === d.id_str);
    if (delIndex === -1) { return }
    searchResults[delIndex].del = true;
  })
  const offset = (page - 1) * MEMBERS_PER_PAGE;
  const pageResults = searchResults
    .sort((a, _) => a.add ? -1 : 0)
    .slice(offset, offset + MEMBERS_PER_PAGE);

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

  // Helper function to pick the right handler for clicking on an item's button
  const handleMemberAction = (user, add, del) => {
    if (add) {
      unprepareToAddUser(user.id_str);
    } else if (del) {
      unprepareToDelUser(user.id_str);
    } else {
      prepareToDelUser(user);
    }
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
        setSearchRateLimit={setSearchRateLimit}
        errorHandler={errorHandler}
      />
      <div className="flex-1 px-4 sm:px-8 md:px-12 mt-4 overflow-scroll scrollGradient">
        <MemberResults
          results={pageResults}
          noMembers={!users.length && !searchResults.length}
          noHits={!searchResults.length}
          limitReached={limitReached}
          handleMemberAction={handleMemberAction}
        />
      </div>
      <PaginationBar
        itemCount={searchResults.length}
        limit={MEMBERS_PER_PAGE}
        page={page}
        setPage={setPage}
      />
    </div>
  )
}

export default MemberSelector;
