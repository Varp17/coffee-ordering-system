import React from 'react';
import './EmptyState.css';
import Button from '../Button/Button';

const EmptyState = ({ 
  icon = "🫙", 
  title = "No data found", 
  description = "There are no records to display in this list at the moment.", 
  actionText = null, 
  onAction = null 
}) => {
  return (
    <div className="empty-state-panel -card">
      <div className="empty-state-icon-decor">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <div className="empty-state-action-btn-row">
          <Button variant="primary" size="medium" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;

