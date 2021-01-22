import React from 'react';
import Image from 'next/image';

import ItemButton from './ItemButton';
import { Add2, Remove, Ellipsis } from './Icons';

const UserItem = ({ onClick, user, add, del, limitReached }) => {
  const { name, screen_name, profile_image_url_https } = user;

  const pfp = profile_image_url_https.replace(/_normal.jpg/, '_bigger.jpg');

  let itemClass = "flex relative items-center p-3 my-6 rounded-md shadow bg-gradient-to-r from-transparent transition-all";
  if (add) {
    itemClass += " bg-green-100 hover:to-green-200";
  } else if (del) {
    itemClass += " bg-red-200 hover:to-red-300";
  } else {
    itemClass += " hover:to-red-50"
  }

  const button = () => {
    let icon, bg, color, hoverColor, text, disabled = false;

    if (add) {
      icon = <Add2 size={16}/>;
      bg = "bg-green-400";
      color = "text-green-500";
      hoverColor = "text-white";
      text = "Cancel addition";
    } else if (del) {
      icon = <Remove size={16}/>;
      bg = "bg-red-400";
      color = "text-red-500";
      hoverColor = "text-white";
      text = "Cancel removal";
      disabled = limitReached;
    } else {
      icon = <Ellipsis size={16}/>;
      bg = "bg-white";
      color = false;
      hoverColor = "text-red-400";
      text = "Remove member";
    }

    return (
      <ItemButton
        onClick={onClick}
        icon={icon}
        width={125}
        bg={bg}
        color={color}
        hoverColor={hoverColor}
        text={text}
        disabled={disabled}
        reverse
      />
    )
  }

  return (
    <div className={itemClass}>
      <div className="flex-initial flex items-center mr-3">
        <Image
          className="rounded-full"
          src={pfp}
          alt={`${name}'s profile picture`}
          height={48}
          width={48}
        />
      </div>
      <div className="flex-1 mr-8">
        <p className="text-lg -mb-1">{name}</p>
        <p className="text-sm text-gray-500">@{screen_name}</p>
      </div>
      <div className="absolute top-0 right-0 bottom-0 mr-3 flex flex-col justify-center z-10">
        {button()}
      </div>
    </div>
  )
}

export default UserItem;
