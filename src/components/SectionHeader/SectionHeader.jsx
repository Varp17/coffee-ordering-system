import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './SectionHeader.css';

const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  ctaText,
  ctaLink,
  align = 'center',
  dark = false,
}) => {
  return (
    <div className={`section-header-wrap ${align} ${dark ? 'dark' : ''}`}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      {ctaText && ctaLink && (
        <Link to={ctaLink} className="section-cta">
          {ctaText}
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
