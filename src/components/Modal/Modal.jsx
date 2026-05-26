import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium', // small, medium, large, fullscreen
  footerActions = null 
}) => {
  
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className={`modal-container modal-size-${size}`} 
        onClick={(e) => e.stopPropagation()} // Stop bubble close click
      >
        <header className="modal-header-panel">
          <h3 className="modal-header-title">{title}</h3>
          <button className="modal-close-trigger-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </header>

        <section className="modal-body-scroll">
          {children}
        </section>

        {footerActions && (
          <footer className="modal-footer-panel">
            {footerActions}
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;
