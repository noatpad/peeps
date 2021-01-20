import React from 'react';

import ItemButton from '@components/ItemButton';
import { Remove, Edit, Lock, Next } from '@components/Icons';

const NormalView = ({ item, add, del, setEditMode, handleDeleteModal }) => {
  const { name, member_count, mode } = item;

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditMode(true);
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleDeleteModal(item);
  }

  return (
    <React.Fragment>
      <div className="absolute top-0 left-0 bottom-0 ml-3 flex flex-col justify-center z-10">
        <ItemButton
          onClick={handleEditClick}
          icon={<Edit size={16}/>}
          text="Edit list info"
        />
        <ItemButton
          onClick={handleDeleteClick}
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
    </React.Fragment>
  )
}

export default NormalView;
