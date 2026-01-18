import React from 'react';

export function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  className = '',
  ...props
}) {
  const baseStyles =
    'px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70',
    secondary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/50 hover:shadow-blue-600/70',
    outline:
      'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
