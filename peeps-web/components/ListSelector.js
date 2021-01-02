import React from 'react';
import ListItem from './ListItem';

const ListSelector = ({ lists }) => {
  return (
    <div className="flex flex-col h-full mt-6">
      <div className="flex-initial px-8">
        Search and add buttons...
      </div>
      <div className="flex-1 px-12 overflow-scroll">
        {lists.map(l => (
          <ListItem key={l.id_str} item={l}/>
        ))}
      </div>
    </div>
  )
}

export default ListSelector;
