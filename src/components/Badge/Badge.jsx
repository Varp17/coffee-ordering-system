import React from 'react';
import './Badge.css';

const Badge = ({ 
  children, 
  variant = 'info', // success, warning, error, info, primary, neutral
  styleType = 'standard' // standard, pill, dot
}) => {
  return (
    <span className={`badge-indicator badge-variant-${variant} badge-style-${styleType}`}>
      {styleType === 'dot' && <span className="badge-dot-indicator"></span>}
      <span className="badge-text-content">{children}</span>
    </span>
  );
};

export default Badge;
