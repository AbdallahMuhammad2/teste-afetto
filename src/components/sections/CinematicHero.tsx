import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CinematicHeroProps {
  title: string;
  subtitle?: string;
  backgroundSrc: string;
  isVideo?: boolean;
  height?: string;
  children?: React.ReactNode;
}

const CinematicHero: React.FC<CinematicHeroProps> = ({
  title,
  subtitle,
  backgroundSrc,
  isVideo = false,
  height = 'h-screen',
  children
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');
  
  // Parallax effect
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const titleY = useTransform(scrollY, [0, 300], [0, -50]);
  
  // Time-based gradient
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setTimeOfDay('morning');
    else if (hour >= 10 && hour < 17) setTimeOfDay('day');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);
  
  // Determine gradient based on time of day
  const getGradient = () => {
    switch(timeOfDay) {
      case 'morning':
        return 'linear-gradient(to bottom, rgba(227, 183, 125, 0.4), rgba(27, 26, 25, 0.5))';
      case 'day':
        return 'linear-gradient(to bottom, rgba(181, 129, 69, 0.2), rgba(27, 26, 25, 0.5))';
      case 'evening':
        return 'linear-gradient(to bottom, rgba(198, 107, 61, 0.4), rgba(27, 26, 25, 0.6))';
      case 'night':
        return 'linear-gradient(to bottom, rgba(27, 26, 25, 0.7), rgba(181, 129, 69, 0.4))';
    }
  };
  
  return (
    <div ref={heroRef} className={`relative overflow-hidden ${height}`}>
      {/* Background Media */}
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        {isVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover object-center w-full h-full"
          >
            <source src={backgroundSrc} type="video/mp4" />
          </video>
        ) : (
          <motion.img
            src={backgroundSrc}
            alt={title}
            className="object-cover object-center w-full h-full"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOutSine" }}
          />
        )}
        
        {/* Time-adaptive gradient overlay */}
        <div 
          className="absolute inset-0" 
          style={{ background: getGradient() }}
        ></div>
      </motion.div>
      
      {/* Content */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center px-4 text-white"
        style={{ opacity }}
      >
        <motion.div
          className="text-center max-w-4xl"
          style={{ y: titleY }}
        >
          {/* Kinetic typography heading */}
          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-7xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.6, 0.05, -0.01, 0.9], delay: 0.2 }}
          >
            {title.split('').map((char, index) => (
              <motion.span
                key={index}
                className="inline-block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.6, 0.05, -0.01, 0.9], 
                  delay: 0.3 + (index * 0.02) 
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>
          
          {/* Divider */}
          <motion.div
            className="w-24 h-0.5 bg-bronze mx-auto mb-8"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.6, 0.05, -0.01, 0.9], delay: 0.6 }}
          />
          
          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className="font-light text-xl md:text-2xl max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9], delay: 0.8 }}
            >
              {subtitle}
            </motion.p>
          )}
          
          {/* Additional children content */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9], delay: 1 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-0.5 h-16 bg-white/50 relative">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1/3 bg-white" 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CinematicHero;