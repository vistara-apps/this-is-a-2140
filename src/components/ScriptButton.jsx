import React from 'react';

const ScriptButton = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';
  
  const variants = {
    primary: 'bg-primary hover:bg-blue-600 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-surface hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600',
    disabled: 'bg-gray-700 text-gray-500 cursor-not-allowed'
  };

  const appliedVariant = disabled ? 'disabled' : variant;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[appliedVariant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default ScriptButton;