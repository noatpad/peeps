import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { addList, deleteList } from '../utils/api';
import { sortLists } from '../utils/helpers';
import { LIST_NAME_LIMIT, LIST_DESCRIPTION_LIMIT } from '../utils/config';

import AddListCard from './AddListCard';
import ListItem from './ListItem';
import SearchOrAddList from './SearchOrAddList';
import Button from './Button';

const ListSelector = ({ fuseListRef, lists, setLists, activeList, setActiveList }) => {
  const [searchActive, setSearchActive] = useState(true);
  const [query, setQuery] = useState('');
  const [newList, setNewList] = useState({ name: '', description: '', private: true });
  const [validList, setValidList] = useState(false);
  const [listToRemove, setListToRemove] = useState({});
  const [showListDeleteModal, setShowListDeleteModal] = useState(false);

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
        fuseListRef.current.add(data);
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
        fuseListRef.current.remove(list => (list.id_str === listToRemove.id_str))
      })
      .catch(err => console.error(err))
  }

  // Fuzzy search list
  const searchResults = query ? fuseListRef.current.search(query.toLowerCase()) : lists.map(l => ({ item: l }));

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
        {searchResults.map(({ item }) => (
          <ListItem
            key={item.id_str}
            item={item}
            activeList={item.id_str === activeList}
            setActiveList={setActiveList}
            handleDeleteModal={handleDeleteModal}
          />
        ))}
      </div>
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
