import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { addList, deleteList } from '../utils/api';
import { sortLists } from '../utils/helpers';
import { LIST_NAME_LIMIT, LIST_DESCRIPTION_LIMIT } from '../utils/config';
import AddListCard from './AddListCard';
import ListItem from './ListItem';
import SearchOrAddList from './SearchOrAddList';
import Button from './Button';

const ListSelector = ({ lists, setLists, activeList, setActiveList }) => {
  const [searchActive, setSearchActive] = useState(true);
  const [newList, setNewList] = useState({ name: '', description: '', private: true });
  const [validList, setValidList] = useState(false);
  const [listToRemove, setListToRemove] = useState({});
  const [showListDeleteModal, setShowListDeleteModal] = useState(false);

  useEffect(() => {
    const { name, description } = newList;
    const validTitle = name.length > 0 && name.length <= LIST_NAME_LIMIT;
    const validDescription = description.length <= LIST_DESCRIPTION_LIMIT;
    setValidList(validTitle && validDescription);
  }, [newList]);

  const handleAddList = () => {
    if (!validList) { return }
    addList(newList)
      .then(data => { setLists(lists.concat(data).sort(sortLists)) })
      .catch(err => console.error(err))
  }

  const handleDeleteModal = (list, e) => {
    e.stopPropagation();
    setListToRemove(list);
    setShowListDeleteModal(true);
  }

  const handleDeleteList = () => {
    deleteList(listToRemove)
      .then(_ => {
        console.log(`Deleted list ${listToRemove.name}`);
        setLists(lists.filter(i => i.id_str !== listToRemove.id_str));
        setListToRemove({});
        setShowListDeleteModal(false);
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="relative flex flex-col h-full pt-6" id="lists">
      <SearchOrAddList
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
        {lists.map(l => (
          <ListItem
            key={l.id_str}
            item={l}
            activeList={l.id_str === activeList}
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
