import React from 'react';
import Switch from 'react-switch';
import { motion } from 'framer-motion';
import { LIST_DESCRIPTION_LIMIT } from '@web-utils/config';

import Button from './Button';

const AddListCard = ({ newList, setNewList, validList, handleAddList }) => {
  // TODO: Add user feedback that a list has been created
  // TODO: Disable button when creating a new list
  const validDescription = newList.description.length <= LIST_DESCRIPTION_LIMIT;

  return (
    <motion.div className="p-4 mx-16 mt-4 mb-2 rounded-lg shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <label className="block ml-2" htmlFor="list-description">Description <span className="text-gray-400 italic">(optional)</span></label>
      <div className="relative">
        <textarea
          className="w-full p-2 border border-gray-300 resize-none"
          name="list-description"
          placeholder="Write a description for your list..."
          value={newList.description}
          rows={2}
          onChange={(e) => setNewList({ ...newList, description: e.target.value })}
        />
        <span className={`absolute right-0 bottom-0 m-2 ${validDescription ? 'text-gray-300' : 'text-red-400'}`}>
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
        <Button run={handleAddList} small disabled={!validList}>Add list</Button>
      </div>
    </motion.div>
  )
}

export default AddListCard;
