import React from 'react';
import './ErrorState.css';
import Button from '../Button/Button';

const ErrorState = ({ 
  title = "Something went wrong", 
  message = "We encountered an unexpected error while fetching this data panel.", 
  onRetry = null 
}) => {
  return (
    <div className="error-state-panel -card">
      <div className="error-state-icon-decor">⚠️</div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-desc">{message}</p>
      {onRetry && (
        <div className="error-state-action-btn-row">
          <Button variant="danger" size="medium" onClick={onRetry}>
            🔄 Try Loading Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;

