import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';

interface CustomCursorProps {
  cursorVariant: string;
  cursorPosition: { x: number; y: number };
  hasInteracted: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  cursorVariant,
  cursorPosition,
  hasInteracted,
  isMobile,
  prefersReducedMotion
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Dust particle animation
  useEffect(() => {
    if (prefersReducedMotion || !hasInteracted || !particleCanvasRef.current) return;
    
    const canvas = particleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      angle: number;
    }[] = [];
    
    // Create dust particles
    const createParticles = () => {
      particles = [];
      const particleCount = 15;
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 0.5;
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 20,
          y: canvas.height / 2 + (Math.random() - 0.5) * 20,
          size,
          speed: 0.2 + Math.random() * 0.3,
          opacity: 0.2 + Math.random() * 0.3,
          angle: Math.random() * Math.PI * 2
        });
      }
    };
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.opacity -= 0.005;
        
        if (p.opacity <= 0) {
          particles.splice(index, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(211, 161, 126, ${p.opacity})`;
          ctx.fill();
        }
      });
      
      // Add new particles if needed
      if (particles.length < 5 && Math.random() > 0.95) {
        const numToAdd = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numToAdd; i++) {
          const size = Math.random() * 2 + 0.5;
          particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 20,
            y: canvas.height / 2 + (Math.random() - 0.5) * 20,
            size,
            speed: 0.2 + Math.random() * 0.3,
            opacity: 0.2 + Math.random() * 0.3,
            angle: Math.random() * Math.PI * 2
          });
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    createParticles();
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [hasInteracted, prefersReducedMotion, cursorPosition]);
  
  if (isMobile || prefersReducedMotion) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        ref={cursorRef}
        className="fixed z-[100] pointer-events-none hidden md:flex items-center justify-center overflow-hidden"
        variants={{
          default: { 
            mixBlendMode: "difference",
            height: 24, 
            width: 24, 
            backgroundColor: "rgba(255, 255, 255, 0)", 
            border: "1px solid rgba(255, 255, 255, 0.8)",
            x: cursorPosition.x - 12,
            y: cursorPosition.y - 12,
            borderRadius: "50%"
          },
          project: { 
            mixBlendMode: "normal",
            height: 120, 
            width: 120, 
            backgroundColor: "rgba(var(--color-accent-rgb), 0.05)", 
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(var(--color-accent-rgb), 0.3)",
            x: cursorPosition.x - 60,
            y: cursorPosition.y - 60,
            borderRadius: "50%"
          },
          link: {
            mixBlendMode: "difference",
            height: 64, 
            width: 64, 
            backgroundColor: "rgba(255, 255, 255, 0.1)", 
            border: "1px solid rgba(211, 161, 126, 0.4)", // Using the exact color specified
            x: cursorPosition.x - 32,
            y: cursorPosition.y - 32,
            borderRadius: "50%"
          },
          cta: { 
            mixBlendMode: "normal",
            height: 120, 
            width: 120, 
            // Radial gradient as specified
            background: "radial-gradient(circle, rgba(var(--color-accent-rgb), 0.15) 0%, transparent 70%)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(var(--color-accent-rgb), 0.5)",
            x: cursorPosition.x - 60,
            y: cursorPosition.y - 60,
            borderRadius: "50%"
          },
          drag: {
            mixBlendMode: "difference",
            height: 100, 
            width: 100, 
            backgroundColor: "rgba(255, 255, 255, 0.05)", 
            border: "1px solid rgba(255, 255, 255, 0.8)",
            x: cursorPosition.x - 50,
            y: cursorPosition.y - 50,
            borderRadius: "50%"
          }
        }}
        initial="default"
        animate={cursorVariant}
        transition={{ 
          type: "spring", 
          stiffness: 220, 
          damping: 20, 
          mass: 1
        }}
      >
        {/* Dust particle canvas */}
        <canvas 
          ref={particleCanvasRef}
          className="absolute inset-0 opacity-80 mix-blend-overlay" 
          width="120" 
          height="120"
          style={{ display: hasInteracted ? 'block' : 'none' }}
        />
        
        {/* Contextual content based on cursor state */}
        {cursorVariant === "project" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full w-full flex flex-col items-center justify-center relative"
          >
            <motion.span 
              className="text-neutral-900 text-xs font-light tracking-[0.2em] uppercase mb-1"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Explorar
            </motion.span>
            <motion.div 
              className="w-7 h-7 flex items-center justify-center border border-accent/40 rounded-full bg-white/5 backdrop-blur-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Plus size={12} className="text-accent" />
            </motion.div>
          </motion.div>
        )}
        
        {cursorVariant === "cta" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full w-full flex flex-col items-center justify-center relative"
          >
            <motion.div 
              className="w-8 h-8 flex items-center justify-center border border-accent/40 rounded-full bg-white/5 backdrop-blur-sm"
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                rotate: [0, 90],
              }}
              transition={{ 
                scale: { delay: 0.2 },
                rotate: { duration: 1.5, ease: "circOut" }
              }}
            >
              <ArrowRight size={14} className="text-accent" />
            </motion.div>
          </motion.div>
        )}
        
        {cursorVariant === "drag" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                x: [-5, 5, -5],
                transition: { 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
              className="flex items-center gap-x-2"
            >
              <ArrowRight size={14} className="text-white" />
              <ArrowRight size={14} className="text-white" />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomCursor;