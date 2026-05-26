import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedCounter
 * Smoothly rolls up/down to a target value using spring physics.
 */
const AnimatedCounter = ({ value, prefix = '₹', duration = 0.5, className = '' }) => {
  const springValue = useSpring(value, { 
    stiffness: 100, 
    damping: 20, 
    mass: 1 
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  // Format the spring value back to a localized string
  const displayValue = useTransform(springValue, (current) => {
    return `${prefix}${Math.round(current).toLocaleString('en-IN')}`;
  });

  return (
    <motion.span className={className}>
      {displayValue}
    </motion.span>
  );
};

export default AnimatedCounter;
