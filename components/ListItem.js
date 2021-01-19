import React from 'react';
import { Next, Lock } from './Icons';

const ListItem = ({ item, active, add, del, selectList, handleDeleteModal }) => {
  // TODO: Show better feedback about delete button (hover tooltip?)
  // TODO: Edit list info
  const { id_str, name, member_count, mode } = item;

  return (
    <div className={`flex p-3 my-6 rounded-md shadow cursor-pointer ${active} ? 'ring' : ''}`} onClick={() => selectList(id_str)}>
      <div className="flex-initial flex items-center mr-2">
        <button className="p-1 rounded hover:bg-red-200" onClick={(e) => handleDeleteModal(item, e)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={16} width={16}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex-1">
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
