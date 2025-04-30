import React, { useState, useEffect } from 'react';
import { motion, useTransform, useScroll, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  videoSrc: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  onCtaHover: (hover: boolean) => void;
  scrollToNextSection: () => void;
  language: 'pt' | 'es';
}

const HeroSection: React.FC<HeroSectionProps> = ({
  videoSrc,
  title,
  subtitle,
  ctaText,
  ctaLink,
  onCtaHover,
  scrollToNextSection,
  language
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Refined scroll animations
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 400], [0, 100]);
  
  // Smoother spring physics
  const smoothHeroY = useSpring(heroY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.section 
      className="relative h-screen w-full overflow-hidden bg-black"
      style={{ 
        opacity: heroOpacity,
        y: smoothHeroY,
        scale: heroScale
      }}
    >
      {/* Premium video background with layered approach */}
      <div className="absolute inset-0 z-0">
        {/* Loading state with elegant animation */}
        <motion.div 
          className="absolute inset-0 z-50 bg-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: videoLoaded ? 0 : 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative w-24 h-24"
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: videoLoaded ? 0 : [0.3, 0.7, 0.3],
              rotate: videoLoaded ? 45 : 0
            }}
            transition={{ 
              opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              rotate: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
            }}
          >
            <motion.div className="absolute inset-0">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  stroke="rgba(var(--color-accent-rgb), 0.8)" 
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: videoLoaded ? 0 : 1 }}
                  transition={{ 
                    duration: 2, 
                    ease: "easeInOut", 
                    repeat: Infinity
                  }}
                />
              </svg>
            </motion.div>
            
            <motion.div 
              className="absolute inset-0 flex items-center justify-center text-accent text-xs uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: videoLoaded ? 0 : [0, 1, 0] }}
              transition={{ 
                duration: 2.5, 
                ease: "easeInOut", 
                repeat: Infinity,
                delay: 0.5
              }}
            >
              {language === 'pt' ? 'Carregando' : 'Cargando'}
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Premium video treatment */}
        <motion.div
          className="w-full h-full"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="w-full h-full object-cover"
            poster="/images/hero-poster.webp"
            preload="auto"
          >
            <source src={`${videoSrc}.webm`} type="video/webm" />
            <source src={`${videoSrc}.mp4`} type="video/mp4" />
          </video>
          
          {/* Sophisticated layered overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-transparent opacity-70"></div>
          
          {/* High-end film grain overlay */}
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{ 
              backgroundImage: 'url(/images/film-grain-heavy.png)', 
              backgroundSize: '400px' 
            }}
          ></div>
          
          {/* Premium vignette effect */}
          <div className="absolute inset-0 rounded-[50%/10%] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none"></div>
        </motion.div>
      </div>
      
      {/* Luxury accent elements */}
      <div className="absolute inset-0 z-10">
        {/* Elegant grid */}
        <div className="grid grid-cols-12 h-full w-full">
          {Array(12).fill(0).map((_, i) => (
            <div key={`grid-col-${i}`} className="h-full border-l border-white/5 last:border-r"></div>
          ))}
        </div>
        
        {/* Sophisticated vertical lines with animation */}
        <motion.div 
          className="absolute top-[15vh] left-[15%] w-px h-[40vh]"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: hasAnimated ? 1 : 0 }}
          transition={{ duration: 1.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            transformOrigin: 'top',
            background: 'linear-gradient(to bottom, transparent, rgba(var(--color-accent-rgb), 0.5), transparent)'
          }}
        />
        
        <motion.div 
          className="absolute bottom-[15vh] right-[15%] w-px h-[40vh]"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: hasAnimated ? 1 : 0 }}
          transition={{ duration: 1.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            transformOrigin: 'bottom',
            background: 'linear-gradient(to top, transparent, rgba(var(--color-accent-rgb), 0.5), transparent)'
          }}
        />
        
        {/* Premium geometric decorative element */}
        <motion.div 
          className="absolute top-[10%] right-[10%] w-[250px] h-[250px] opacity-10 hidden lg:block pointer-events-none"
          initial={{ opacity: 0, scale: 0.9, rotate: 45 }}
          animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
          transition={{ duration: 2.5, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.circle 
              cx="50" cy="50" r="45" 
              stroke="white" 
              strokeWidth="0.15" 
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: hasAnimated ? 1 : 0 }}
              transition={{ duration: 3, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path 
              d="M15,50 H85 M50,15 V85" 
              stroke="white" 
              strokeWidth="0.15"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: hasAnimated ? 1 : 0 }}
              transition={{ duration: 2.5, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </motion.div>
        
        {/* Bottom geometric element */}
        <motion.div 
          className="absolute bottom-[8%] left-[10%] w-[350px] h-[1px] opacity-20 hidden lg:block pointer-events-none"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hasAnimated ? 1 : 0 }}
          transition={{ duration: 2, delay: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            transformOrigin: 'left',
            background: 'linear-gradient(to right, rgba(var(--color-accent-rgb), 0.8), transparent)'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container mx-auto px-8 md:px-16">
          <div className="max-w-5xl mx-auto">
            {/* Refined typography with sophisticated animation */}
            <div className="overflow-hidden mb-6">
              <motion.p
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-light text-accent tracking-[0.25em] uppercase text-sm md:text-base mb-8"
              >
                {language === 'pt' ? 'Ateliê de Design' : 'Atelier de Diseño'}
              </motion.p>
              
              {/* Premium character-by-character animation */}
              <h1 className="font-serif text-5xl md:text-7xl xl:text-[7.5rem] leading-[0.95] tracking-[-0.02em] text-white max-w-[18ch]">
                {title.split('').map((char, index) => (
                  <motion.span
                    key={`char-${index}`}
                    className="inline-block"
                    initial={{ y: 150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 1.5,
                      delay: 0.8 + (index * 0.02),
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    style={{ 
                      display: char === ' ' ? 'inline' : 'inline-block',
                      whiteSpace: char === ' ' ? 'pre' : 'normal'
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
            </div>
            
            {/* Elegant subtitle with refined animation */}
            <motion.div 
              className="relative overflow-hidden mt-12 md:mt-16 max-w-2xl border-l-2 border-accent/30 pl-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-white/80 text-lg md:text-xl lg:text-2xl leading-relaxed font-extralight tracking-wide">
                {subtitle.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-[0.25em]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 1.8 + (index * 0.05),
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </motion.div>
            
            {/* Premium CTA with sophisticated hover effects */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 md:mt-20"
            >
              <Link 
                to={ctaLink} 
                className="group inline-block relative"
                onMouseEnter={() => onCtaHover(true)}
                onMouseLeave={() => onCtaHover(false)}
              >
                <div className="relative overflow-hidden border border-accent/40 pl-8 pr-20 py-6 flex items-center gap-x-8">
                  {/* Elegant number design */}
                  <span className="relative z-10 text-accent/80 font-serif text-xl tracking-widest group-hover:text-accent transition-colors duration-700">
                    01
                  </span>
                  
                  {/* Animated line separator */}
                  <motion.div 
                    className="h-[20px] w-[1px] bg-accent/30 group-hover:bg-accent/50"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                  
                  <span className="relative z-10 text-white/90 text-lg tracking-wide">
                    {ctaText}
                  </span>
                  
                  {/* Arrow with premium animation */}
                  <motion.div 
                    className="absolute right-8 z-10"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2.6, duration: 0.8 }}
                  >
                    <motion.div
                      animate={{ x: [0, 8, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2.5, 
                        ease: "easeInOut", 
                        repeatDelay: 0.5 
                      }}
                      className="text-accent group-hover:translate-x-2 transition-transform duration-300"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </motion.div>
                  
                  {/* Elegant hover backdrop */}
                  <motion.div 
                    className="absolute inset-0 bg-accent/5 z-0"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1, originX: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                
                {/* Premium corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/50 group-hover:border-accent/80 transition-colors duration-500"/>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/50 group-hover:border-accent/80 transition-colors duration-500"/>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Premium scroll indicator */}
      <motion.div 
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.8 }}
      >
        <div className="uppercase tracking-[0.3em] text-white/60 text-[10px] font-extralight mb-4">
          {language === 'pt' ? 'Explore' : 'Explore'}
        </div>
        <button 
          onClick={scrollToNextSection}
          className="relative group"
        >
          <motion.div 
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center overflow-hidden"
            whileHover={{ borderColor: 'rgba(var(--color-accent-rgb), 0.5)' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "easeInOut",
                repeatDelay: 0.5
              }}
              className="text-white/70 group-hover:text-accent transition-colors duration-300"
            >
              <ArrowDown size={14} />
            </motion.div>
          </motion.div>
        </button>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;