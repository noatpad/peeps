import React from 'react';

import ListItem from './ListItem';

const ListResults = ({
  results,
  add,
  del,
  activeListID,
  noLists,
  noHits,
  selectList,
  _handleUpdateList,
  _handleDeleteModal
}) => {
  // When user has no lists
  if (noLists) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
        <h4 className="text-2xl">You have no lists!</h4>
        <p>Why not make one?</p>
      </div>
    )
  }

  // When no list could be found through a search query
  if (noHits) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
        <h4 className="text-2xl">Couldn&apos;t find any lists!</h4>
        <p>Maybe a typo?</p>
      </div>
    )
  }

  // Display all of the user's lists
  return results.map(({ item }) => (
    <ListItem
      key={item.id_str}
      item={item}
      active={activeListID === item.id_str}
      addCount={add.find(a => a.id === item.id_str)?.users.length ?? 0}
      delCount={del.find(d => d.id === item.id_str)?.users.length ?? 0}
      selectList={selectList}
      _handleUpdateList={_handleUpdateList}
      _handleDeleteModal={_handleDeleteModal}
    />
  ))
}

export default ListResults;
