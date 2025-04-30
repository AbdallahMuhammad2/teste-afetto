import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';

type CursorVariant = 'default' | 'text' | 'link' | 'project' | 'cta' | 'drag' | 'video';

interface PremiumCursorProps {
  prefersReducedMotion: boolean;
  language: 'pt' | 'es';
}

const PremiumCursor: React.FC<PremiumCursorProps> = ({ 
  prefersReducedMotion,
  language
}) => {
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [projectName, setProjectName] = useState<string | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Premium spring physics for ultra-smooth following
  const springConfig = { damping: 25, stiffness: 180, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Track visibility of cursor
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isCursorVisible) setIsCursorVisible(true);
    };
    
    const handleMouseLeave = () => setIsCursorVisible(false);
    const handleMouseEnter = () => setIsCursorVisible(true);
    
    // Set up cursor variant event listeners
    const handleElementMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('[data-cursor="text"]')) {
        setCursorVariant('text');
      } else if (target.closest('[data-cursor="link"]')) {
        setCursorVariant('link');
      } else if (target.closest('[data-cursor="project"]')) {
        setCursorVariant('project');
        setProjectName(target.closest('[data-cursor="project"]')?.getAttribute('data-project-name') || null);
      } else if (target.closest('[data-cursor="cta"]')) {
        setCursorVariant('cta');
      } else if (target.closest('[data-cursor="drag"]')) {
        setCursorVariant('drag');
      } else if (target.closest('[data-cursor="video"]')) {
        setCursorVariant('video');
      } else {
        setCursorVariant('default');
        setProjectName(null);
      }
    };
    
    const handleElementMouseLeave = () => {
      setCursorVariant('default');
      setProjectName(null);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Add delegate event listeners for cursor variants
    document.addEventListener('mouseenter', handleElementMouseEnter, true);
    document.addEventListener('mouseleave', handleElementMouseLeave, true);
    
    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseenter', handleElementMouseEnter, true);
      document.removeEventListener('mouseleave', handleElementMouseLeave, true);
    };
  }, [mouseX, mouseY, isCursorVisible, prefersReducedMotion]);
  
  // Premium cursor variants with sophisticated styling
  const cursorVariants = {
    default: { 
      mixBlendMode: "difference",
      height: 24, 
      width: 24, 
      backgroundColor: "rgba(255, 255, 255, 0)", 
      border: "1px solid rgba(255, 255, 255, 0.8)",
      opacity: isCursorVisible ? 1 : 0,
      x: -12,
      y: -12
    },
    text: {
      mixBlendMode: "difference",
      height: 60, 
      width: 60, 
      backgroundColor: "rgba(255, 255, 255, 0.05)", 
      border: "1px solid rgba(255, 255, 255, 0.5)",
      opacity: isCursorVisible ? 1 : 0,
      x: -30,
      y: -30
    },
    link: {
      mixBlendMode: "difference",
      height: 80, 
      width: 80, 
      backgroundColor: "rgba(255, 255, 255, 0.1)", 
      border: "1px solid rgba(255, 255, 255, 0.8)",
      opacity: isCursorVisible ? 1 : 0,
      x: -40,
      y: -40
    },
    project: { 
      mixBlendMode: "normal",
      height: 140, 
      width: 140, 
      backgroundColor: "rgba(var(--color-accent-rgb), 0.05)", 
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(var(--color-accent-rgb), 0.3)",
      opacity: isCursorVisible ? 1 : 0,
      x: -70,
      y: -70
    },
    cta: { 
      mixBlendMode: "normal",
      height: 140, 
      width: 140, 
      background: "radial-gradient(circle at center, rgba(var(--color-accent-rgb), 0.15) 0%, rgba(var(--color-accent-rgb), 0.08) 40%, transparent 70%)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(var(--color-accent-rgb), 0.5)",
      opacity: isCursorVisible ? 1 : 0,
      x: -70,
      y: -70
    },
    drag: {
      mixBlendMode: "difference",
      height: 120, 
      width: 120, 
      backgroundColor: "rgba(255, 255, 255, 0.05)", 
      border: "1px solid rgba(255, 255, 255, 0.8)",
      opacity: isCursorVisible ? 1 : 0,
      x: -60,
      y: -60
    },
    video: {
      mixBlendMode: "normal",
      height: 80, 
      width: 80, 
      backgroundColor: "rgba(255, 255, 255, 0.15)", 
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      opacity: isCursorVisible ? 1 : 0,
      x: -40,
      y: -40
    }
  };
  
  if (prefersReducedMotion) return null;
  
  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      variants={cursorVariants}
      animate={cursorVariant}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 180,
        mass: 0.1
      }}
    >
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
            {language === 'pt' ? 'Explorar' : 'Explorar'}
          </motion.span>
          
          {projectName && (
            <motion.span 
              className="text-neutral-900 text-xs font-light tracking-[0.05em] opacity-70 mb-3"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              transition={{ delay: 0.2 }}
            >
              {projectName}
            </motion.span>
          )}
          
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
            className="w-10 h-10 flex items-center justify-center border border-accent/40 rounded-full bg-white/5 backdrop-blur-sm"
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
              x: [-10, 10, -10],
              transition: { 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }
            }}
            className="flex items-center"
          >
            <svg width="40" height="8" viewBox="0 0 40 8" fill="none" stroke="white" strokeWidth="0.5">
              <path d="M0 4H40" />
              <path d="M37 1L40 4L37 7" />
              <path d="M3 1L0 4L3 7" />
            </svg>
          </motion.div>
        </motion.div>
      )}
      
      {cursorVariant === "video" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-full w-full flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <motion.path 
              d="M6 4h12v16H6z" 
              fill="none" 
              stroke="white" 
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.path 
              d="M10 9l5 3-5 3z" 
              fill="white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PremiumCursor;