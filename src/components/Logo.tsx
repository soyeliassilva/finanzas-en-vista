
import React from 'react';

const Logo = () => {
  return (
    <div className="text-primary flex items-center gap-2">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="4" fill="#004236" />
        <path d="M12 9V27M24 9V27M12 18H24" stroke="#D1A4C4" strokeWidth="2" />
      </svg>
      <span className="font-rufina text-xl">Mutualidad</span>
    </div>
  );
};

export default Logo;
