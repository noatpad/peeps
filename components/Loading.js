import React from 'react';
import HashLoader from 'react-spinners/HashLoader';

const Loading = () => (
  <div className="inline-block transform -rotate-12">
    <HashLoader size={100} color="4586d9"/>
  </div>
)

export default Loading;
