import React from 'react';
import './KPICard.css';
import AnimatedCounter from '../Motion/AnimatedCounter';

const KPICard = ({
  title,
  value,
  icon,
  trend, // e.g. { label: '+12.5%', isPositive: true }
  sparklineData = [], // Array of numbers for custom premium SVG mini chart
  color = 'primary', // primary, secondary, success, warning, error, info
  loading = false,
  rawNumber, // Optional: if provided, animates this number
  prefix = '', // Optional: prefix for AnimatedCounter (e.g., '₹')
  onClick
}) => {
  if (loading) {
    return (
      <div className="kpi-card kpi-skeleton">
        <div className="kpi-skeleton-header">
          <div className="kpi-skeleton-title shimmer"></div>
          <div className="kpi-skeleton-icon shimmer"></div>
        </div>
        <div className="kpi-skeleton-value shimmer"></div>
        <div className="kpi-skeleton-trend shimmer"></div>
      </div>
    );
  }

  // Draw simple premium SVG sparkline if data is provided
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const width = 120;
    const height = 40;
    const padding = 2;
    const maxVal = Math.max(...sparklineData);
    const minVal = Math.min(...sparklineData);
    const range = maxVal - minVal || 1;

    const points = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
        return `${x},${y}`;
      })
      .join(' ');

    const trendClass = trend?.isPositive ? 'trend-up' : trend?.isPositive === false ? 'trend-down' : 'trend-neutral';

    return (
      <div className="kpi-sparkline">
        <svg width={width} height={height}>
          <polyline
            fill="none"
            stroke={`var(--kpi-stroke-${trendClass})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    );
  };

  return (
    <div 
      className={`kpi-card kpi-color-${color} ${onClick ? 'kpi-clickable' : ''}`}
      onClick={onClick}
    >
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        {icon && <span className="kpi-icon-container">{icon}</span>}
      </div>
      
      <div className="kpi-body">
        <div className="kpi-value-container">
          <span className="kpi-value">
            {rawNumber !== undefined ? (
              <AnimatedCounter value={rawNumber} prefix={prefix} />
            ) : (
              value
            )}
          </span>
          {trend && (
            <span className={`kpi-trend ${trend.isPositive ? 'trend-positive' : 'trend-negative'}`}>
              {trend.isPositive ? '▲' : '▼'} {trend.label}
            </span>
          )}
        </div>
        {renderSparkline()}
      </div>
    </div>
  );
};

export default KPICard;
