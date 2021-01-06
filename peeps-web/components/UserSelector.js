import React, { useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import { sortUsers } from '../utils/helpers';

import SearchOrAddUser from './SearchOrAddUser';
import UserItem from './UserItem';
import { Prev, Next } from './Chevrons';

const RESULTS_PER_PAGE = 20;

const UserSelector = ({ fuseRef, users, lists, setLists, activeListIndex }) => {
  const [searchActive, setSearchActive] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // Fuzzy search list and pagination
  let searchResults = query ? fuseRef.current.search(query.toLowerCase()) : users.map(l => ({ item: l }));
  searchResults = [...lists[activeListIndex].add.map(a => ({ item: a, add: true })), ...searchResults];
  const offset = (page - 1) * RESULTS_PER_PAGE;
  const pageResults = searchResults.slice(offset, offset + RESULTS_PER_PAGE);
  console.log(pageResults);

  // Go back to the start page when searching
  useEffect(() => {
    if (page === 1) { return }
    setPage(1);
  }, [query]);

  // Prepare adding a user to a list
  const prepareToAddUser = ({ id_str, name, screen_name, profile_image_url_https }) => {
    const userToAdd = { id_str, name, screen_name, profile_image_url_https };
    const activeList = lists[activeListIndex];

    // Skip if the user is already in the list or prepared to be added
    if (users.some(u => u.id_str === id_str) || activeList.add.some(a => a.id_str === id_str)) { return }

    const newLists = [...lists];
    const newAdds = sortUsers(newLists[activeListIndex].add.concat(userToAdd))
    newLists[activeListIndex].add = newAdds;
    setLists(newLists);
  }

  return (
    <div className="flex flex-col h-full pt-6">
      <SearchOrAddUser
        query={query}
        setQuery={setQuery}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        prepareToAddUser={prepareToAddUser}
      />
      <div className="flex-1 px-12 overflow-scroll">
        {pageResults.map(({ item, add }) => (
          <UserItem
            key={item.id_str}
            user={item}
            add={add}
          />
        ))}
      </div>
      {searchResults.length > RESULTS_PER_PAGE && (
        <div className="flex-initial flex justify-center items-center my-2">
          <Pagination
            totalItemsCount={searchResults.length}
            itemsCountPerPage={RESULTS_PER_PAGE}
            onChange={(selected) => setPage(selected)}
            activePage={page}
            pageRangeDisplayed={5}
            prevPageText={Prev}
            nextPageText={Next}
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

export default UserSelector;
