import React, { useState } from 'react';
import { updateList } from '@web-utils/api';

import NormalView from './NormalView';
import EditView from './EditView';

const ListItem = ({ item, active, add, del, selectList, updateSingleList, handleDeleteModal }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatePending, setUpdatePending] = useState(false);

  const handleClick = () => {
    if (editMode) { return }
    selectList(item.id_str);
  }

  const handleUpdate = (id, name, description, mode) => {
    const list = { id, name, description, mode };
    setUpdatePending(true);
    updateList(list)
      .then(list => {
        setUpdatePending(false);
        setEditMode(false);
        updateSingleList(list);
      })
      .catch(err => console.error(err));
  }

  return (
    <div className={`flex relative p-3 my-6 rounded-md shadow ${!editMode ? 'bg-gradient-to-r from-transparent cursor-pointer' : ''} ${active ? 'ring-2 bg-blue-50' : 'hover:to-blue-50'} transition-all`} onClick={handleClick}>
      {editMode ? (
        <EditView item={item} updatePending={updatePending} setEditMode={setEditMode} handleUpdate={handleUpdate}/>
      ) : (
        <NormalView item={item} add={add} del={del} setEditMode={setEditMode} handleDeleteModal={handleDeleteModal}/>
      )}
    </div>
  )
}

export default ListItem;
