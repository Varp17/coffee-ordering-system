import React from 'react';
import './Tabs.css';

const Tabs = ({
  tabs = [], // [{ id: 'x', label: 'Tab X', count: 5, icon: '☕' }]
  activeTab,
  onChange,
  variant = 'pills', // pills, line, segmented
  fullWidth = false,
  size = 'medium' // small, medium, large
}) => {
  return (
    <div className={`tabs-container tabs-${variant} tabs-size-${size} ${fullWidth ? 'tabs-full-width' : ''}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            className={`tab-item ${isActive ? 'tab-active' : ''}`}
            onClick={() => onChange && onChange(tab.id)}
            type="button"
            role="tab"
            aria-selected={isActive}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
            {tab.count !== undefined && (
              <span className="tab-count-badge">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
