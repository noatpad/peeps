import React from 'react';

const Button = ({ run, text, warning }) => {
  let buttonClass = 'px-8 py-4 m-2 rounded-lg shadow ';
  if (warning) {
    buttonClass += 'bg-gradient-to-r from-red-400 to-red-500 text-white'
  }

  return (
    <button className={buttonClass} onClick={run}>
      {text}
    </button>
  )
}

export default Button;
