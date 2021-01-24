import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LIST_NAME_LIMIT } from '@web-utils/config';

import AddListCard from './AddListCard';
import { Search, Add } from './Icons';

// FM Variants
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

const SearchOrAddList = ({ query, setQuery, limitReached, _handleAddList }) => {
  const [searchActive, setSearchActive] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [addFocused, setAddFocused] = useState(false);
  const [newListName, setNewListName] = useState('');
  // const [newList, setNewList] = useState({ name: '', description: '', mode_private: true });
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

  // Handler for adding a new list (2/3)
  const handleAddList = (list) => {
    setNewListName('');
    _handleAddList(list);
  }

  const validName = newListName.length > 0 && newListName.length <= LIST_NAME_LIMIT;

  return (
    <React.Fragment>
      <div className="flex-initial flex items-center px-8">
        <motion.div
          className={`flex items-center mx-1 border ${searchFocused ? 'border-blue-400' : 'border-gray-300'} rounded-full transition-colors`}
          variants={barVariants}
          animate={searchActive ? 'active' : 'inactive'}
          initial={false}
        >
          <button className="p-2.5" onClick={handleClickSearch}>
            <Search size={20}/>
          </button>
          <motion.div
            variants={inputWrapperVariants}
            animate={searchActive ? 'active' : 'inactive'}
            initial={false}
          >
            <motion.input
              ref={searchInputRef}
              value={query}
              placeholder="Search for a list..."
              variants={inputVariants}
              animate={searchActive ? 'active' : 'inactive'}
              initial={false}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </motion.div>
        </motion.div>
        <motion.div
          className={`relative flex items-center mx-1 border ${addFocused ? 'border-blue-400' : 'border-gray-300'} rounded-full transition-colors`}
          variants={barVariants}
          animate={!searchActive ? 'active' : 'inactive'}
          initial={false}
        >
          <button className="p-2" onClick={handleClickAdd}>
            <Add size={24}/>
          </button>
          <motion.div
            variants={inputWrapperVariants}
            animate={!searchActive ? 'active' : 'inactive'}
            initial={false}
          >
            <motion.input
              variants={inputVariants}
              animate={!searchActive ? 'active' : 'inactive'}
              initial={false}
              ref={addInputRef}
              value={newListName}
              placeholder="What's the name of the new list?"
              onChange={e => setNewListName(e.target.value)}
              onFocus={() => setAddFocused(true)}
              onBlur={() => setAddFocused(false)}
            />
          </motion.div>
          <span className={`${!searchActive ? 'initial' : 'hidden'} absolute right-0 mr-3 ${validName ? 'text-gray-300' : 'text-red-400'} transition-colors`}>
            {newListName.length}/{LIST_NAME_LIMIT}
          </span>
        </motion.div>
      </div>
      <AnimatePresence>
        {!searchActive && (
          <AddListCard
            name={newListName}
            validName={validName}
            limitReached={limitReached}
            _handleAddList={handleAddList}
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  )
}

export default SearchOrAddList;
