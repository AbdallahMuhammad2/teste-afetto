import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  subtitle,
  buttonText,
  buttonUrl,
  backgroundImage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(false);
  
  // Set dark/light mode based on user's time
  useEffect(() => {
    const hours = new Date().getHours();
    setIsDark(hours < 7 || hours > 19);
  }, []);
  
  // Parallax effect on scroll
  useEffect(() => {
    if (!containerRef.current) return;
    
    const parallaxEffect = () => {
      if (!containerRef.current) return;
      
      const scrollPosition = window.scrollY;
      const element = containerRef.current;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Only apply effect when element is in viewport
      if (
        scrollPosition + viewportHeight > elementTop &&
        scrollPosition < elementTop + elementHeight
      ) {
        const distance = scrollPosition + viewportHeight - elementTop;
        const percentage = Math.min(distance / (viewportHeight + elementHeight), 1);
        
        // Apply transform to background
        element.style.backgroundPositionY = `${percentage * 30}%`;
      }
    };
    
    window.addEventListener('scroll', parallaxEffect);
    
    // Initial calculation
    parallaxEffect();
    
    return () => {
      window.removeEventListener('scroll', parallaxEffect);
    };
  }, []);
  
  // Magnetic button effect
  useEffect(() => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    
    const magneticEffect = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      
      const rect = button.getBoundingClientRect();
      const buttonX = rect.left + rect.width / 2;
      const buttonY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse to button center
      const distanceX = e.clientX - buttonX;
      const distanceY = e.clientY - buttonY;
      
      // Calculate distance
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const maxDistance = Math.max(rect.width, rect.height) * 0.8;
      
      // Only apply magnetic effect when close enough
      if (distance < maxDistance) {
        // Calculate magnetic pull (stronger when closer)
        const pull = 1 - distance / maxDistance;
        const moveX = distanceX * pull * 0.3;
        const moveY = distanceY * pull * 0.3;
        
        setButtonPosition({ x: moveX, y: moveY });
      } else {
        setButtonPosition({ x: 0, y: 0 });
      }
    };
    
    const resetPosition = () => {
      setButtonPosition({ x: 0, y: 0 });
    };
    
    document.addEventListener('mousemove', magneticEffect);
    button.addEventListener('mouseleave', resetPosition);
    
    return () => {
      document.removeEventListener('mousemove', magneticEffect);
      button.removeEventListener('mouseleave', resetPosition);
    };
  }, []);
  
  return (
    <div
      ref={containerRef}
      className={`relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat transition-colors duration-1000 ${
        isDark ? 'text-white' : 'text-carbon'
      }`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay with wood texture */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isDark ? 'bg-black/60' : 'bg-white/60'
        }`}
      >
        {/* Optional wood grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ 
            backgroundImage: "url('/textures/wood-grain.png')",
            backgroundSize: "500px"
          }}
        ></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-24 text-center md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-6 max-w-4xl font-serif text-3xl font-normal tracking-tight md:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h2>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg opacity-90 md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
        
        <motion.div
          ref={buttonRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="inline-block overflow-hidden"
        >
          <motion.a
            href={buttonUrl}
            style={{ x: buttonPosition.x, y: buttonPosition.y }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10 
            }}
            className={`group relative inline-flex items-center overflow-hidden rounded px-8 py-4 text-lg font-medium transition-all duration-300 ${
              isDark 
                ? 'bg-white text-carbon hover:bg-bronze hover:text-white' 
                : 'bg-bronze text-white hover:bg-bronze-dark'
            }`}
          >
            <span className="relative z-10">{buttonText}</span>
            <ArrowRight className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1" size={18} />
            
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 -z-10 bg-opacity-80"
              initial={{ x: "100%", opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.6, 0.05, -0.01, 0.9] }}
            />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default CallToAction;