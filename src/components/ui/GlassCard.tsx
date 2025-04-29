import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  depth?: 1 | 2 | 3 | 4 | 5;
  tint?: 'light' | 'dark' | 'accent';
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  depth = 3,
  tint = 'light',
  className = '',
  onClick
}) => {
  // Calculate blur amount based on depth
  const blurAmount = depth * 2;
  
  // Define shadow based on depth
  const shadowMap = {
    1: '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)',
    2: '0 4px 8px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
    3: '0 8px 16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)',
    4: '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.07)',
    5: '0 16px 32px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)'
  };
  
  // Define background based on tint
  const getTintStyles = () => {
    switch (tint) {
      case 'dark':
        return 'bg-carbon/5 bg-gradient-to-br from-carbon/10 to-transparent';
      case 'accent':
        return 'bg-accent/5 bg-gradient-to-br from-accent/7 to-transparent';
      case 'light':
      default:
        return 'bg-white/10 bg-gradient-to-br from-white/20 to-transparent';
    }
  };
  
  // Define border based on tint
  const getBorderStyles = () => {
    switch (tint) {
      case 'dark':
        return 'border-carbon/10';
      case 'accent':
        return 'border-accent/10';
      case 'light':
      default:
        return 'border-white/20';
    }
  };
  
  return (
    <motion.div
      className={`relative rounded-lg border overflow-hidden ${getBorderStyles()} ${getTintStyles()} ${className}`}
      style={{
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        boxShadow: shadowMap[depth]
      }}
      whileHover={{
        y: -4,
        boxShadow: shadowMap[Math.min(depth + 1, 5) as 1 | 2 | 3 | 4 | 5],
        transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;