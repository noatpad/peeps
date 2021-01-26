import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import { motion } from 'framer-motion';
import { addList } from '@web-utils/api';
import { LIST_COUNT_LIMIT, LIST_DESCRIPTION_LIMIT } from '@web-utils/config';

import Button from './Button';

// FM Variants
const wrapperVariants = {
  exit: {
    opacity: 0,
    height: 0
  },
  enter: {
    opacity: 1,
    height: 'auto'
  }
};

const AddListCard = ({ name, validName, limitReached, _handleAddList, errorHandler }) => {
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState(true);
  const [valid, setValid] = useState(false);
  const [status, setStatus] = useState(0);

  const validDescription = description.length <= LIST_DESCRIPTION_LIMIT;
  let buttonText;
  switch (status) {
    case 0: buttonText = 'Add list'; break;
    case 1: buttonText = 'Adding...'; break;
    case 2: buttonText = 'Done!'; break;
  }

  // When readying a new list, check if the data is valid
  useEffect(() => {
    setValid(validName && validDescription && !limitReached);
  }, [validName, description, limitReached]);

  // Handler for adding a new list (3/3)
  const handleAddList = () => {
    if (!valid) { return }
    setStatus(1);
    addList({ name, description, mode })
      .then(list => {
        _handleAddList(list);
        setDescription('');
        setStatus(2);
        setTimeout(() => setStatus(0), 2000);
      })
      .catch(err => {
        errorHandler(err);
        setStatus(0);
      })
  }

  return (
    <motion.div className="overflow-hidden" variants={wrapperVariants} initial="exit" animate="enter" exit="exit">
      <div className="p-4 mx-4 sm:mx-8 md:mx-16 my-2 sm:my-4 rounded-lg shadow-md">
        <label className="block ml-2" htmlFor="list-description">Description <span className="text-gray-400 italic">(optional)</span></label>
        <div className="relative">
          <textarea
            className={`w-full p-2 border border-gray-300 rounded-md resize-none focus:border-blue-400 transition-colors`}
            name="list-description"
            value={description}
            placeholder="Say something about your list..."
            rows={2}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className={`absolute right-0 bottom-0 m-2 ${validDescription ? 'text-gray-300' : 'text-red-400'} transition-colors`}>
            {description.length}/{LIST_DESCRIPTION_LIMIT}
          </span>
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
            run={handleAddList}
            disabled={!valid}
            loading={status === 1}
            done={status === 2}
            primary
            small
          >
            {buttonText}
          </Button>
        </div>
        {limitReached && (
          <p className="text-center text-sm text-red-400">You&apos;ve reached your limit of {LIST_COUNT_LIMIT} lists!</p>
        )}
      </div>
    </motion.div>
  )
}

export default AddListCard;
