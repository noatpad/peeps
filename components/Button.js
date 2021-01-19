import React from 'react';

const Button = ({ run, small, warning, disabled, children }) => {
  let buttonClass = 'm-2 shadow bg-gradient-to-r text-white transition-colors'
  buttonClass += (small ? ' px-4 py-2 rounded-md' : ' px-6 py-3 rounded-lg');
  buttonClass += (warning ? ' from-red-400 to-red-500' : ' from-blue-400 to-blue-500');
  buttonClass += ' disabled:opacity-50 disabled:text-opacity-50 disabled:cursor-not-allowed';

  return (
    <button className={buttonClass} onClick={run} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button;
