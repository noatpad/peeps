import React from 'react';
import UserItem from './UserItem';

const UserSelector = ({ users }) => {
  return (
    <div className="flex flex-col h-full mt-6">
      <div className="flex-initial px-8">
        <p className="px-4 py-2 border border-gray-300 rounded-full">Search and add buttons...</p>
      </div>
      <div className="flex-1 px-12 overflow-scroll">
        {users.map(u => (
          <UserItem
            key={u.id_str}
            user={u}
          />
        ))}
      </div>
    </div>
  )
}

export default UserSelector;
