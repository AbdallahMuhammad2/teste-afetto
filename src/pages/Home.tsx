import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  motion, useScroll, useTransform, AnimatePresence, useSpring, 
  MotionValue, useMotionTemplate, useMotionValueEvent, useInView 
} from 'framer-motion';
import { ChevronRight, ArrowRight, ArrowDown, Plus, Circle, X, ExternalLink } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import Icon from '../components/ui/Icon';
import { translations } from '../data/translations';
import { projects } from '../data/projects';
import ProjectsGrid from '../components/ProjectsGrid';
import { useLenis } from '@studio-freight/react-lenis';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { blendColor } from '../utils/color';

// Enhanced parallax effect with variable intensity
const useParallax = (value: MotionValue<number>, distance: number, reverse = false) => {
  return useTransform(value, [0, 1], reverse ? [distance, 0] : [0, distance]);
};

// Custom spring physics options
const fastSpring = { stiffness: 220, damping: 20, mass: 1 };
const slowSpring = { stiffness: 100, damping: 30, mass: 1 };

const Home: React.FC = () => {
  // Context and data handling
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const featuredProjects = projects.filter(project => project.featured);
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Advanced refs for sophisticated scroll interactions
  const heroRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  
  // Enhanced state management for interactions
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // View tracking for premium transitions
  const [isInView, setIsInView] = useState({
    hero: true,
    gallery: false,
    about: false,
    process: false,
    contact: false
  });
  
  // Lenis smooth scroll integration
  const lenis = useLenis();
  
  // Advanced scroll tracking for sophisticated parallax effects
  const { scrollY } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: processScrollProgress } = useScroll({
    target: processRef,
    offset: ["start end", "end start"]
  });
  
  // Ultra-smooth motion values with custom physics
  const smoothHeroProgress = useSpring(heroScrollProgress, {
    ...slowSpring,
    restDelta: 0.001
  });
  
  const smoothGalleryProgress = useSpring(galleryProgress, {
    ...slowSpring,
    restDelta: 0.001
  });
  
  const smoothAboutProgress = useSpring(aboutProgress, {
    ...slowSpring,
    restDelta: 0.001
  });
  
  const smoothProcessProgress = useSpring(processScrollProgress, {
    ...fastSpring,
    restDelta: 0.001
  });
  
  // Advanced parallax and visual transformations
  const heroOpacity = useTransform(smoothHeroProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(smoothHeroProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(smoothHeroProgress, [0, 0.5], [1, 0.97]);
  const heroTitleY = useParallax(smoothHeroProgress, -100);
  const heroSubtitleY = useParallax(smoothHeroProgress, -60);
  const heroProgressHeight = useTransform(smoothHeroProgress, [0, 1], ["0%", "100%"]);
  const processLineProgress = useTransform(processScrollProgress, [0, 0.3], [0, 1]);
  
  // Advanced color transitions based on scroll
  const processLineColor = useTransform(
    processScrollProgress,
    [0, 0.3, 0.6, 0.9],
    ["rgba(211, 161, 126, 0.3)", "rgba(211, 161, 126, 0.5)", "rgba(211, 161, 126, 0.7)", "rgba(211, 161, 126, 0.9)"]
  );
  
  // Detect scroll direction for advanced interaction cues
  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY ? 'down' : 'up';
    if (direction !== scrollDirection) {
      setScrollDirection(direction);
    }
    setLastScrollY(latest);
  });
  
  // Advanced mouse tracking for parallax effects
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasInteracted) setHasInteracted(true);
      
      setCursorPosition({ 
        x: e.clientX, 
        y: e.clientY 
      });
      
      // Calculate mouse position relative to window center (-1 to 1)
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasInteracted, prefersReducedMotion]);
  
  // Project hover state management with smooth transitions
  const handleProjectHover = useCallback((index: number | null) => {
    setActiveProject(index);
    setCursorVariant(index !== null ? "project" : "default");
  }, []);
  
  // Dynamic cursor behavior
  const handleLinkHover = useCallback((enter: boolean) => {
    setCursorVariant(enter ? "link" : "default");
  }, []);
  
  const handleCtaHover = useCallback((enter: boolean) => {
    setCursorVariant(enter ? "cta" : "default");
  }, []);
  
  const handleDragHover = useCallback((enter: boolean) => {
    setCursorVariant(enter ? "drag" : "default");
  }, []);
  
  // Scroll to section with smooth animation
  const scrollToSection = useCallback((sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef.current && lenis) {
      lenis.scrollTo(sectionRef.current, {
        duration: 1.2,
        easing: (t: number) => {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        },
      });
    }
  }, [lenis]);
  
  // Monitor process steps for transitions
  useEffect(() => {
    const checkProcessStep = () => {
      if (!processRef.current) return;
      
      const { top } = processRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Calculate which step should be active based on scroll position
      const processStep = Math.floor(((scrollPosition + viewportHeight - top) / viewportHeight) * 3);
      if (processStep >= 0 && processStep <= 3 && processStep !== activeProcessStep) {
        setActiveProcessStep(processStep);
      }
    };
    
    window.addEventListener('scroll', checkProcessStep);
    return () => window.removeEventListener('scroll', checkProcessStep);
  }, [activeProcessStep]);
  
  // Sophisticated animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };
  
  const slideInRight = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };
  
  const revealInOut = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };
  
  const lineGrow = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  // Handle video loading with fallbacks
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  return (
    <motion.div
      ref={mainScrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Premium Custom Cursor with contextual states */}
      <AnimatePresence>
        {!isMobile && !prefersReducedMotion && (
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
                border: "1px solid rgba(255, 255, 255, 0.8)",
                x: cursorPosition.x - 32,
                y: cursorPosition.y - 32,
                borderRadius: "50%"
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
              ...fastSpring
            }}
          >
            {cursorVariant === "project" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full w-full flex flex-col items-center justify-center relative"
              >
                <canvas 
                  className="absolute inset-0 opacity-30 mix-blend-overlay" 
                  width="120" 
                  height="120"
                  style={{ display: hasInteracted ? 'block' : 'none' }}
                />
                <motion.span 
                  className="text-neutral-900 text-xs font-light tracking-[0.2em] uppercase mb-1"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {language === 'pt' ? 'Explorar' : 'Explorar'}
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
                <canvas 
                  className="absolute inset-0 opacity-30 mix-blend-overlay" 
                  width="120" 
                  height="120"
                  style={{ display: hasInteracted ? 'block' : 'none' }}
                />
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
        )}
      </AnimatePresence>
      
      {/* Vertical scroll progress indicator */}
      <motion.div 
        className="fixed z-50 right-6 top-1/2 -translate-y-1/2 hidden xl:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <div className="h-40 w-[1px] bg-white/10 relative">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-accent/80"
            style={{ height: heroProgressHeight }}
          />
        </div>
      </motion.div>
      
      {/* Ultra-slim sticky navigation */}
      <motion.header
        className="fixed top-0 left-0 right-0 h-[68px] z-50 flex items-center px-8 transition-all duration-500"
        initial={{ y: -100 }}
        animate={{ 
          y: 0,
          backgroundColor: lastScrollY > 40 ? "rgba(20, 20, 20, 0.7)" : "transparent",
          backdropFilter: lastScrollY > 40 ? "blur(10px)" : "none",
          borderBottom: lastScrollY > 40 ? "1px solid rgba(var(--color-accent-rgb), 0.1)" : "none"
        }}
        style={{ 
          transform: scrollDirection === 'up' || lastScrollY < 100 ? 'translateY(0)' : 'translateY(-100%)'
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-white flex items-center">
            <svg width="120" height="24" viewBox="0 0 120 24" className="text-white">
              <path
                d="M10 4L18 12L10 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M30 6H50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M30 12H60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M30 18H50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="ml-3 font-serif tracking-wider text-lg">afetto</span>
          </Link>
          
          {/* Navigation links */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-10">
              <li>
                <button 
                  onClick={() => scrollToSection(galleryRef)}
                  className="text-white/80 hover:text-white transition-colors duration-300 py-1 relative group"
                  onMouseEnter={() => handleLinkHover(true)}
                  onMouseLeave={() => handleLinkHover(false)}
                >
                  <span>{language === 'pt' ? 'Projetos' : 'Proyectos'}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-white/80 hover:text-white transition-colors duration-300 py-1 relative group"
                  onMouseEnter={() => handleLinkHover(true)}
                  onMouseLeave={() => handleLinkHover(false)}
                >
                  <span>{language === 'pt' ? 'Sobre' : 'Sobre'}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection(processRef)}
                  className="text-white/80 hover:text-white transition-colors duration-300 py-1 relative group"
                  onMouseEnter={() => handleLinkHover(true)}
                  onMouseLeave={() => handleLinkHover(false)}
                >
                  <span>{language === 'pt' ? 'Processo' : 'Proceso'}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection(contactRef)}
                  className="text-white/80 hover:text-white transition-colors duration-300 py-1 relative group"
                  onMouseEnter={() => handleLinkHover(true)}
                  onMouseLeave={() => handleLinkHover(false)}
                >
                  <span>{language === 'pt' ? 'Contato' : 'Contacto'}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              </li>
            </ul>
          </nav>
          
          {/* CTA button */}
          <Link 
            to="/agendar"
            className="hidden md:flex items-center text-white border border-white/20 hover:bg-accent/10 px-5 py-2 transition-all duration-500 group relative overflow-hidden"
            onMouseEnter={() => handleCtaHover(true)}
            onMouseLeave={() => handleCtaHover(false)}
          >
            <span className="relative z-10">
              {language === 'pt' ? 'Agendar Visita' : 'Agendar Visita'}
            </span>
            <motion.div
              className="absolute inset-0 bg-accent/20 z-0"
              initial={{ scaleX: 0, originX: 0 }}
              whileHover={{ scaleX: 1, originX: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </Link>
          
          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </motion.header>
      
      {/* Cinematic Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ 
          opacity: heroOpacity, 
          y: heroY, 
          scale: heroScale 
        }}
        className="relative h-screen flex items-center overflow-hidden"
        onViewportEnter={() => setIsInView({...isInView, hero: true})}
        onViewportLeave={() => setIsInView({...isInView, hero: false})}
      >
        {/* Cinematic video background with sophisticated depth layering */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            {!videoLoaded && (
              <motion.div 
                className="absolute inset-0 z-20 bg-black flex items-center justify-center"
                initial={{ opacity: 1 }}
                exit={{ 
                  opacity: 0,
                  transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.2
                  }}
                  className="w-16 h-16"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#d3a17e" 
                      strokeWidth="1.5"
                      strokeDasharray="283"
                      strokeDashoffset="283"
                      style={{
                        animation: "dash 1.5s ease-in-out infinite alternate"
                      }}
                    />
                  </svg>
                  <style>{`
                    @keyframes dash {
                      from {
                        stroke-dashoffset: 283;
                      }
                      to {
                        stroke-dashoffset: 0;
                      }
                    }
                  `}</style>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ 
              scale: 1,
              transition: { duration: 3.5, ease: [0.22, 1, 0.36, 1] }
            }}
            className="w-full h-full"
          >
            {/* Video with next-gen format and fallback */}
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              onLoadedData={handleVideoLoaded}
              className="w-full h-full object-cover"
              poster="/images/hero-poster.jpg"
              preload="none"
            >
              <source src="/videos/luxury-atelier.webm" type="video/webm" />
              <source src="/videos/luxury-atelier.mp4" type="video/mp4" />
            </video>
            
            {/* Sophisticated gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/60 z-1"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/95 z-2"></div>
            
            {/* Premium noise texture overlay */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-overlay z-3" 
              style={{ 
                backgroundImage: 'url(/images/noise-texture.png)', 
                backgroundSize: '200px 200px' 
              }}
            />
            
            {/* Dynamic 3D parallax effect based on mouse position */}
            <motion.div 
              className="absolute inset-0 z-4"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(var(--color-accent-rgb), 0.05), transparent 70%)',
                x: prefersReducedMotion ? 0 : mousePosition.x * -15,
                y: prefersReducedMotion ? 0 : mousePosition.y * -15,
              }}
            />
          </motion.div>
        </div>
        
        {/* Elegant architectural grid */}
        <div className="absolute inset-0 z-10 opacity-[0.03]">
          <div className="grid grid-cols-6 md:grid-cols-12 h-full w-full">
            {Array(12).fill(0).map((_, i) => (
              <div key={`grid-col-${i}`} className="h-full border-l border-white/80 last:border-r"></div>
            ))}
          </div>
        </div>
        
        {/* Refined accent elements */}
        <motion.div 
          className="absolute top-[15vh] left-[10%] w-px h-[35vh] z-10"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ 
            duration: 1.8, 
            delay: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{ 
            transformOrigin: 'top',
            background: 'linear-gradient(to bottom, transparent, rgba(var(--color-accent-rgb), 0.7), transparent)'
          }}
        />
        
        <motion.div 
          className="absolute bottom-[15vh] right-[10%] w-px h-[35vh] z-10"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ 
            duration: 1.8, 
            delay: 1.2,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{ 
            transformOrigin: 'bottom',
            background: 'linear-gradient(to top, transparent, rgba(var(--color-accent-rgb), 0.7), transparent)'
          }}
        />

        {/* Elegant design composition element */}
        <motion.div 
          className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] opacity-15 hidden lg:block"
          initial={{ opacity: 0, rotate: 25 }}
          animate={{ opacity: 0.15, rotate: 0 }}
          transition={{ 
            duration: 3, 
            delay: 1.5,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.circle 
              cx="50" cy="50" r="49" 
              stroke="white" 
              strokeWidth="0.15" 
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 4, 
                delay: 1.8,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
            <motion.circle 
              cx="50" cy="50" r="35" 
              stroke="white" 
              strokeWidth="0.1" 
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 3.5, 
                delay: 2.2,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
            <motion.path 
              d="M15,50 H85 M50,15 V85" 
              stroke="white" 
              strokeWidth="0.15"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 3, 
                delay: 2.6,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          </svg>
        </motion.div>
        
        {/* Main content container */}
        <div className="relative z-20 container mx-auto px-8 md:px-16 flex h-full items-center">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-5xl"
            style={{
              y: heroTitleY
            }}
          >
            {/* Hero Typography with sophisticated animation */}
            <motion.div variants={fadeInUp} className="overflow-hidden mb-6">
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: 40 }}
                  animate={{ y: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.6, 
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="font-light text-accent tracking-[0.25em] uppercase text-sm mb-6"
                >
                  {language === 'pt' ? 'Ateliê de Design' : 'Atelier de Diseño'}
                </motion.p>
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl xl:text-8xl leading-[1.05] tracking-[-0.02em] text-white">
                <div className="flex flex-wrap items-baseline">
                  {/* Premium character animation for main title */}
                  {(language === 'pt' ? 'Objetos com significado' : 'Objetos con significado').split('').map((char, index) => (
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
                </div>
              </h1>
            </motion.div>
              
            {/* Sophisticated subtitle with elegant reveal */}
            <motion.div 
              variants={fadeInUp}
              className="overflow-hidden max-w-2xl mt-8 md:mt-10"
              style={{
                y: heroSubtitleY
              }}
            >
              <div className="relative flex items-center">
                <motion.div 
                  className="absolute -left-8 top-1/2 w-4 h-[1px]"
                  initial={{ scaleX: 0, background: "rgba(var(--color-accent-rgb), 0.4)" }}
                  animate={{ scaleX: 1, background: "rgba(var(--color-accent-rgb), 0.8)" }}
                  transition={{ 
                    duration: 1, 
                    delay: 1.8,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  style={{ transformOrigin: 'right' }}
                />
                
                <p className="text-white/80 text-lg md:text-xl lg:text-2xl leading-relaxed font-extralight tracking-wide">
                  {(language === 'pt' 
                    ? 'Criamos peças que equilibram perfeitamente função e expressão artística, transformando espaços em narrativas de identidade e sofisticação.'
                    : 'Creamos piezas que equilibran perfectamente función y expresión artística, transformando espacios en narrativas de identidad y sofisticación.'
                  ).split('').map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 1.5 + (index * 0.01),
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="inline-block"
                      style={{ 
                        display: char === ' ' ? 'inline' : 'inline-block',
                        whiteSpace: char === ' ' ? 'pre' : 'normal'
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </p>
              </div>
            </motion.div>
              
            {/* Sophisticated CTA with elegant hover state */}
            <motion.div
              variants={fadeInUp}
              className="mt-12 md:mt-16"
            >
              <Link 
                to="/portfolio" 
                className="group inline-flex items-center relative overflow-hidden"
                onMouseEnter={() => handleCtaHover(true)}
                onMouseLeave={() => handleCtaHover(false)}
              >
                <span className="relative z-10 text-white text-lg tracking-wide pl-6 pr-12 py-5 border border-accent/60 flex items-center gap-x-4 group-hover:pr-16 transition-all duration-700 ease-[0.22,1,0.36,1]">
                  <span className="text-accent/80 group-hover:text-accent transition-colors duration-700">
                    {language === 'pt' ? '01' : '01'}
                  </span>
                  <span className="text-white/90">
                    {language === 'pt' ? 'Explorar portfólio' : 'Explorar portafolio'}
                  </span>
                  
                  <motion.div 
                    className="absolute right-6 group-hover:right-8 transition-all duration-700 ease-[0.22,1,0.36,1]"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2, 
                      ease: "easeInOut", 
                      repeatDelay: 1 
                    }}
                  >
                    <ArrowRight size={18} className="text-accent" />
                  </motion.div>
                  
                  {/* Button hover backdrop with refined timing */}
                  <motion.div 
                    className="absolute inset-0 bg-accent/10 z-[-1]"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1, originX: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Elegant scroll indicator */}
        <motion.div 
          className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <div className="uppercase tracking-[0.25em] text-white/60 text-[10px] font-medium mb-2">
            {language === 'pt' ? 'Explore' : 'Explore'}
          </div>
          <motion.div 
            className="relative h-20 flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              ease: "easeInOut" 
            }}
          >
            <ArrowDown size={16} className="text-accent/80" />
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Featured Projects - Gallery Experience */}
      <motion.section
        ref={galleryRef}
        className="relative bg-stone-50 py-32 md:py-48 overflow-hidden"
        onViewportEnter={() => setIsInView({...isInView, gallery: true})}
      >
        {/* Premium architectural grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full grid grid-cols-6 md:grid-cols-12">
            {Array(12).fill(0).map((_, i) => (
              <div key={`grid-col-${i}`} className="h-full border-l border-black/70 last:border-r"></div>
            ))}
          </div>
        </div>
        
        {/* Subtle accent elements */}
        <motion.div 
          className="absolute top-0 left-0 w-screen h-[1px] bg-black/5"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
        />
        
        <motion.div 
          className="absolute bottom-0 right-0 w-screen h-[1px] bg-black/5"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'right' }}
        />
        
        {/* Decorative accent element */}
        <motion.div 
          className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.03] pointer-events-none"
          initial={{ scale: 0.8, rotate: 45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-black">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.2" fill="none" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.2" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.2" />
          </svg>
        </motion.div>
        
        <div className="relative container mx-auto px-8 md:px-16">
          {/* Section header */}
          <div className="mb-32">
            <div className="grid grid-cols-12 gap-y-10">
              <motion.div 
                className="col-span-12 md:col-span-5 mb-8"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}              >
                <div className="text-accent uppercase tracking-[0.25em] text-xs font-medium mb-6">
                  {language === 'pt' ? '02 — Portfólio' : '02 — Portafolio'}
                </div>
                <h2 className="text-4xl md:text-5xl xl:text-6xl font-serif leading-[1.1] mb-8 tracking-tight text-neutral-900">
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: 80 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {language === 'pt' ? 'Trabalhamos com os melhores' : 'Trabajamos con los mejores'}
                    </motion.div>
                  </div>
                </h2>
                <motion.div 
                  className="h-px w-24 bg-accent mb-8"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.div>
              
              <motion.div 
                className="col-span-12 md:col-span-6 md:col-start-7"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-neutral-600 text-lg max-w-xl leading-relaxed">
                  {language === 'pt' 
                    ? 'Nossa curadoria de projetos demonstra nosso compromisso com a excelência artesanal e a singularidade que define cada criação. Cada peça reflete a convergência entre tradição e inovação.'
                    : 'Nuestra curaduría de proyectos demuestra nuestro compromiso con la excelencia artesanal y la singularidad que define cada creación. Cada pieza refleja la convergencia entre tradición e innovación.'}
                </p>
                
                <div className="hidden md:block mt-12">
                  <Link 
                    to="/portfolio"
                    className="group inline-flex items-center"
                    onMouseEnter={() => handleLinkHover(true)}
                    onMouseLeave={() => handleLinkHover(false)}
                  >
                    <span className="relative text-neutral-900 border-b border-transparent transition-all duration-500 group-hover:border-accent">
                      {language === 'pt' ? 'Ver toda a coleção' : 'Ver toda la colección'}
                    </span>
                    <motion.div
                      className="ml-3"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2, 
                        ease: "easeInOut", 
                        repeatDelay: 1 
                      }}
                    >
                      <ChevronRight size={16} className="text-accent" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Projects carousel with sophisticated hover and scroll effects */}
          <div 
            className="relative"
            ref={projectsScrollRef}
            onMouseEnter={() => handleDragHover(true)}
            onMouseLeave={() => handleDragHover(false)}
          >
            <div 
              className="overflow-x-auto hide-scrollbar pb-12"
              style={{ 
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth' 
              }}
            >
              <motion.div 
                className="flex space-x-6"
                drag={!isMobile ? "x" : false}
                dragConstraints={projectsScrollRef}
                dragElastic={0.1}
                style={{ 
                  width: 'max-content', 
                  paddingLeft: '8vw', 
                  paddingRight: '8vw' 
                }}
              >
                {featuredProjects.map((project, index) => (
                  <motion.div 
                    key={project.id}
                    className="w-[min(600px,80vw)] flex-shrink-0 scroll-snap-align-start"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 1.2, 
                      delay: 0.1 * index,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    whileHover={{ y: -10 }}
                    onHoverStart={() => handleProjectHover(index)}
                    onHoverEnd={() => handleProjectHover(null)}
                  >
                    <div className="group relative overflow-hidden rounded-sm shadow-xl">
                      <div className="aspect-[4/3] overflow-hidden">
                        <motion.img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                          initial={{ scale: 1.05 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ 
                            scale: { duration: 1.4, ease: [0.22, 1, 0.36, 1] }
                          }}
                        />
                      </div>
                      
                      {/* Elegant overlay with backdrop blur */}
                      <motion.div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                          >
                            <div className="text-white/70 text-xs tracking-widest uppercase mb-2">
                              {project.category}
                            </div>
                            <h3 className="text-white text-2xl font-serif mb-3">{project.title}</h3>
                            <div className="h-px w-16 bg-accent/70 mb-4"></div>
                            <p className="text-white/80 text-sm max-w-md">
                              {project.description[language]}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            {/* Scroll indicators */}
            <div className="flex justify-center mt-12 space-x-2">
              {featuredProjects.map((_, index) => (
                <motion.button
                  key={index}
                  className="w-2 h-2 rounded-full bg-neutral-300 relative"
                  whileHover={{ scale: 1.5 }}
                  onClick={() => {
                    if (projectsScrollRef.current) {
                      const scrollAmount = index * (isMobile ? 80 : 600 + 24); // width + gap
                      projectsScrollRef.current.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  {index === activeProject && (
                    <motion.div
                      className="absolute inset-0 bg-accent rounded-full"
                      layoutId="projectIndicator"
                      transition={{ type: 'spring', ...fastSpring }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Mobile CTA */}
          <div className="text-center mt-16 md:hidden">
            <Link 
              to="/portfolio"
              className="inline-flex items-center px-8 py-4 border border-accent/60 text-neutral-900 hover:bg-accent/5 transition-all duration-500"
              onMouseEnter={() => handleLinkHover(true)}
              onMouseLeave={() => handleLinkHover(false)}
            >
              {language === 'pt' ? 'Ver toda a coleção' : 'Ver toda la colección'}
              <ChevronRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>
      </motion.section>
      
      {/* About Section - Editorial Aesthetic */}
      <motion.section 
        ref={aboutRef}
        className="py-32 md:py-48 bg-stone-100 overflow-hidden"
        onViewportEnter={() => setIsInView({...isInView, about: true})}
      >
        <div className="container mx-auto px-8 md:px-16">
          <div className="grid grid-cols-12 gap-y-24 md:gap-y-0 md:gap-x-12 items-start">
            {/* Text content with reveals */}
            <motion.div 
              className="col-span-12 md:col-span-5 md:col-start-1 md:sticky md:top-32"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-xl">
                <div className="text-accent uppercase tracking-[0.25em] text-xs font-medium mb-6">
                  {language === 'pt' ? '03 — Nossa História' : '03 — Nuestra Historia'}
                </div>
                <h2 className="text-4xl md:text-5xl xl:text-6xl font-serif leading-[1.1] mb-8 tracking-tight text-neutral-900">
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: 80 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {language === 'pt' ? 'Tradição encontra contemporaneidade' : 'Tradición encuentra contemporaneidad'}
                    </motion.div>
                  </div>
                </h2>
                <motion.div 
                  className="h-px w-24 bg-accent mb-10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                />
                
                <div className="overflow-hidden">
                  <motion.p 
                    className="text-neutral-700 leading-relaxed mb-12 text-lg"
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {language === 'pt' 
                      ? 'Por mais de duas décadas, aperfeiçoamos a arte de criar mobiliário que harmoniza métodos tradicionais com design contemporâneo, resultando em peças que não apenas ocupam espaços, mas contam histórias e evocam emoções.'
                      : 'Por más de dos décadas, hemos perfeccionado el arte de crear mobiliario que armoniza métodos tradicionales con diseño contemporáneo, resultando en piezas que no solo ocupan espacios, sino que cuentan historias y evocan emociones.'}
                  </motion.p>
                </div>
                
                {/* Value proposition with refined aesthetic */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-10 mb-12">
                  <motion.div 
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="w-14 h-14 rounded-none border border-accent/50 flex items-center justify-center mb-6 group">
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Icon icon="quality" className="w-5 h-5 text-accent" />
                      </motion.div>
                    </div>
                    <h4 className="text-lg font-medium mb-3">{language === 'pt' ? 'Materiais Exclusivos' : 'Materiales Exclusivos'}</h4>
                    <div className="h-px w-16 bg-accent/30 mb-5"></div>
                    <p className="text-neutral-600 text-base leading-relaxed">{language === 'pt' ? 'Selecionamos as matérias-primas mais nobres e sustentáveis, priorizando fornecedores locais e processos éticos para garantir peças de qualidade excepcional e durabilidade.' : 'Seleccionamos las materias primas más nobles y sostenibles, priorizando proveedores locales y procesos éticos para garantizar piezas de calidad excepcional y durabilidad.'}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="w-14 h-14 rounded-none border border-accent/50 flex items-center justify-center mb-6">
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Icon icon="craftsmanship" className="w-5 h-5 text-accent" />
                      </motion.div>
                    </div>
                    <h4 className="text-lg font-medium mb-3">{language === 'pt' ? 'Maestria Artesanal' : 'Maestría Artesanal'}</h4>
                    <div className="h-px w-16 bg-accent/30 mb-5"></div>
                    <p className="text-neutral-600 text-base leading-relaxed">{language === 'pt' ? 'Nossos mestres artesãos combinam técnicas tradicionais transmitidas por gerações com inovações contemporâneas, criando peças de excepcional precisão e beleza atemporal.' : 'Nuestros maestros artesanos combinan técnicas tradicionales transmitidas por generaciones con innovaciones contemporáneas, creando piezas de excepcional precisión y belleza atemporal.'}
                    </p>
                  </motion.div>
                  
                  {/* Enhanced proposition items with premium effects */}
                  <motion.div 
                    className="flex flex-col relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Subtle background pattern */}
                    <motion.div 
                      className="absolute -right-16 -top-12 w-32 h-32 opacity-[0.025] hidden md:block pointer-events-none"
                      initial={{ rotate: 45 }}
                      whileInView={{ rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" />
                        <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                      </svg>
                    </motion.div>
                    
                    {/* Icon with enhanced animation */}
                    <div className="w-14 h-14 rounded-none border border-accent/50 flex items-center justify-center mb-6 group relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-accent/5 origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <motion.div
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Icon icon="design" className="w-5 h-5 text-accent" />
                      </motion.div>
                      
                      {/* Elegant corner accent */}
                      <motion.div 
                        className="absolute top-0 right-0 w-4 h-4 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent">
                          <path d="M1 1H15V15" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
                        </svg>
                      </motion.div>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center gap-x-2 mb-3">
                        <h4 className="text-lg font-medium">{language === 'pt' ? 'Design Personalizado' : 'Diseño Personalizado'}</h4>
                        <motion.span
                          className="text-[10px] text-accent/60 uppercase tracking-widest"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {language === 'pt' ? 'Exclusivo' : 'Exclusivo'}
                        </motion.span>
                      </div>
                      
                      <motion.div 
                        className="h-px w-24 bg-gradient-to-r from-accent/70 to-accent/0 mb-5"
                        whileInView={{ 
                          scaleX: [0, 1.5, 1],
                          transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                        }}
                        viewport={{ once: true }}
                        style={{ transformOrigin: "left" }}
                      />
                      
                      <p className="text-neutral-600 text-base leading-relaxed font-light">
                        {language === 'pt' 
                          ? 'Cada projeto é único e moldado para refletir sua individualidade. Colaboramos intimamente com clientes para criar peças que transcendem tendências passageiras e capturam a essência atemporal do seu estilo pessoal.'
                          : 'Cada proyecto es único y moldeado para reflejar su individualidad. Colaboramos íntimamente con clientes para crear piezas que trascienden tendencias pasajeras y capturan la esencia atemporal de su estilo personal.'}
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Icon with sophisticated interaction */}
                    <div className="w-14 h-14 rounded-none border border-accent/50 flex items-center justify-center mb-6 group relative">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        initial={{ rotateY: 0 }}
                        whileHover={{ rotateY: 180 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <Icon icon="sustainability" className="w-5 h-5 text-accent" />
                      </motion.div>
                    </div>
                    
                    <div className="flex flex-col">
                      <h4 className="text-lg font-medium mb-3">{language === 'pt' ? 'Compromisso Sustentável' : 'Compromiso Sostenible'}</h4>
                      <motion.div 
                        className="h-px w-16 bg-accent/30 mb-5"
                        whileInView={{ width: ['0%', '20%', '16%'] }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <p className="text-neutral-600 text-base leading-relaxed font-light">
                        {language === 'pt' 
                          ? 'Nossa busca pela excelência inclui responsabilidade ambiental. Utilizamos madeiras certificadas, tintas naturais e técnicas que minimizam desperdício, criando um legado sustentável para as gerações futuras.'
                          : 'Nuestra búsqueda de excelencia incluye responsabilidad ambiental. Utilizamos maderas certificadas, pinturas naturales y técnicas que minimizan el desperdicio, creando un legado sostenible para las generaciones futuras.'}
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Premium fading border animation */}
                    <motion.div 
                      className="relative w-14 h-14 mb-6 group"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div 
                        className="absolute inset-0 border border-accent/50 flex items-center justify-center"
                        animate={{ 
                          borderColor: ['rgba(211, 161, 126, 0.5)', 'rgba(211, 161, 126, 0.2)', 'rgba(211, 161, 126, 0.5)'],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Icon icon="heritage" className="w-5 h-5 text-accent" />
                      </motion.div>
                      
                      <motion.div 
                        className="absolute -inset-1 border border-accent/20 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.4 }}
                      />
                    </motion.div>
                    
                    <div className="flex flex-col">
                      <h4 className="text-lg font-medium mb-3">{language === 'pt' ? 'Legado Cultural' : 'Legado Cultural'}</h4>
                      <div className="h-px w-16 bg-accent/30 mb-5 relative">
                        <motion.div 
                          className="absolute top-0 left-0 h-full bg-accent/50"
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <p className="text-neutral-600 text-base leading-relaxed font-light">
                        {language === 'pt' 
                          ? 'Nossas criações transcendem gerações. Honramos técnicas ancestrais enquanto olhamos para o futuro, criando peças que serão transmitidas como heranças familiares, carregando histórias e memórias através do tempo.'
                          : 'Nuestras creaciones trascienden generaciones. Honramos técnicas ancestrales mientras miramos hacia el futuro, creando piezas que serán transmitidas como herencias familiares, llevando historias y memorias a través del tiempo.'}
                      </p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Sophisticated call-to-action with premium interaction */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8"
                >
                  <Link
                    to="/filosofia"
                    className="inline-flex items-center group relative"
                    onMouseEnter={() => handleLinkHover(true)}
                    onMouseLeave={() => handleLinkHover(false)}
                  >
                    <span className="text-neutral-800 group-hover:text-accent transition-colors duration-500 mr-3 relative">
                      {language === 'pt' ? 'Conheça nossa filosofia' : 'Conozca nuestra filosofía'}
                      <motion.span
                        className="absolute -bottom-px left-0 w-full h-[1px] bg-accent/40"
                        initial={{ scaleX: 0, transformOrigin: 'right' }}
                        whileHover={{ scaleX: 1, transformOrigin: 'left' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </span>
                    <motion.div
                      className="w-7 h-7 rounded-full border border-accent/30 flex items-center justify-center overflow-hidden"
                      whileHover={{ 
                        scale: 1.1,
                        borderColor: 'rgba(var(--color-accent-rgb), 0.5)'
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div
                        animate={{ x: [-12, 16] }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatType: 'loop', 
                          duration: 1.5, 
                          ease: [0.22, 1, 0.36, 1],
                          repeatDelay: 0.5
                        }}
                      >
                        <ArrowRight size={12} className="text-accent" />
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
} 
export default Home;