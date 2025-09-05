import React from 'react';

const AlertButton = ({ 
  children, 
  variant = 'trigger', 
  onClick, 
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-6 py-3';
  
  const variants = {
    trigger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500 transform hover:scale-105',
    confirm: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md focus:ring-green-500'
  };

  const appliedVariant = disabled ? 'confirm' : variant;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[appliedVariant]} ${className} ${disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default AlertButton;