import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
