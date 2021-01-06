import React from 'react';

const SelectorPane = ({ title, subtitle, adds, dels, children }) => (
  <div className="flex-1 flex flex-col mx-16 rounded-2xl bg-white shadow-md overflow-hidden" style={{ height: 650 }}>
    <div className="flex-initial p-4 text-center shadow">
      <h2 className="text-3xl">{title}</h2>
      <h3 className="text-sm text-gray-500 uppercase">
        {subtitle}{" "}
        {adds > 0 && (
          <span className="text-green-600">
            (+{adds}){" "}
          </span>
        )}
        {dels > 0 && (
          <span className="text-red-600">
            (-{dels})
          </span>
        )}
      </h3>
    </div>
    <div className="flex-1 overflow-hidden">{children}</div>
  </div>
)

export default SelectorPane;
