import React, { useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search beverages, orders, ingredients...',
  hotkey = '/', // hotkey to focus (e.g., '/' or 'k' for Ctrl+K)
  size = 'medium', // small, medium, large
  fullWidth = true
}) => {
  const inputRef = useRef(null);

  // Keyboard shortcut listener to focus input
  useEffect(() => {
    if (!hotkey) return;

    const handleKeyDown = (e) => {
      // Don't trigger if user is already typing in an input/textarea
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.isContentEditable
      ) {
        return;
      }

      if (hotkey === '/' && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (hotkey === 'k' && (e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkey]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const showShortcutText = () => {
    if (hotkey === '/') return '/';
    if (hotkey === 'k') return '⌘K';
    return null;
  };

  return (
    <div className={`searchbar-container searchbar-size-${size} ${fullWidth ? 'searchbar-full-width' : ''}`}>
      <span className="searchbar-icon">🔍</span>
      <input
        ref={inputRef}
        type="text"
        className="searchbar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value ? (
        <button 
          type="button" 
          className="searchbar-clear-btn"
          onClick={() => onChange && onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : (
        showShortcutText() && (
          <span className="searchbar-shortcut-hint">
            {showShortcutText()}
          </span>
        )
      )}
    </div>
  );
};

export default SearchBar;
