// src/components/CustomDialog.js
import React from 'react';

const CustomDialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 transition-all duration-1000">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <h2 className="text-xl font-mono mb-4 flex justify-center transition-all duration-1000 ">Get Started</h2>
        {children}
      </div>
    </div>
  );
};

export default CustomDialog;
