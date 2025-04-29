import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../../data/translations';

interface CustomCursorProps {
  cursorPosition: { x: number; y: number };
  cursorVariant: string;
  language: string;
}

// Cursor variants
const cursorVariants = {
  default: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    x: 0,
    y: 0,
  },
  text: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(var(--color-accent-rgb), 0.03)',
    border: '1px solid rgba(var(--color-accent-rgb), 0.1)',
    mixBlendMode: 'difference',
  },
  project: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(var(--color-accent-rgb), 0.1)',
    border: '1px solid rgba(var(--color-accent-rgb), 0.2)',
  },
  cta: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(var(--color-accent-rgb), 0.15)',
    border: '2px dashed rgba(var(--color-accent-rgb), 0.6)',
  },
  magnet: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  sparkle: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(var(--color-accent-rgb), 0.2)',
    border: '1px solid rgba(var(--color-accent-rgb), 0.4)',
  },
  drag: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  }
};

const CustomCursor: React.FC<CustomCursorProps> = ({ 
  cursorPosition, 
  cursorVariant, 
  language 
}) => {
  const t = translations[language];
  const cursorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const [sparkleActive, setSparkleActive] = useState(false);
  const magnetTargetRef = useRef<HTMLElement | null>(null);
  const magnetPositionRef = useRef({ x: 0, y: 0 });
  
  // Handle magnetic effect
  useEffect(() => {
    if (cursorVariant !== 'magnet') return;
    
    const handleMagneticEffect = () => {
      const magnetElements = document.querySelectorAll('[data-magnetic]');
      
      magnetElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Distance from cursor to element center
        const distanceX = cursorPosition.x - centerX;
        const distanceY = cursorPosition.y - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // If cursor is close to the element
        if (distance < 200) {
          magnetTargetRef.current = element as HTMLElement;
          
          // Calculate magnetic pull (stronger as cursor gets closer)
          const pull = 0.4 - Math.min(distance / 1000, 0.3);
          const targetX = distanceX * pull;
          const targetY = distanceY * pull;
          
          // Apply magnetic effect to element with smooth interpolation
          magnetPositionRef.current.x += (targetX - magnetPositionRef.current.x) * 0.2;
          magnetPositionRef.current.y += (targetY - magnetPositionRef.current.y) * 0.2;
          
          element.setAttribute('style', `
            transform: translate(${magnetPositionRef.current.x}px, ${magnetPositionRef.current.y}px) scale(1.03);
            transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
          `);
        } else if (magnetTargetRef.current === element) {
          // Reset element position when cursor moves away
          element.setAttribute('style', `
            transform: translate(0, 0);
            transition: transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1);
          `);
          magnetTargetRef.current = null;
        }
      });
    };
    
    window.requestAnimationFrame(handleMagneticEffect);
    const interval = setInterval(handleMagneticEffect, 50);
    
    return () => {
      clearInterval(interval);
      if (magnetTargetRef.current) {
        magnetTargetRef.current.setAttribute('style', '');
      }
    };
  }, [cursorPosition, cursorVariant]);
  
  // Handle sparkle effect
  useEffect(() => {
    if (cursorVariant !== 'sparkle' || !particlesRef.current) return;
    
    const canvas = particlesRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particles array
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      color: string;
    }[] = [];
    
    // Create sparkle particles
    const createSparkles = () => {
      if (!sparkleActive) return;
      
      const colors = [
        `rgba(var(--color-accent-rgb), 0.8)`,
        `rgba(var(--color-accent-rgb), 0.6)`,
        'rgba(255, 255, 255, 0.8)'
      ];
      
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: cursorPosition.x,
          y: cursorPosition.y,
          size: Math.random() * 4 + 1,
          speedX: Math.random() * 6 - 3,
          speedY: Math.random() * 6 - 3,
          alpha: 0.8,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    
    // Animate particles
    const animateParticles = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= 0.02;
        
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      requestAnimationFrame(animateParticles);
    };
    
    // Start animation
    setSparkleActive(true);
    const sparkleInterval = setInterval(createSparkles, 50);
    animateParticles();
    
    return () => {
      setSparkleActive(false);
      clearInterval(sparkleInterval);
    };
  }, [cursorVariant, cursorPosition, sparkleActive]);
  
  // Get cursor text based on variant
  const getCursorText = () => {
    switch (cursorVariant) {
      case 'project':
        return t.cursor?.view || 'View';
      case 'cta':
        return t.cursor?.explore || 'Explore';
      case 'drag':
        return '↕';
      default:
        return '';
    }
  };
  
  return (
    <AnimatePresence>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full flex items-center justify-center"
        animate={{
          ...cursorVariants[cursorVariant as keyof typeof cursorVariants] || cursorVariants.default,
          x: cursorPosition.x - (cursorVariants[cursorVariant as keyof typeof cursorVariants]?.width || 32) / 2,
          y: cursorPosition.y - (cursorVariants[cursorVariant as keyof typeof cursorVariants]?.height || 32) / 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 550,
          damping: 28,
          mass: 0.5
        }}
      >
        {/* Cursor text */}
        {['project', 'cta', 'drag'].includes(cursorVariant) && (
          <motion.span 
            className="text-xs font-medium tracking-wide opacity-90"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {getCursorText()}
          </motion.span>
        )}
      </motion.div>
      
      {/* Sparkle effect canvas */}
      {cursorVariant === 'sparkle' && (
        <canvas
          ref={particlesRef}
          className="fixed inset-0 pointer-events-none z-40"
        />
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;