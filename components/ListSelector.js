import React, { useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import { AnimatePresence } from 'framer-motion';
import { addList, deleteList } from '@web-utils/api';
import { sortLists } from '@web-utils/helpers';
import { LIST_COUNT_LIMIT, LIST_NAME_LIMIT, LIST_DESCRIPTION_LIMIT, RESULTS_PER_PAGE } from '@web-utils/config';

import SearchOrAddList from './SearchOrAddList';
import AddListCard from './AddListCard';
import ListItem from './ListItem';
import { Prev, Next } from './Icons';
import DeleteListModal from './DeleteListModal';

const ListSelector = ({ fuseRef, lists, setLists, activeListID, add, del, selectList }) => {
  const [searchActive, setSearchActive] = useState(true);
  const [query, setQuery] = useState('');
  const [newList, setNewList] = useState({ name: '', description: '', mode_private: true });
  const [validList, setValidList] = useState(false);
  const [listToRemove, setListToRemove] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(1);

  // Fuzzy search list and pagination
  const searchResults = query ? fuseRef.current.search(query.toLowerCase()) : lists.map(l => ({ item: l }));
  const offset = (page - 1) * RESULTS_PER_PAGE;
  const pageResults = searchResults.slice(offset, offset + RESULTS_PER_PAGE);

  // Go back to the start page when searching
  useEffect(() => {
    if (page === 1) { return }
    setPage(1);
  }, [query]);

  // Go back a page if you delete a list and are stuck in an empty page
  useEffect(() => {
    if (page > 1 && page * RESULTS_PER_PAGE > searchResults.length) {
      setPage(page - 1);
    }
  }, [lists]);

  // When readying a new list, check if the data is valid
  useEffect(() => {
    const { name, description } = newList;
    const validTitle = name.length > 0 && name.length <= LIST_NAME_LIMIT;
    const validDescription = description.length <= LIST_DESCRIPTION_LIMIT;
    const underLimit = lists.length < LIST_COUNT_LIMIT;
    setValidList(validTitle && validDescription && underLimit);
  }, [newList]);

  // Handler for adding a new list
  const handleAddList = () => {
    if (!validList) { return }
    addList(newList)
      .then(data => {
        setLists(sortLists(lists.concat(data)));
        setNewList({ ...newList, name: '', description: '' });
      })
      .catch(err => console.error(err))
  }

  // Handler for opening the "delete list" modal
  const handleDeleteModal = (list, e) => {
    e.stopPropagation();
    setListToRemove(list);
    setShowDeleteModal(true);
  }

  // Handler for deleting a list
  const handleDeleteList = () => {
    deleteList(listToRemove.id_str)
      .then(_ => {
        setLists(lists.filter(list => list.id_str !== listToRemove.id_str));
        setListToRemove({});
        setShowDeleteModal(false);
      })
      .catch(err => console.error(err))
  }

  // Count all user additions for a given list
  const countAdditions = (listID) => {
    const changes = add.find(a => a.id === listID);
    return changes !== undefined ? changes.users.length : 0;
  }

  // Count all user deletions for a given list
  const countDeletions = (listID) => {
    const changes = del.find(d => d.id === listID);
    return changes !== undefined ? changes.users.length : 0;
  }

  // Sub-component for results
  const results = () => {
    if (!lists.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
          <h4 className="text-2xl">You have no lists!</h4>
          <p>Why not make one?</p>
        </div>
      )
    }

    if (!searchResults.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
          <h4 className="text-2xl">Couldn&apos;t find any lists!</h4>
          <p>Maybe a typo?</p>
        </div>
      )
    }
    return (
      pageResults.map(({ item }) => (
        <ListItem
          key={item.id_str}
          item={item}
          active={activeListID === item.id_str}
          add={countAdditions(item.id_str)}
          del={countDeletions(item.id_str)}
          selectList={selectList}
          handleDeleteModal={handleDeleteModal}
        />
      ))
    )
  }

  return (
    <div className="relative flex flex-col h-full pt-6" id="lists">
      <SearchOrAddList
        query={query}
        setQuery={setQuery}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        newList={newList}
        setNewList={setNewList}
      />
      <AnimatePresence>
        {!searchActive && (
          <AddListCard
            newList={newList}
            setNewList={setNewList}
            validList={validList}
            handleAddList={handleAddList}
            tooManyLists={lists.length >= LIST_COUNT_LIMIT}
          />
        )}
      </AnimatePresence>
      <div className="flex-1 px-12 my-4 overflow-scroll scrollGradient">
        {results()}
      </div>
      {searchResults.length > RESULTS_PER_PAGE && (
        <div className="flex-initial flex justify-center items-center mb-4">
          <Pagination
            totalItemsCount={searchResults.length}
            itemsCountPerPage={RESULTS_PER_PAGE}
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
      <DeleteListModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        listName={listToRemove.name}
        handleDeleteList={handleDeleteList}
      />
    </div>
  )
}

export default ListSelector;
