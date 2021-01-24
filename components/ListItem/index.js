import React, { useState } from 'react';

import NormalView from './NormalView';
import EditView from './EditView';

const ListItem = ({ item, active, addCount, delCount, selectList, _handleUpdateList, _handleDeleteModal }) => {
  const [editMode, setEditMode] = useState(false);

  return editMode ? (
    <EditView
      item={item}
      active={active}
      exitEditMode={() => setEditMode(false)}
      _handleUpdateList={_handleUpdateList}
    />
  ) : (
    <NormalView
      item={item}
      active={active}
      addCount={addCount}
      delCount={delCount}
      enterEditMode={() => setEditMode(true)}
      selectList={selectList}
      _handleDeleteModal={_handleDeleteModal}
    />
  )
}

export default ListItem;
