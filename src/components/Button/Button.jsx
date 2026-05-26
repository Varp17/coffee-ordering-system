import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled, 
  loading = false, 
  icon = null, 
  fullWidth = false 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${loading ? 'btn-loading' : ''}`} 
      onClick={loading ? undefined : onClick} 
      disabled={disabled || loading}
    >
      {loading && <span className="btn-spinner"></span>}
      {!loading && icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
