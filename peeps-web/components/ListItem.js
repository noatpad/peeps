import React from 'react';

const ListItem = ({ item, activeList, setActiveList, handleDeleteModal }) => {
  // IDEA: Show icon for public and private lists
  const { id_str, name, member_count } = item;

  const handleClick = () => { setActiveList(id_str) }

  return (
    <div className={`flex p-3 my-6 rounded-md shadow cursor-pointer ${activeList ? 'ring' : ''}`} onClick={handleClick}>
      <div className="flex-initial flex items-center mr-2">
        <button className="p-1 rounded hover:bg-red-200" onClick={(e) => handleDeleteModal(item, e)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={16} width={16}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <p className="text-lg -mb-1">{name}</p>
        <p className="text-sm text-gray-500">{member_count} member{member_count !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex-initial flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={20} width={20}>
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}

export default ListItem;
