import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Next } from './Icons';

const dropVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 }
};

const caretVariants = {
  open: { rotate: 90 },
  close: { rotate: 0 }
};

const answerVariants = {
  initial: { opacity: 0, height: 0, marginBottom: '0' },
  animate: { opacity: 1, height: 'auto', marginBottom: '0.5rem' }
}

const QnA = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div variants={dropVariants} className="p-1 bg-white rounded-md shadow-md">
      <div className="flex">
        <div>
          <motion.div
            className="cursor-pointer px-1.5 pt-1 pb-1.5"
            onClick={() => setOpen(!open)}
            variants={caretVariants}
            initial={false}
            animate={open ? 'open' : 'close'}
          >
            <Next size={32}/>
          </motion.div>
        </div>
        <div className="flex-1 mr-6 text-lg md:text-xl">
          <h3 className="font-bold py-1.5 cursor-pointer" onClick={() => setOpen(!open)}>{q}</h3>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div className="overflow-hidden" variants={answerVariants} initial="initial" animate="animate" exit="initial">
                {a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default QnA;
