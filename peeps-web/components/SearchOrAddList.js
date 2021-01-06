import React, { useRef } from 'react';
import { LIST_NAME_LIMIT } from '../utils/config';

const SearchOrAddList = ({ query, setQuery, searchActive, setSearchActive, newList, setNewList }) => {
  const searchInputRef = useRef();
  const addInputRef = useRef();

  // Handler for clicking the search button
  const handleClickSearch = () => {
    setSearchActive(true);
    searchInputRef.current.focus();
  }

  // Handler for clicking the "add list" button
  const handleClickAdd = () => {
    setSearchActive(false);
    addInputRef.current.focus();
  }

  const validTitle = newList.name.length > 0 && newList.name.length <= LIST_NAME_LIMIT;

  return (
    <div className="flex-initial flex items-center px-8">
      <div className={`${searchActive ? 'flex-1' : 'flex-initial'} flex items-center mx-1 border border-gray-300 rounded-full`}>
        <button className="p-2.5" onClick={handleClickSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={20} width={20}>
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
        <input
          className={`${searchActive ? 'flex-1 ml-1 mr-3' : 'w-0 ml-0 mr-0'}`}
          ref={searchInputRef}
          value={query}
          placeholder="Search for a list"
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className={`${!searchActive ? 'flex-1' : 'flex-initial'} relative flex items-center mx-1 border border-gray-300 rounded-full`}>
        <button className="p-2" onClick={handleClickAdd}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" height={24} width={24}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <input
          className={searchActive ? "w-0 ml-0 mr-0" : "flex-1 ml-1 mr-3"}
          ref={addInputRef}
          value={newList.name}
          placeholder="What's the name of the new list?"
          onChange={e => setNewList({ ...newList, name: e.target.value })}
        />
        <span className={`${searchActive ? 'hidden' : 'initial'} absolute right-0 mr-3 ${validTitle ? 'text-gray-300' : 'text-red-400'}`}>
          {newList.name.length}/{LIST_NAME_LIMIT}
        </span>
      </div>
    </div>
  )
}

export default SearchOrAddList;
