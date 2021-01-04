import React from 'react';

const Button = ({ run, text, small, warning, disabled }) => {
  let buttonClass = small ? 'px-6 py-2 m-2 rounded-md shadow' : 'px-8 py-4 m-2 rounded-lg shadow';
  if (warning) {
    buttonClass += ' bg-gradient-to-r from-red-400 to-red-500 text-white';
  }
  buttonClass += ' disabled:opacity-70 disabled:cursor-not-allowed';

  return (
    <button
      className={buttonClass}
      onClick={run}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button;
