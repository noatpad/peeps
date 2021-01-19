import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { LIST_NAME_LIMIT } from '@web-utils/config';

const barVariants = {
  active: { flex: 1 },
  inactive: { flex: 0 }
};

const inputWrapperVariants = {
  active: { flex: 1, marginRight: '0.75rem' },
  inactive: { flex: 0, marginRight: '0px' }
};

const inputVariants = {
  active: { width: '100%' },
  inactive: { width: 0 }
};

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
      <motion.div className={`flex items-center mx-1 border border-gray-300 rounded-full`} variants={barVariants} animate={searchActive ? 'active' : 'inactive'}>
        <button className="p-2.5" onClick={handleClickSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={20} width={20}>
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
        <motion.div variants={inputWrapperVariants} animate={searchActive ? 'active' : 'inactive'}>
          <motion.input
            variants={inputVariants}
            animate={searchActive ? 'active' : 'inactive'}
            ref={searchInputRef}
            value={query}
            placeholder="Search for a list"
            onChange={e => setQuery(e.target.value)}
          />
        </motion.div>
      </motion.div>
      <motion.div className={`relative flex items-center mx-1 border border-gray-300 rounded-full`} variants={barVariants} animate={!searchActive ? 'active' : 'inactive'}>
        <button className="p-2" onClick={handleClickAdd}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" height={24} width={24}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <motion.div variants={inputWrapperVariants} animate={!searchActive ? 'active' : 'inactive'}>
          <motion.input
            variants={inputVariants}
            animate={!searchActive ? 'active' : 'inactive'}
            ref={addInputRef}
            value={newList.name}
            placeholder="What's the name of the new list?"
            onChange={e => setNewList({ ...newList, name: e.target.value })}
          />
        </motion.div>
        <span className={`${!searchActive ? 'initial' : 'hidden'} absolute right-0 mr-3 ${validTitle ? 'text-gray-300' : 'text-red-400'} transition-colors`}>
          {newList.name.length}/{LIST_NAME_LIMIT}
        </span>
      </motion.div>
    </div>
  )
}

export default SearchOrAddList;
