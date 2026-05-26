import React from 'react';
import './Skeleton.css';

const Skeleton = ({ 
  variant = 'text', // text, title, rect, circle
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  margin = '0'
}) => {
  const getStyle = () => {
    const style = {
      width,
      height,
      borderRadius,
      margin,
    };

    if (variant === 'circle') {
      style.borderRadius = '50%';
      style.width = width === '100%' ? height : width; // Standardize square circle dimensions
    } else if (variant === 'title') {
      style.height = '32px';
      style.width = width === '100%' ? '60%' : width;
    } else if (variant === 'text') {
      style.height = '16px';
    }

    return style;
  };

  return (
    <div 
      className="skeleton-element shimmer-pulse" 
      style={getStyle()}
    />
  );
};

export default Skeleton;
