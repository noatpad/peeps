import React, { useState, useEffect, useRef } from 'react';
import Switch from 'react-switch';
import { LIST_NAME_LIMIT, LIST_DESCRIPTION_LIMIT } from '@web-utils/config';

import Button from '@components/Button';

const EditView = ({ item, updatePending, setEditMode, handleUpdate }) => {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [mode, setMode] = useState(item.mode === 'private');
  const [valid, setValid] = useState(false);
  const nameInputRef = useRef();

  const validTitle = name.length > 0 && name.length <= LIST_NAME_LIMIT;
  const validDescription = description.length <= LIST_DESCRIPTION_LIMIT;

  // Focus on the name input upon entering this view
  useEffect(() => {
    nameInputRef.current.focus();
  }, []);

  // Check if the list data is valid for updating
  useEffect(() => {
    setValid(validTitle && validDescription);
  }, [name, description]);

  return (
    <div className="flex-1 flex flex-col mx-2">
      <div className="flex flex-col">
        <label className="ml-2 text-sm text-gray-500">Name</label>
        <div className="relative">
          <input
            className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-400 transition-colors"
            ref={nameInputRef}
            value={name}
            placeholder="The name of your list"
            onChange={e => setName(e.target.value)}
          />
          <span className={`absolute right-0 bottom-0 m-2 ${validTitle ? 'text-gray-300' : 'text-red-400'} transition-colors`}>
            {name.length}/{LIST_NAME_LIMIT}
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <label className="ml-2 text-sm text-gray-500">Description <span className="text-gray-400 italic">(optional)</span></label>
        <div className="relative">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-none focus:border-blue-400 transition-colors"
            value={description}
            placeholder="Say something about your list..."
            rows={3}
            onChange={e => setDescription(e.target.value)}
          />
          <span className={`absolute right-0 bottom-0 m-2 ${validDescription ? 'text-gray-300' : 'text-red-400'} transition-colors`}>
            {description.length}/{LIST_DESCRIPTION_LIMIT}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center mt-4">
        <label className="relative h-7 text-gray-600">
          <span className="absolute top-1/2 right-full mx-2 transform -translate-y-1/2">Public</span>
          <Switch
            className={`react-switch`}
            checked={mode}
            onChange={(checked) => setMode(checked)}
            uncheckedIcon={false}
            checkedIcon={false}
          />
          <span className="absolute top-1/2 left-full mx-2 transform -translate-y-1/2">Private</span>
        </label>
      </div>
      <div className="flex justify-center mt-2">
        <Button
          run={() => setEditMode(false)}
          disabled={updatePending}
          warning
          small
        >
          Cancel
        </Button>
        <Button
          run={() => handleUpdate(item.id_str, name, description, mode)}
          disabled={!valid}
          loading={updatePending}
          primary
          small
        >
          Update
        </Button>
      </div>
    </div>
  )
}

export default EditView;
