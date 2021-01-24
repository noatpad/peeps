import React from 'react';

const SelectorPane = ({ title, subtitle, addCount, delCount, italic, children }) => (
  <div className={`flex-1 flex flex-col mx-16 h-656 rounded-2xl bg-white shadow-md overflow-hidden ${italic ? 'italic' : ''}`}>
    <div className="flex-initial p-4 text-center shadow">
      <h2 className="text-3xl">{title}</h2>
      <h3 className="text-sm text-gray-500 uppercase">
        {subtitle}{" "}
        {addCount > 0 && (
          <span className="text-green-600">
            (+{addCount}){" "}
          </span>
        )}
        {delCount > 0 && (
          <span className="text-red-600">
            (-{delCount})
          </span>
        )}
      </h3>
    </div>
    <div className="flex-1 overflow-hidden">{children}</div>
  </div>
)

export default SelectorPane;
