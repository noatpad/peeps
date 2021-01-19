import React from 'react';
import { motion } from 'framer-motion';

const ItemButton = ({ onClick, icon, text }) => {
  const textVariants = {
    rest: { width: 0, opacity: 0, transitionEnd: { marginLeft: '0px' }},
    hover: { width: 100, opacity: 1, marginLeft: '0.5rem' }
  };

  return (
    <motion.button
      className="flex items-center p-1 rounded group text-red-400 hover:bg-white hover:shadow-md transition-all"
      onClick={onClick}
      initial={false}
      whileHover="hover"
      animate="rest"
    >
      <div>{icon}</div>
      <motion.p className="text-sm overflow-hidden whitespace-nowrap" variants={textVariants}>{text}</motion.p>
    </motion.button>
  )
}

export default ItemButton;
