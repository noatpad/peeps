import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Next } from './Icons';

const dropVariants = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 }
};

const caretVariants = {
  open: { rotate: 90 },
  close: { rotate: 0 }
};

const answerVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' }
}

const QnA = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div variants={dropVariants}>
      <div className="flex">
        <div>
          <motion.div
            className="cursor-pointer p-1 -mt-1"
            onClick={() => setOpen(!open)}
            variants={caretVariants}
            initial={false}
            animate={open ? 'open' : 'close'}
          >
            <Next size={28}/>
          </motion.div>
        </div>
        <div className="flex-1 text-lg md:text-xl">
          <h3 className="inline-block font-bold cursor-pointer" onClick={() => setOpen(!open)}>{q}</h3>
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
