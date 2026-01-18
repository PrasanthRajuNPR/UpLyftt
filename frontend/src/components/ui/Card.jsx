import React from 'react';

export function Card({
  children,
  className = '',
  hover = false,
}) {
  const hoverEffect = hover
    ? 'hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105'
    : '';

  return (
    <div
      className={`bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 ${hoverEffect} ${className}`}
    >
      {children}
    </div>
  );
}
