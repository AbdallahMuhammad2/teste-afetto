import React, { useContext, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import LanguageContext from '../../context/LanguageContext';
import { translations } from '../../data/translations';
import HeroCanvas from '../effects/HeroCanvas';
import useTimeOfDay from '../../hooks/useTimeOfDay';
import * as micro from '../../utils/micro';
import ScrollParticles from '../effects/ScrollParticles';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
  setCursorVariant: (variant: string) => void;
  userName?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  heroRef, 
  setCursorVariant,
  userName
}) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const { accentTint, partOfDay, timeBasedOpacity } = useTimeOfDay();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Enhanced scroll tracking for parallax
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Smoother spring physics
  const smoothHeroProgress = useSpring(heroScrollProgress, {
    stiffness: 65,
    damping: 25,
    restDelta: 0.0005
  });
  
  // Parallax transformations
  const heroOpacity = useTransform(smoothHeroProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(smoothHeroProgress, [0, 1], [0, 180]);
  const heroScale = useTransform(smoothHeroProgress, [0, 0.5], [1, 0.92]);
  const titleY = useTransform(smoothHeroProgress, [0, 0.5], [0, -30]);
  
  // Text animation with SplitText-like functionality
  useEffect(() => {
    if (!titleRef.current) return;
    
    // Set mounted state
    setIsMounted(true);
    
    // Only run client-side
    if (typeof window === 'undefined') return;
    
    // Get title element and text
    const titleElement = titleRef.current;
    const titleText = titleElement.textContent || '';
    
    // Clear the title element
    titleElement.textContent = '';
    
    // Split text into words
    const words = titleText.trim().split(' ');
    
    // Create word spans
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word inline-block mr-[0.25em] overflow-hidden';
      
      // Split word into characters
      const chars = word.split('');
      chars.forEach((char, charIndex) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char inline-block origin-bottom';
        charSpan.textContent = char;
        charSpan.style.animation = `fadeInUp 0.6s forwards`;
        charSpan.style.animationDelay = `${wordIndex * 0.06 + charIndex * 0.03}s`;
        wordSpan.appendChild(charSpan);
      });
      
      titleElement.appendChild(wordSpan);
    });
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(40px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [language, userName]);
  
  // Handle smooth scroll on click
  const scrollToNext = () => {
    const nextSection = heroRef.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Get personalized or default title
  const getTitle = () => {
    if (userName && (t.hero as any).titlePersonalized) {
      return (t.hero as any).titlePersonalized.replace('{name}', userName);
    }
    return t.hero.title;
  };
  
  return (
    <motion.section 
      ref={heroRef}
      style={{ 
        opacity: heroOpacity, 
        y: heroY, 
        scale: heroScale 
      }}
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* 3D Background with time-aware settings */}
      <HeroCanvas 
        accentColor={accentTint}
        bloomIntensity={partOfDay === 'night' ? 0.8 : 0.6}
        aberrationStrength={0.005}
      />
      
      {/* Overlay gradient based on time of day */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" 
        style={{ opacity: timeBasedOpacity }}
      />
      
      {/* Content overlay with advanced animations */}
      <div className="relative container mx-auto px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: micro.EASING.emphasized }}
          className="max-w-3xl"
        >
          {/* Animated title with SplitText effect */}
          <motion.h1 
            ref={titleRef}
            className="text-white mb-6"
            style={{ y: titleY }}
          >
            {isMounted ? '' : getTitle()}
          </motion.h1>
          
          {/* Subtitle with follow-up animation */}
          <motion.p 
            className="text-lg md:text-xl text-white/80 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: micro.EASING.emphasized }}
          >
            {t.hero.subtitle}
          </motion.p>
          
          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease: micro.EASING.emphasized }}
          >
            <motion.button
              className="btn-primary group relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setCursorVariant('cta')}
              onMouseLeave={() => setCursorVariant('default')}
              data-magnetic
            >
              <span className="relative z-10">{t.hero.cta}</span>
              
              {/* Button shine effect */}
              <motion.span 
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 1, ease: micro.EASING.standard }}
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)'
                }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.button
            onClick={scrollToNext}
            className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300"
            aria-label="Scroll down"
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            {...micro.hoverLift(4, 15)}
          >
            <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
            <ScrollParticles />
            <motion.div
              animate={{
                y: [0, 8, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity
              }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;