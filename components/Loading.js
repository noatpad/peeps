import React from 'react';
import HashLoader from 'react-spinners/HashLoader';

const Loading = ({ size, color = '4586d9' }) => (
  <div className="transform -rotate-12">
    <HashLoader size={size} color={color} css="display: inline-block"/>
  </div>
)

export default Loading;
