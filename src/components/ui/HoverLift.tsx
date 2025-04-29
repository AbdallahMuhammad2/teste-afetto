import React from 'react';
import { motion } from 'framer-motion';

interface HoverLiftProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  liftAmount?: number;
  duration?: number;
}

export const HoverLift: React.FC<HoverLiftProps> = ({
  children,
  disabled = false,
  className = '',
  liftAmount = 4,
  duration = 0.25
}) => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Don't apply motion effects if disabled or reduced motion is preferred
  if (disabled || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      whileHover={{ 
        y: -liftAmount,
        boxShadow: '0 8px 24px -6px rgba(0,0,0,0.25)'
      }}
      transition={{ 
        duration,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  );
};