import React, { useState, useEffect } from 'react';
import { deleteList } from '@web-utils/api';
import { LIST_COUNT_LIMIT, LISTS_PER_PAGE } from '@web-utils/config';
import { listSortCompare } from '@web-utils/helpers';

import DeleteListModal from './Modal/DeleteListModal';
import ListResults from './ListResults';
import Loading from './Loading';
import PaginationBar from './PaginationBar';
import SearchOrAddList from './SearchOrAddList';

const ListSelector = ({
  fuse,
  loading,
  lists,
  setLists,
  activeListID,
  add,
  del,
  selectList,
  handleRemoveDeletedChanges,
  errorHandler
}) => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [listToRemove, setListToRemove] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fuzzy search list and pagination
  const searchResults = query ? fuse.search(query.toLowerCase()) : lists.map(l => ({ item: l }));
  const offset = (page - 1) * LISTS_PER_PAGE;
  const pageResults = searchResults.slice(offset, offset + LISTS_PER_PAGE);

  // Go back to the start page when searching
  useEffect(() => {
    if (page !== 1) { setPage(1) }
  }, [query]);

  // Go back a page if you delete a list and are stuck in an empty page
  useEffect(() => {
    if (page > 1 && page * LISTS_PER_PAGE > searchResults.length) {
      setPage(page - 1);
    }
  }, [lists]);

  // Handler for adding a new list (1/3)
  const handleAddList = (list) => {
    setLists(lists.concat(list).sort(listSortCompare));
  }

  // Handler for updating a single list in the state data (1/2)
  const handleUpdateList = (updatedList) => {
    const newLists = [...lists]
    const index = newLists.findIndex(l => l.id_str === updatedList.id_str);
    newLists[index] = updatedList;
    setLists(newLists);
  }

  // Handler for opening the "delete list" modal (1/2)
  const handleDeleteModal = (list) => {
    setListToRemove(list);
    setShowDeleteModal(true);
  }

  // Handler for deleting a list
  const handleDeleteList = () => (
    deleteList(listToRemove.id_str)
      .then(_ => {
        if (listToRemove.id_str === activeListID) {
          selectList(-1);
        }
        setLists(lists.filter(list => list.id_str !== listToRemove.id_str));
        handleRemoveDeletedChanges(listToRemove.id_str);
        setListToRemove({});
      })
      .catch(err => errorHandler(err))
      .finally(() => setShowDeleteModal(false))
  )

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-400 italic">
        <Loading size={50}/>
        <p>Loading your lists...</p>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col h-full pt-6" id="lists">
      <SearchOrAddList
        query={query}
        setQuery={setQuery}
        limitReached={lists.length >= LIST_COUNT_LIMIT}
        _handleAddList={handleAddList}
        errorHandler={errorHandler}
      />
      <div className="flex-1 px-4 sm:px-8 md:px-12 mt-4 overflow-scroll scrollGradient">
        <ListResults
          results={pageResults}
          add={add}
          del={del}
          activeListID={activeListID}
          noLists={!lists.length}
          noHits={!searchResults.length}
          selectList={selectList}
          _handleUpdateList={handleUpdateList}
          _handleDeleteModal={handleDeleteModal}
          errorHandler={errorHandler}
        />
      </div>
      <PaginationBar
        itemCount={searchResults.length}
        limit={LISTS_PER_PAGE}
        page={page}
        setPage={setPage}
      />
      <DeleteListModal
        show={showDeleteModal}
        close={() => setShowDeleteModal(false)}
        listName={listToRemove.name}
        _handleDeleteList={handleDeleteList}
      />
    </div>
  )
}

export default ListSelector;
