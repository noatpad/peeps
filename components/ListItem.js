import React from 'react';

import { Next, Lock, Remove } from './Icons';
import ItemButton from './ItemButton';

const ListItem = ({ item, active, add, del, selectList, handleDeleteModal }) => {
  // TODO: Add better indicator when selected
  // TODO: Edit list info
  const { id_str, name, member_count, mode } = item;

  return (
    <div className={`flex relative p-3 my-6 rounded-md shadow cursor-pointer ${active ? 'ring' : ''}`} onClick={() => selectList(id_str)}>
      <div className="absolute top-0 left-0 bottom-0 ml-3 flex items-center z-10">
        <ItemButton
          onClick={(e) => handleDeleteModal(item, e)}
          icon={<Remove size={16}/>}
          text="Remove list"
        />
      </div>
      <div className="flex-1 ml-8">
        <div className="flex items-center">
          {mode === 'private' && <div className="mr-1"><Lock size={16}/></div>}
          <p className="text-lg">{name}</p>
        </div>
        <p className="text-sm text-gray-500 -mt-1">{member_count} member{member_count !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex-initial flex flex-col items-end justify-center">
        {add > 0 && (
          <span className="text-sm text-green-600">
            +{add}
          </span>
        )}
        {del > 0 && (
          <span className="text-sm text-red-600">
            -{del}
          </span>
        )}
      </div>
      <div className="flex-initial flex items-center">
        <Next size={20}/>
      </div>
    </div>
  )
}

export default ListItem;
