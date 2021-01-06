import React, { useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';

import SearchOrAddUser from './SearchOrAddUser';
import UserItem from './UserItem';
import { Prev, Next } from './Chevrons';

const RESULTS_PER_PAGE = 20;

const UserSelector = ({ fuseRef, users }) => {
  const [searchActive, setSearchActive] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // Fuzzy search list and pagination
  const searchResults = query ? fuseRef.current.search(query.toLowerCase()) : users.map(l => ({ item: l }));
  const offset = (page - 1) * RESULTS_PER_PAGE;
  const pageResults = searchResults.slice(offset, offset + RESULTS_PER_PAGE);

  // Go back to the start page when searching
  useEffect(() => {
    if (page === 1) { return }
    setPage(1);
  }, [query]);

  return (
    <div className="flex flex-col h-full pt-6">
      <SearchOrAddUser
        query={query}
        setQuery={setQuery}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
      />
      <div className="flex-1 px-12 overflow-scroll">
        {pageResults.map(({ item }) => (
          <UserItem
            key={item.id_str}
            user={item}
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
