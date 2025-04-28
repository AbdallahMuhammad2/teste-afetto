'use client';

import { useState, useEffect, RefObject } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

interface MagneticOptions {
  strength?: number;
  damping?: number;
  stiffness?: number;
  restDelta?: number;
}

export const useMagnetic = (
  ref: RefObject<HTMLElement>, 
  options: MagneticOptions = {}
) => {
  const {
    strength = 20,
    damping = 30,
    stiffness = 400,
    restDelta = 0.001
  } = options;
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Use springs for smooth animation
  const springX = useSpring(x, { damping, stiffness, restDelta });
  const springY = useSpring(y, { damping, stiffness, restDelta });
  
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!active) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Scale the movement by strength factor
      x.set(distanceX / strength);
      y.set(distanceY / strength);
    };
    
    const handleMouseEnter = () => {
      setActive(true);
    };
    
    const handleMouseLeave = () => {
      setActive(false);
      x.set(0);
      y.set(0);
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, active, x, y, strength]);
  
  // Return properties to apply to the motion component
  return {
    magneticProps: {
      style: { x: springX, y: springY }
    }
  };
};

export default useMagnetic;