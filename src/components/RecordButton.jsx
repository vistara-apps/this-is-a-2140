import React from 'react';

const RecordButton = ({ 
  children, 
  variant = 'record', 
  onClick, 
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-3';
  
  const variants = {
    record: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500',
    stop: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm hover:shadow-md focus:ring-gray-500',
    idle: 'bg-surface hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 focus:ring-primary',
    emergency: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-red-500 text-lg py-4'
  };

  const appliedVariant = disabled ? 'idle' : variant;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[appliedVariant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default RecordButton;