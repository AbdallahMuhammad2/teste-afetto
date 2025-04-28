import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement && 
        (e.target.tagName === 'A' || 
         e.target.tagName === 'BUTTON' ||
         e.target.closest('a') ||
         e.target.closest('button') ||
         e.target.classList.contains('interactive'))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
  
  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-bronze/80 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6
        }}
        animate={{
          scale: isHovering ? 1.5 : 1
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5
        }}
      />
      
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-bronze/40 pointer-events-none z-50"
        style={{
          x: mousePosition.x - 18,
          y: mousePosition.y - 18
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.5 : 0.2
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 150,
          mass: 0.4,
          delay: 0.01
        }}
      />
    </>
  );
};

export default CustomCursor;