import React, { useState } from 'react';
import './Avatar.css';

const Avatar = ({
  name = '',
  src = null,
  size = 'medium', // small, medium, large, xl
  status = null, // online, offline, busy, idle
  color = 'primary', // primary, secondary, success, warning, error, info
  onClick
}) => {
  const [imageError, setImageError] = useState(false);

  // Generate initials (e.g. "Rahul Sharma" -> "RS")
  const getInitials = (userName) => {
    if (!userName) return '?';
    const parts = userName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div 
      className={`avatar-container avatar-size-${size} avatar-color-${color} ${onClick ? 'avatar-clickable' : ''}`}
      onClick={onClick}
    >
      {src && !imageError ? (
        <img 
          src={src} 
          alt={name} 
          className="avatar-image" 
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="avatar-initials">{getInitials(name)}</span>
      )}
      
      {status && (
        <span className={`avatar-status-badge badge-status-${status}`} aria-label={status}></span>
      )}
    </div>
  );
};

export default Avatar;
