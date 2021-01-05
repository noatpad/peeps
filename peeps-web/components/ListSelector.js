import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Pagination from 'react-js-pagination';
import { addList, deleteList } from '../utils/api';
import { sortLists } from '../utils/helpers';
import { LIST_NAME_LIMIT, LIST_DESCRIPTION_LIMIT } from '../utils/config';

import AddListCard from './AddListCard';
import ListItem from './ListItem';
import SearchOrAddList from './SearchOrAddList';
import Button from './Button';

const RESULTS_PER_PAGE = 10;

const Prev = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={20} width={20}>
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const Next = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={20} width={20}>
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
)

const ListSelector = ({ fuseListRef, lists, setLists, activeList, setActiveList }) => {
  // IDEA: Scroll to new list upon creation
  // TODO: Add message when no lists are found
  const [searchActive, setSearchActive] = useState(true);
  const [query, setQuery] = useState('');
  const [newList, setNewList] = useState({ name: '', description: '', private: true });
  const [validList, setValidList] = useState(false);
  const [listToRemove, setListToRemove] = useState({});
  const [showListDeleteModal, setShowListDeleteModal] = useState(false);
  const [page, setPage] = useState(1);

  // Fuzzy search list and pagination
  const searchResults = query ? fuseListRef.current.search(query.toLowerCase()) : lists.map(l => ({ item: l }));
  console.log(searchResults);
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
    setValidList(validTitle && validDescription);
  }, [newList]);

  // Handler for adding a new list
  const handleAddList = () => {
    if (!validList) { return }
    addList(newList)
      .then(data => {
        setLists(lists.concat(data).sort(sortLists));
        setNewList({ ...newList, name: '', description: '' });
      })
      .catch(err => console.error(err))
  }

  // Handler for opening the "delete list" modal
  const handleDeleteModal = (list, e) => {
    e.stopPropagation();
    setListToRemove(list);
    setShowListDeleteModal(true);
  }

  // Handler for deleting a list
  const handleDeleteList = () => {
    deleteList(listToRemove)
      .then(_ => {
        setLists(lists.filter(list => list.id_str !== listToRemove.id_str));
        setListToRemove({});
        setShowListDeleteModal(false);
      })
      .catch(err => console.error(err))
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
      {!searchActive && (
        <AddListCard
          newList={newList}
          setNewList={setNewList}
          validList={validList}
          handleAddList={handleAddList}
        />
      )}
      <div className="flex-1 px-12 overflow-scroll">
        {pageResults.map(({ item }) => (
          <ListItem
            key={item.id_str}
            item={item}
            activeList={item.id_str === activeList}
            setActiveList={setActiveList}
            handleDeleteModal={handleDeleteModal}
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
      {/* Delete list Modal */}
      <Modal
        isOpen={showListDeleteModal}
        parentSelector={() => document.querySelector('#lists')}
        overlayClassName="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-black bg-opacity-70"
        className="px-8 py-6 rounded-xl bg-white"
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setShowListDeleteModal(false)}
      >
        <p className="text-center">You sure you wanna delete the list <b>{listToRemove.name}</b>?</p>
        <div className="flex justify-center items-center">
          <Button text="No, don't" run={() => setShowListDeleteModal(false)} small/>
          <Button text="Yes, delete" run={handleDeleteList} warning small/>
        </div>
      </Modal>
    </div>
  )
}

export default ListSelector;
