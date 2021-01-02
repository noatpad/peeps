import React from 'react';
import ListItem from './ListItem';

const ListSelector = ({ lists, activeList, setActiveList }) => {
  return (
    <div className="flex flex-col h-full mt-6">
      <div className="flex-initial px-8">
        <p className="px-4 py-2 border border-gray-300 rounded-full">Search and add buttons...</p>
      </div>
      <div className="flex-1 px-12 overflow-scroll">
        {lists.map(l => (
          <ListItem
            key={l.id_str}
            item={l}
            activeList={l.id_str === activeList}
            setActiveList={setActiveList}
          />
        ))}
      </div>
    </div>
  )
}

export default ListSelector;
