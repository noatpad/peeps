import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { numberNoun } from '@web-utils/helpers';

import ProfilePicture from './ProfilePicture';
import StackedProfilePictures from './StackedProfilePictures';
import { Next } from './Icons';

const caretVariants = {
  open: { rotate: 90 },
  closed: { rotate: 0 }
};

const gridVariants = {
  open: { opacity: 1, height: 'auto' },
  closed: { opacity: 0, height: 0 }
};

// Sub-component for list of member changes
const Members = ({ list, plus }) => (
  <div className="flex-1 flex justify-center px-2">
    <ul className="space-y-1">
      {list.map(m => (
        <li key={m.id_str} className={`flex italic ${plus ? 'text-green-400' : 'text-red-400'} space-x-1`}>
          <ProfilePicture user={m} size={28}/>
          <span>@{m.screen_name}</span>
        </li>
      ))}
    </ul>
  </div>
)

const ChangeDropdownItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  const { name, additions, deletions } = item;

  return (
    <div className="container">
      <div className="px-32">
        <div className="relative">
          <AnimatePresence initial={false}>
            {!open && (
              <StackedProfilePictures add={additions} del={deletions}/>
            )}
          </AnimatePresence>
          <div className="inline-flex items-center text-xl cursor-pointer" onClick={() => setOpen(!open)}>
            <motion.span className="-ml-2" variants={caretVariants} initial={false} animate={open ? 'open' : 'closed'}>
              <Next size={28}/>
            </motion.span>
            <p>
              List <b>{name}</b>:{" "}
              {additions && `Add ${numberNoun(additions.length, "member")}`}
              {additions && deletions && " & "}
              {deletions && `${additions ? 'r' : 'R'}emove ${numberNoun(deletions.length, "member")}`}
            </p>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="flex flex-wrap px-16 overflow-hidden" variants={gridVariants} initial="closed" animate="open" exit="closed">
            {additions && <Members list={additions} plus/>}
            {deletions && <Members list={deletions}/>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChangeDropdownItem;
