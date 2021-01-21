import React, { useState } from 'react';
import Switch from 'react-switch';
import { motion } from 'framer-motion';
import { LIST_COUNT_LIMIT, LIST_DESCRIPTION_LIMIT } from '@web-utils/config';

import Button from './Button';

const AddListCard = ({ newList, setNewList, validList, handleAddList, addStatus, tooManyLists }) => {
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const validDescription = newList.description.length <= LIST_DESCRIPTION_LIMIT;
  let buttonText;
  switch (addStatus) {
    case 0: buttonText = 'Add list'; break;
    case 1: buttonText = 'Adding...'; break;
    case 2: buttonText = 'Done!'; break;
  }

  return (
    <motion.div className="p-4 mx-16 mt-4 mb-2 rounded-lg shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <label className="block ml-2" htmlFor="list-description">Description <span className="text-gray-400 italic">(optional)</span></label>
      <div className="relative">
        <textarea
          className={`w-full p-2 border ${descriptionFocused ? 'border-blue-400' : 'border-gray-300'} rounded-md resize-none transition-colors`}
          name="list-description"
          value={newList.description}
          placeholder="Say something about your list..."
          rows={2}
          onChange={(e) => setNewList({ ...newList, description: e.target.value })}
          onFocus={() => setDescriptionFocused(true)}
          onBlur={() => setDescriptionFocused(false)}
        />
        <span className={`absolute right-0 bottom-0 m-2 ${validDescription ? 'text-gray-300' : 'text-red-400'} transition-colors`}>
          {newList.description.length}/{LIST_DESCRIPTION_LIMIT}
        </span>
      </div>
      <div className="flex justify-center items-center mt-4">
        <label className="relative h-7 text-gray-600">
          <span className="absolute top-1/2 right-full mx-2 transform -translate-y-1/2">Public</span>
          <Switch
            className={`react-switch`}
            checked={newList.mode_private}
            onChange={(checked) => setNewList({ ...newList, mode_private: checked })}
            uncheckedIcon={false}
            checkedIcon={false}
          />
          <span className="absolute top-1/2 left-full mx-2 transform -translate-y-1/2">Private</span>
        </label>
      </div>
      <div className="flex justify-center mt-2">
        <Button
          run={handleAddList}
          disabled={!validList}
          loading={addStatus === 1}
          done={addStatus === 2}
          primary
          small
        >
          {buttonText}
        </Button>
      </div>
      {tooManyLists && (
        <p className="text-center text-sm text-red-400">You can&apos;t create a new list, since you can only have up to {LIST_COUNT_LIMIT} lists!</p>
      )}
    </motion.div>
  )
}

export default AddListCard;
