import React from 'react';
import Image from 'next/image';

const UserItem = ({ user, add, del, unprepareToAddUser, prepareToDelUser, unprepareToDelUser }) => {
  const { id_str, name, screen_name, profile_image_url_https } = user;

  // Pick the appropriate action upon clicking an item
  const handleClick = () => {
    if (add) {
      unprepareToAddUser(id_str);
    } else if (del) {
      unprepareToDelUser(id_str);
    } else {
      prepareToDelUser(user);
    }
  }

  const pfp = profile_image_url_https.replace(/_normal.jpg/, '_bigger.jpg');
  let itemClass = "flex items-center p-3 my-6 rounded-md shadow cursor-pointer";
  if (add) {
    itemClass += " bg-green-100";
  } else if (del) {
    itemClass += " bg-red-100";
  }

  return (
    <div className={itemClass} onClick={handleClick}>
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
