import React from 'react';
import Image from 'next/image';

const ImageAndCaption = ({ imageURL, alt, height, width }) => (
  <div className="p-4 mx-1 md:mx-12 lg:mx-20 xl:mx-28 my-4 shadow">
    <Image src={imageURL} alt={alt} height={height} width={width}/>
    <p className="-mt-1 text-sm text-gray-600">{alt}</p>
  </div>
);

export default ImageAndCaption;
