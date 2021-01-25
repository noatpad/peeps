import React from 'react';
import { motion } from 'framer-motion';

const ItemButton = ({
  onClick,
  icon,
  width = 100,
  bg = "bg-white",
  color = 'text-gray-700',
  hoverColor,
  text,
  textSize = "text-sm",
  disabled,
  reverse
}) => {
  const textVariants = {
    rest: { width: 0, opacity: 0, transitionEnd: { marginLeft: '0px', marginRight: '0px' }},
    hover: { width: width, opacity: 1, marginLeft: !reverse ? '0.5rem' : '0px', marginRight: reverse ? '0.5rem' : '0px' }
  };

  return (
    <motion.button
      className={`flex ${reverse ? 'flex-row-reverse' : 'flex-row'} items-center p-1 rounded group ${color} hover:${bg} hover:shadow-md ${hoverColor ? `hover:${hoverColor}` : ''} disabled:opacity-50 disabled:text-opacity-50 disabled:cursor-not-allowed transition-all`}
      onClick={onClick}
      disabled={disabled}
      initial={false}
      whileHover={!disabled ? "hover" : ""}
      animate="rest"
    >
      <div>{icon}</div>
      <motion.p className={`${textSize} overflow-hidden whitespace-nowrap`} variants={textVariants}>{text}</motion.p>
    </motion.button>
  )
}

export default ItemButton;
