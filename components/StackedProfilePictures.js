import React from 'react';
import { motion } from 'framer-motion';
import clamp from 'lodash/clamp';

import ProfilePicture from './ProfilePicture';

const wrapperVariants = {
  open: { transition: { staggerChildren: 0.1 }},
  closed: { transition: { staggerChildren: 0.1 }}
};

const itemVariants = {
  open: { opacity: 1, x: '0%' },
  closed: {
    opacity: 0,
    x: '-100%',
    transition: {
      x: { bounce: 0 }
    }
  }
}

const Counter = ({ count, plus }) => (
  <motion.div
    className={`inline-flex items-center justify-center h-8 w-8 ring-2 ring-white ${plus ? 'bg-green-400' : 'bg-red-400'} text-white font-bold rounded-full z-10`}
    variants={itemVariants}
  >
    <span className="text-sm">{plus ? '+' : '-'}{count}</span>
  </motion.div>
)

const StackedProfilePictures = ({ add = [], del = [] }) => {
  const merged = [...add, ...del];
  const addCounter = (merged.length > 4 && add.length > 3) ? add.length - 3 + clamp(del.length, 1) : 0;
  const delCounter = (merged.length > 4 && del.length > 0) ? del.length - 3 + clamp(add.length, 3) : 0;
  const stack = merged.slice(0, 2 + (addCounter > 0 ? 0 : 1) + (delCounter > 0 ? 0 : 1));

  return (
    <motion.div className="hidden md:flex items-center absolute inset-y-0 right-full mr-3 -space-x-2.5" variants={wrapperVariants} initial="closed" animate="open" exit="closed">
      {stack.map(u => (
        <motion.div key={u.id_str} variants={itemVariants}>
          <ProfilePicture
            user={u}
            size={32}
            noAnchor
            extraClass="ring-2 ring-white"
          />
        </motion.div>
      ))}
      {addCounter > 0 && (
        <Counter count={addCounter} plus/>
      )}
      {delCounter > 0 && (
        <Counter count={delCounter}/>
      )}
    </motion.div>
  )
}

export default StackedProfilePictures;
