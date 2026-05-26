import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedCard.css';

/**
 * AnimatedCard
 * Provides tactile, physics-based micro-interactions for buttons or cards.
 */
const AnimatedCard = ({ children, className = '', onClick, layout = true, layoutId, style }) => {
  return (
    <motion.div
      layout={layout}
      layoutId={layoutId}
      whileHover={{ y: -2, boxShadow: 'var(--elevation-2)' }}
      whileTap={{ scale: 0.98, boxShadow: 'var(--elevation-1)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`animated-card ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
