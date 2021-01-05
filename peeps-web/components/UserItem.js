import React from 'react';
import Image from 'next/image';

const UserItem = ({ user: { name, screen_name, profile_image_url_https }}) => {
  const pfp = profile_image_url_https.replace(/_normal.jpg/, '_bigger.jpg');

  const handleClick = () => { console.log("Click") }

  return (
    <div className="flex items-center p-3 my-6 rounded-md shadow cursor-pointer" onClick={handleClick}>
      <div className="flex-initial flex items-center mr-3">
        <Image
          className="rounded-full"
          src={pfp}
          alt={`${name}'s profile picture`}
          height={48}
          width={48}
        />
      </div>
      <div className="flex-1">
        <p className="text-lg -mb-1">{name}</p>
        <p className="text-sm text-gray-500">@{screen_name}</p>
      </div>
    </div>
  )
}

export default UserItem;
