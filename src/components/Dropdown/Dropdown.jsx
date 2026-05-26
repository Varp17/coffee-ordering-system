import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({
  options = [], // [{ value: 'x', label: 'Label X', icon: '...' }]
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  disabled = false,
  error = null,
  label = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optValue) => {
    if (onChange) onChange(optValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`dropdown-wrapper ${disabled ? 'dropdown-disabled' : ''} ${error ? 'dropdown-has-error' : ''}`} ref={dropdownRef}>
      {label && <label className="dropdown-label">{label}</label>}
      
      <div className="dropdown-container">
        <button
          type="button"
          className="dropdown-trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <div className="dropdown-trigger-content">
            {selectedOption?.icon && <span className="dropdown-trigger-icon">{selectedOption.icon}</span>}
            <span className={`dropdown-trigger-text ${!selectedOption ? 'dropdown-placeholder' : ''}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <span className={`dropdown-caret ${isOpen ? 'caret-open' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {searchable && (
              <div className="dropdown-search-container">
                <input
                  type="text"
                  className="dropdown-search-input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            
            <ul className="dropdown-options-list" role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <li
                      key={opt.value}
                      className={`dropdown-option-item ${isSelected ? 'option-selected' : ''}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                    >
                      {opt.icon && <span className="option-icon">{opt.icon}</span>}
                      <span className="option-label">{opt.label}</span>
                      {isSelected && <span className="option-checkmark">✓</span>}
                    </li>
                  );
                })
              ) : (
                <li className="dropdown-no-options">No options found</li>
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <span className="dropdown-error-text">{error}</span>}
    </div>
  );
};

export default Dropdown;
