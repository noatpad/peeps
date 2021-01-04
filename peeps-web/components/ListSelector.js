import React, { useState, useEffect } from 'react';
import AddListCard from './AddListCard';
import ListItem from './ListItem';
import SearchOrAddList from './SearchOrAddList';
import { LIST_NAME_LIMIT, LIST_DESCRIPTION_LIMIT } from '../utils/config';
import { addList } from '../utils/api';

const ListSelector = ({ lists, setLists, activeList, setActiveList }) => {
  const [searchActive, setSearchActive] = useState(true);
  const [newList, setNewList] = useState({ name: '', description: '', private: true });
  const [validList, setValidList] = useState(false);

  useEffect(() => {
    const { name, description } = newList;
    const validTitle = name.length > 0 && name.length <= LIST_NAME_LIMIT;
    const validDescription = description.length <= LIST_DESCRIPTION_LIMIT;
    setValidList(validTitle && validDescription);
  }, [newList]);

  const handleAddList = () => {
    if (!validList) { return }
    addList(newList)
      .then(data => {
        console.log(data);
        setLists(lists.push(data));
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="flex flex-col h-full mt-6">
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
          />
        ))}
      </div>
    </div>
  )
}

export default ListSelector;
