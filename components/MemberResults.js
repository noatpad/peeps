import React from 'react';

import MemberItem from './MemberItem';

const MemberResults = ({ results, noMembers, noHits, limitReached, handleMemberAction }) => {
  // When the list has no members or soon-to-be-added members
  if (noMembers) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
        <h4 className="text-2xl">There are no members in this list!</h4>
        <p>Why not add one to it?</p>
      </div>
    )
  }

  // When no member could be found through a search query
  if (noHits) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
        <h4 className="text-2xl">Couldn&apos;t find any members!</h4>
        <p>Maybe a typo?</p>
      </div>
    )
  }

  // Display all members of the selected list
  return results.map(({ item: user, add, del }) => (
    <MemberItem
      key={user.id_str}
      onClick={() => handleMemberAction(user, add, del)}
      user={user}
      add={add}
      del={del}
      limitReached={limitReached}
    />
  ))
}

export default MemberResults;
