import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Switch from 'react-switch';
import { updateList } from '@web-utils/api';
import { LIST_NAME_LIMIT, LIST_DESCRIPTION_LIMIT } from '@web-utils/config';

import Button from '@components/Button';

// FM Variants
const wrapperVariants = {
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
}

const EditView = ({ item, exitEditMode, _handleUpdateList, errorHandler }) => {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [mode, setMode] = useState(item.mode === 'private');
  const [valid, setValid] = useState(false);
  const [pending, setPending] = useState(false);
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

  // Handler for updating a list (2/2)
  const handleUpdateList = (id, name, description, mode) => {
    const list = { id, name, description, mode };
    setPending(true);
    updateList(list)
      .then(list => {
        _handleUpdateList(list);
        exitEditMode();
      })
      .catch(err => {
        errorHandler(err);
        setPending(false);
      });
  }

  return (
    <motion.div
      className={`flex flex-col p-3`}
      variants={wrapperVariants}
      initial="exit"
      animate="enter"
      exit="exit"
    >
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
          run={exitEditMode}
          disabled={pending}
          warning
          small
        >
          Cancel
        </Button>
        <Button
          run={() => handleUpdateList(item.id_str, name, description, mode)}
          disabled={!valid}
          loading={pending}
          primary
          small
        >
          Update
        </Button>
      </div>
    </motion.div>
  )
}

export default EditView;
