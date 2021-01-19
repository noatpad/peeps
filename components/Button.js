import React from 'react';
import Loading from './Loading';

const Button = ({ run, small, warning, disabled, loading, done, children }) => {
  let buttonClass = 'flex flex-row items-center justify-center m-2 shadow bg-gradient-to-r text-white transition-colors'
  buttonClass += (small ? ' px-4 py-2 rounded-md' : ' px-6 py-3 rounded-lg');
  if (warning) {
    buttonClass += ' from-red-400 to-red-500';
  } else if (done) {
    buttonClass += ' from-green-400 to-green-500';
  } else {
    buttonClass += ' from-blue-400 to-blue-500';
  }
  buttonClass += ' disabled:opacity-50 disabled:text-opacity-50 disabled:cursor-not-allowed';

  return (
    <button className={buttonClass} onClick={run} disabled={loading || disabled}>
      <div>{children}</div>
      {loading && (
        <div className="h-6 w-6 ml-2">
          <Loading size={24} color="white"/>
        </div>
      )}
    </button>
  )
}

export default Button;
