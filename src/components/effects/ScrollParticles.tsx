import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const ScrollParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        opacity: [0, 1, 0],
        y: [0, 15],
        transition: { 
          duration: 1.5,
          times: [0, 0.5, 1],
          repeat: Infinity,
          repeatDelay: 1
        }
      });
    };
    
    sequence();
  }, [controls]);
  
  return (
    <motion.div 
      ref={containerRef}
      className="w-6 h-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.8 }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent/80"
          style={{
            left: '50%',
            top: '50%',
            x: '-50%',
            y: '-50%'
          }}
          animate={controls}
          custom={i}
          transition={{
            delay: i * 0.1,
          }}
        />
      ))}
    </motion.div>
  );
};

export default ScrollParticles;