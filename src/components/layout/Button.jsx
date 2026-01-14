import React from 'react';

export function Button({ children, variant = 'primary', onClick, className = '', ...props }) {
  const baseClasses = 'flex flex-col shrink-0 items-start text-left py-1.5 px-3 rounded-md border border-solid transition-colors';
  
  const variants = {
    primary: 'bg-black text-white border-0 hover:bg-gray-800',
    secondary: 'bg-white text-black border-black hover:bg-gray-50',
    outline: 'bg-transparent text-black border-black hover:bg-gray-100',
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`.trim();

  return (
    <button className={classes} onClick={onClick} {...props}>
      <span className="text-base">{children}</span>
    </button>
  );
}
