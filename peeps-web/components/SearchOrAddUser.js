import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash/debounce';
import { search } from '../utils/api';

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

const SearchOrAddUser = ({ query, setQuery, searchActive, setSearchActive }) => {
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
          console.log(data);
          setAddResults(data);
          setLoadingSearch(false);
        })
    }, 400)
  , []);

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
          placeholder="Search for a user in your list"
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className={`${!searchActive ? 'flex-1' : 'flex-initial'} relative flex items-center mx-1 border border-gray-300 rounded-full`}>
        <button className="p-2" onClick={handleClickAdd}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" height={24} width={24}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <Autosuggest
          suggestions={addResults}
          inputProps={{ value: addQuery, ref: addInputRef, placeholder: 'Who do you wanna add?', onChange: (e, { newValue }) => setAddQuery(newValue) }}
          onSuggestionsFetchRequested={({ value }) => debounceFetchSuggestions(value)}
          onSuggestionsClearRequested={() => setAddResults([])}
          getSuggestionValue={(item) => item.name}
          shouldRenderSuggestions={(val) => val.trim().length >= 2}
          renderSuggestion={renderSuggestion}
          theme={{
            container: "relative flex flex-1",
            input: searchActive ? "w-0 ml-0 mr-0" : "flex-1 ml-1 mr-3",
            suggestionsContainer: "absolute top-full left-0 right-0 mt-2 mr-4 rounded-b-lg bg-white shadow",
            suggestionsList: "divide-y divide-gray-300",
            suggestionHighlighted: "bg-blue-100"
          }}
        />
      </div>
    </div>
  )
}

export default SearchOrAddUser;
