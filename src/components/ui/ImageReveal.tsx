import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ImageRevealProps {
  children: React.ReactNode;
  once?: boolean;
  threshold?: number;
  className?: string;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  children,
  once = true,
  threshold = 0.35,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, threshold });
  
  const clipPathVariants = {
    hidden: { clipPath: 'inset(0 0 100% 0)' },
    visible: { 
      clipPath: 'inset(0 0 0 0)',
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={clipPathVariants}
    >
      {children}
    </motion.div>
  );
};