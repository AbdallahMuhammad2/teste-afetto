import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedCursorProps {
  cursorPosition: { x: number; y: number };
  cursorVariant: string;
  language: string;
}

const EnhancedCursor: React.FC<EnhancedCursorProps> = ({ 
  cursorPosition, 
  cursorVariant, 
  language 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const magnetTargetRef = useRef<HTMLElement | null>(null);
  const [showSparkle, setShowSparkle] = useState(false);
  
  // Particle class for sparkle effect
  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    alpha: number;
    color: string;
    
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.speedX = Math.cos(angle) * speed;
      this.speedY = Math.sin(angle) * speed;
      this.alpha = 1;
      
      // Get accent color from CSS variable
      const computedStyle = getComputedStyle(document.documentElement);
      const rgbValues = computedStyle.getPropertyValue('--color-accent-rgb').split(',');
      this.color = rgbValues.length === 3 
        ? `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${this.alpha})`
        : `rgba(222, 109, 71, ${this.alpha})`;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.02;
      
      // Update color with new alpha
      const rgba = this.color.split(',');
      rgba[3] = `${this.alpha})`;
      this.color = rgba.join(',');
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
  
  // Setup sparkle animation
  useEffect(() => {
    if (!canvasRef.current || !showSparkle) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Match canvas size to cursor
    canvasRef.current.width = 150;
    canvasRef.current.height = 150;
    
    // Create particles
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push(new Particle(centerX, centerY));
    }
    
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      if (particlesRef.current.length === 0) {
        setShowSparkle(false);
        return;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showSparkle]);
  
  // Magnetic cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Find any element with data-magnetic attribute
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (target?.hasAttribute('data-magnetic')) {
        magnetTargetRef.current = target as HTMLElement;
      } else {
        magnetTargetRef.current = null;
      }
    };
    
    // Add sparkles on click
    const handleClick = () => {
      setShowSparkle(true);
      particlesRef.current = [];
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);
  
  // Calculate cursor position with magnetic effect
  const getCursorPosition = () => {
    if (magnetTargetRef.current) {
      const rect = magnetTargetRef.current.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      
      // Pull cursor towards the magnetic element
      const pullStrength = 0.4; // Adjust for stronger/weaker effect
      const deltaX = targetCenterX - cursorPosition.x;
      const deltaY = targetCenterY - cursorPosition.y;
      
      return {
        x: cursorPosition.x + deltaX * pullStrength,
        y: cursorPosition.y + deltaY * pullStrength
      };
    }
    
    return cursorPosition;
  };
  
  const adjustedPosition = getCursorPosition();
  
  // Setup variants with improved aesthetics
  const variants = {
    default: { 
      height: 24, 
      width: 24, 
      backgroundColor: "rgba(255, 255, 255, 0)", 
      border: "1.5px solid rgba(255, 255, 255, 0.8)",
      borderRadius: "50%",
      x: adjustedPosition.x - 12,
      y: adjustedPosition.y - 12,
    },
    project: { 
      height: 80, 
      width: 80, 
      backgroundColor: "rgba(var(--color-accent-rgb), 0.9)", 
      border: "none",
      borderRadius: "50%",
      x: adjustedPosition.x - 40,
      y: adjustedPosition.y - 40,
    },
    link: {
      height: 48, 
      width: 48, 
      backgroundColor: "rgba(var(--color-accent-rgb), 0.2)", 
      border: "1.5px solid rgba(var(--color-accent-rgb), 0.6)",
      borderRadius: "50%",
      x: adjustedPosition.x - 24,
      y: adjustedPosition.y - 24,
    },
    text: {
      height: 100, 
      width: 100, 
      backgroundColor: "rgba(var(--color-accent-rgb), 0.07)", 
      mixBlendMode: "normal",
      border: "1px solid rgba(var(--color-accent-rgb), 0.2)",
      borderRadius: "50%",
      x: adjustedPosition.x - 50,
      y: adjustedPosition.y - 50,
    },
    magnet: {
      height: 48, 
      width: 48, 
      backgroundColor: "rgba(var(--color-accent-rgb), 0.3)", 
      border: "none",
      borderRadius: "50%",
      filter: "blur(4px)",
      x: adjustedPosition.x - 24,
      y: adjustedPosition.y - 24,
    },
    sparkle: {
      height: 24, 
      width: 24, 
      backgroundColor: "rgba(255, 255, 255, 0.9)", 
      border: "none",
      borderRadius: "50%",
      x: adjustedPosition.x - 12,
      y: adjustedPosition.y - 12,
      boxShadow: "0 0 20px 6px rgba(var(--color-accent-rgb), 0.6)"
    }
  };
  
  // Determine the active variant
  const activeVariant = magnetTargetRef.current ? "magnet" : cursorVariant;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed w-6 h-6 pointer-events-none z-[100] mix-blend-difference rounded-full hidden md:flex items-center justify-center"
        variants={variants}
        initial="default"
        animate={activeVariant}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          mass: 0.8
        }}
      >
        {/* Center content for project variant */}
        {cursorVariant === "project" && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-black text-sm font-light tracking-wide"
          >
            {language === 'pt' ? 'Ver' : 'Ver'}
          </motion.span>
        )}
        
        {/* Center content for text variant */}
        {cursorVariant === "text" && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-black text-[10px] uppercase tracking-wider font-light"
          >
            {language === 'pt' ? 'Ler' : 'Leer'}
          </motion.span>
        )}
        
        {/* Sparkle effect canvas */}
        {showSparkle && (
          <canvas
            ref={canvasRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] pointer-events-none"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedCursor;