import React from 'react';
import { numberNoun } from '@web-utils/helpers';

import ItemButton from '@components/ItemButton';
import { Remove, Edit, Lock, Next } from '@components/Icons';

const NormalView = ({ item, active, addCount, delCount, enterEditMode, selectList, _handleDeleteModal }) => {
  const { id_str, name, member_count, mode } = item;

  // Handler for clicking the edit button
  const handleEditClick = (e) => {
    e.stopPropagation();
    // setEditMode(true);
    enterEditMode();
  }

  // Handler for clicking the delete button (2/2)
  const handleDeleteModal = (e) => {
    e.stopPropagation();
    _handleDeleteModal(item);
  }

  return (
    <div className={`flex relative p-3 my-6 bg-gradient-to-r from-transparent ${active ? 'ring-2 bg-blue-50' : 'hover:to-blue-50'} rounded-md shadow cursor-pointer transition-all`} onClick={() => selectList(id_str)}>
      <div className="absolute top-0 left-0 bottom-0 ml-3 flex flex-col justify-center z-10">
        <ItemButton
          onClick={handleEditClick}
          icon={<Edit size={16}/>}
          color="text-gray-600"
          text="Edit list info"
        />
        <ItemButton
          onClick={handleDeleteModal}
          icon={<Remove size={16}/>}
          color="text-red-400"
          text="Remove list"
        />
      </div>
      <div className="flex-1 ml-8">
        <div className="flex items-center">
          {mode === 'private' && <div className="mr-1"><Lock size={16}/></div>}
          <p className="text-lg">{name}</p>
        </div>
        <p className="text-sm text-gray-500 -mt-1">{numberNoun(member_count, "member")}</p>
      </div>
      <div className="flex-initial flex flex-col items-end justify-center">
        {addCount > 0 && (
          <span className="text-sm text-green-600">
            +{addCount}
          </span>
        )}
        {delCount > 0 && (
          <span className="text-sm text-red-600">
            -{delCount}
          </span>
        )}
      </div>
      <button className="flex-initial flex items-center">
        <Next size={20}/>
      </button>
    </div>
  )
}

export default NormalView;
