import React from 'react';
import './Timeline.css';

const Timeline = ({
  items = [], // [{ id: '1', title: 'Title', description: 'Desc', status: 'completed|current|pending', time: '10:40 AM', icon: '☕' }]
  layout = 'vertical' // vertical, horizontal (could be added)
}) => {
  return (
    <div className={`timeline-container timeline-${layout}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div 
            key={item.id || index} 
            className={`timeline-item timeline-status-${item.status || 'pending'}`}
          >
            {/* Timeline connector line */}
            {!isLast && <div className="timeline-connector"></div>}

            {/* Indicator Dot */}
            <div className="timeline-indicator-wrapper">
              <div className="timeline-indicator">
                {item.icon ? (
                  <span className="timeline-indicator-icon">{item.icon}</span>
                ) : (
                  <div className="timeline-indicator-dot"></div>
                )}
              </div>
            </div>

            {/* Content card */}
            <div className="timeline-content">
              <div className="timeline-content-header">
                <h4 className="timeline-item-title">{item.title}</h4>
                {item.time && <span className="timeline-item-time">{item.time}</span>}
              </div>
              {item.description && (
                <p className="timeline-item-description">{item.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
