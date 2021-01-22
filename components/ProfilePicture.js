import React from 'react';
import Image from 'next/image';

const biggerPic = (url) => url.replace(/_normal.jpg/, '_bigger.jpg');

const ProfilePicture = ({ user: { name, screen_name, profile_image_url_https: image_url }, size, bigger }) => (
  <a className="inline-flex justify-center" href={`https://twitter.com/${screen_name}`} target="_blank" rel="noopener noreferrer">
    <Image
      className="rounded-full"
      src={bigger ? biggerPic(image_url) : image_url}
      alt={`${name}'s profile picture`}
      height={size}
      width={size}
    />
  </a>
)

export default ProfilePicture;
