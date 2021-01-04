import React from 'react';
import Switch from 'react-switch';
import Button from './Button';
import { LIST_DESCRIPTION_LIMIT } from '../utils/config';

const AddListCard = ({ newList, setNewList, validList, handleAddList }) => {
  const validDescription = newList.description.length <= LIST_DESCRIPTION_LIMIT;

  return (
    <div className="p-4 mx-16 mt-4 mb-2 rounded-lg shadow-md">
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
            checked={newList.private}
            onChange={(checked) => setNewList({ ...newList, private: checked })}
            uncheckedIcon={false}
            checkedIcon={false}
          />
          <span className="absolute top-1/2 left-full mx-2 transform -translate-y-1/2">Private</span>
        </label>
      </div>
      <div className="flex justify-center mt-2">
        <Button run={handleAddList} text="Add list" small disabled={!validList}/>
      </div>
    </div>
  )
}

export default AddListCard;
