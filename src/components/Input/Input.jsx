import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon, 
  required = false, 
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`input-field-group ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
      {label && (
        <label className="input-field-label">
          {label} {required && <span className="label-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon-decor">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`input-field-element ${icon ? 'has-icon-padding' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
