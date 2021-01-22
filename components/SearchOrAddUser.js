import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash/debounce';
import { search } from '@web-utils/api';

import { Search, Add } from './Icons';
import Loading from './Loading';

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

// Component for suggestion rendering
const renderSuggestion = ({ name, screen_name, profile_image_url_https }) => (
  <div className="flex items-center p-2 mx-2">
    <div className="flex-initial flex items-center mr-3">
      <Image
        className="rounded-full"
        src={profile_image_url_https}
        alt={`${name}'s profile picture`}
        height={36}
        width={36}
      />
    </div>
    <div className="flex-1">
      <p className="text-md -mb-1.5">{name}</p>
      <p className="text-sm text-gray-500">@{screen_name}</p>
    </div>
  </div>
)

const SearchOrAddUser = ({ query, setQuery, searchActive, setSearchActive, prepareToAddUser }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [addFocused, setAddFocused] = useState(false);
  const [addQuery, setAddQuery] = useState('');
  const [addResults, setAddResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
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

  // Handler for getting user suggestions
  const debounceFetchSuggestions = useCallback(
    debounce((value) => {
      setLoadingSearch(true);
      search(value)
        .then(data => {
          setAddResults(data);
          setLoadingSearch(false);
        })
    }, 400)
  , []);

  // Handler for selecting a suggestion
  const handleSelected = (e, { suggestion }) => {
    prepareToAddUser(suggestion);
    setAddQuery('');
  }

  return (
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
            placeholder="Search for a user in your list..."
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
          <Autosuggest
            suggestions={addResults}
            inputProps={{
              value: addQuery,
              ref: addInputRef,
              placeholder: 'Who do you wanna add?',
              variants: inputVariants,
              animate: !searchActive ? 'active' : 'inactive',
              initial: false,
              onChange: (e, { newValue }) => setAddQuery(newValue),
              onFocus: () => setAddFocused(true),
              onBlur: () => setAddFocused(false)
            }}
            onSuggestionsFetchRequested={({ value }) => debounceFetchSuggestions(value)}
            onSuggestionsClearRequested={() => setAddResults([])}
            onSuggestionSelected={handleSelected}
            getSuggestionValue={() => addQuery}
            shouldRenderSuggestions={(val) => val.trim().length >= 2}
            renderInputComponent={(props) => (
              <div className={`relative w-full ${searchActive ? '' : 'pr-8'}`}>
                <motion.input {...props}/>
                {loadingSearch && (
                  <div className="absolute top-0 right-0 bottom-0">
                    <Loading size={24}/>
                  </div>
                )}
              </div>
            )}
            renderSuggestion={renderSuggestion}
            theme={{
              container: "relative flex flex-1",
              input: searchActive ? "w-0" : "flex-1 mr-3",
              suggestionsContainer: "absolute top-full left-0 right-0 mt-2 mr-4 rounded-b-lg bg-white shadow-md z-20",
              suggestionsList: "divide-y divide-gray-300",
              suggestionHighlighted: "bg-green-100"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SearchOrAddUser;
