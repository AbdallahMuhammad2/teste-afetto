import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type CursorVariant = 
  | 'default' 
  | 'link' 
  | 'cta' 
  | 'project' 
  | 'gallery' 
  | 'drag';

interface CustomCursorProps {
  variant: CursorVariant;
  onVariantChange?: (variant: CursorVariant) => void;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ variant = 'default', onVariantChange }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  // Precise easing function for smoother motion
  const customEasing = [0.32, 0.75, 0.36, 1];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({
        x: e.clientX,
        y: e.clientY
      });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Event handlers for different elements
    const handleLinkHover = () => {
      onVariantChange?.('link');
    };

    const handleGalleryHover = () => {
      onVariantChange?.('gallery');
    };

    const handleDefaultState = () => {
      onVariantChange?.('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Query selectors for event bindings
    const links = document.querySelectorAll('a, button, [role="button"]');
    const galleries = document.querySelectorAll('.gallery-item');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover);
      link.addEventListener('mouseleave', handleDefaultState);
    });
    
    galleries.forEach(gallery => {
      gallery.addEventListener('mouseenter', handleGalleryHover);
      gallery.addEventListener('mouseleave', handleDefaultState);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHover);
        link.removeEventListener('mouseleave', handleDefaultState);
      });
      
      galleries.forEach(gallery => {
        gallery.removeEventListener('mouseenter', handleGalleryHover);
        gallery.removeEventListener('mouseleave', handleDefaultState);
      });
    };
  }, [onVariantChange, isVisible]);

  // Define cursor variants
  const cursorVariants = {
    default: {
      mixBlendMode: "difference",
      height: 24,
      width: 24,
      backgroundColor: "rgba(255, 255, 255, 0)",
      border: "1px solid rgba(255, 255, 255, 0.8)",
      x: cursorPosition.x - 12,
      y: cursorPosition.y - 12,
      borderRadius: "50%",
      transition: { duration: 0.15, ease: customEasing },
    },
    gallery: {
      mixBlendMode: "color-dodge",
      height: 100,
      width: 100,
      background: "radial-gradient(circle, rgba(212, 183, 152, 0.7) 0%, transparent 80%)",
      x: cursorPosition.x - 50,
      y: cursorPosition.y - 50,
      borderRadius: "50%",
      transition: { duration: 0.2, ease: customEasing },
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
      borderRadius: "50%",
      transition: { duration: 0.2, ease: customEasing },
    },
    link: {
      mixBlendMode: "difference",
      height: 64,
      width: 64,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.8)",
      x: cursorPosition.x - 32,
      y: cursorPosition.y - 32,
      borderRadius: "50%",
      transition: { duration: 0.2, ease: customEasing },
    },
    cta: {
      mixBlendMode: "normal",
      height: 120,
      width: 120,
      background: "radial-gradient(circle, rgba(var(--color-accent-rgb), 0.15) 0%, transparent 70%)",
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(var(--color-accent-rgb), 0.5)",
      x: cursorPosition.x - 60,
      y: cursorPosition.y - 60,
      borderRadius: "50%",
      transition: { duration: 0.2, ease: customEasing },
    },
    drag: {
      height: 80,
      width: 80,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      x: cursorPosition.x - 40,
      y: cursorPosition.y - 40,
      borderRadius: "50%",
      transition: { duration: 0.2, ease: customEasing },
    }
  };

  return (
    <motion.div
      ref={cursorRef}
      className={`fixed z-[100] pointer-events-none hidden md:flex items-center justify-center overflow-hidden ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      variants={cursorVariants}
      initial="default"
      animate={variant}
    >
      {variant === "gallery" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-full w-full flex items-center justify-center"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              ease: "linear" 
            }}
            className="w-14 h-14 rounded-full border border-accent/30"
          />
        </motion.div>
      )}
      
      {variant === "project" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-full w-full flex items-center justify-center"
        >
          <motion.span
            className="text-neutral-900 text-xs font-light tracking-wider uppercase"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, ease: customEasing }}
          >
            Explorar
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CustomCursor;