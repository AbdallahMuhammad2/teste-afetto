import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  motion, useScroll, useTransform, AnimatePresence, useSpring, 
  MotionValue, useMotionValueEvent
} from 'framer-motion';
import { ChevronRight, ArrowRight, ArrowDown, Plus } from 'lucide-react';
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

// Enhanced typography animations with premium timing
const textReveal = {
  hidden: { y: 100, opacity: 0 },
  visible: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { 
      duration: 1.2, 
      delay: 0.1 * i,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const lineReveal = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: (i = 0) => ({
    scaleX: 1,
    opacity: 1,
    transition: { 
      duration: 1.4, 
      delay: 0.2 + (0.1 * i),
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// Add this to create premium hover effects for all buttons
const premiumButtonHover = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLButtonElement;
  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  button.style.setProperty('--x', `${x}px`);
  button.style.setProperty('--y', `${y}px`);
};

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
  // Testimonials data
const testimonials = [
  {
    quote: {
      pt: "A Afetto transformou completamente nossa sala de estar, criando um espaço que é ao mesmo tempo elegante e acolhedor. Cada detalhe foi pensado cuidadosamente, resultando em uma atmosfera que realmente reflete nossa personalidade.",
      es: "Afetto transformó completamente nuestra sala de estar, creando un espacio que es a la vez elegante y acogedor. Cada detalle fue cuidadosamente pensado, resultando en una atmósfera que realmente refleja nuestra personalidad."
    },
    name: "Carolina Mendes",
    title: "São Paulo, Brasil",
    image: "/images/testimonials/client-1.jpg"
  },
  {
    quote: {
      pt: "O processo de trabalho com a equipe da Afetto foi extraordinário. Sua atenção aos detalhes e compromisso com a excelência são incomparáveis. As peças personalizadas que criaram para nosso escritório são verdadeiras obras de arte.",
      es: "El proceso de trabajo con el equipo de Afetto fue extraordinario. Su atención al detalle y compromiso con la excelencia son incomparables. Las piezas personalizadas que crearon para nuestra oficina son verdaderas obras de arte."
    },
    name: "Rafael Oliveira",
    title: "Rio de Janeiro, Brasil",
    image: "/images/testimonials/client-2.jpg"
  },
  {
    quote: {
      pt: "Procurávamos algo único que refletisse nossa paixão por design e funcionalidade. A Afetto entendeu perfeitamente nossa visão e a transformou em realidade, superando todas as nossas expectativas.",
      es: "Buscábamos algo único que reflejara nuestra pasión por el diseño y la funcionalidad. Afetto entendió perfectamente nuestra visión y la transformó en realidad, superando todas nuestras expectativas."
    },
    name: "Maria e Pedro Santos",
    title: "Porto Alegre, Brasil",
    image: "/images/testimonials/client-3.jpg"
  },
  {
    quote: {
      pt: "Trabalhar com a Afetto foi uma experiência transformadora. Eles não apenas criaram móveis incríveis, mas também nos guiaram através de todo o processo de design, garantindo que cada escolha fosse perfeita para nosso espaço.",
      es: "Trabajar con Afetto fue una experiencia transformadora. No solo crearon muebles increíbles, sino que también nos guiaron a través de todo el proceso de diseño, asegurando que cada elección fuera perfecta para nuestro espacio."
    },
    name: "Fernanda Lima",
    title: "Brasília, Brasil",
    image: "/images/testimonials/client-4.jpg"
  }
];
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
      className="relative font-serif bg-gradient-to-br from-[#181617] via-[#23201C] to-[#1a1713] min-h-screen"
    >
      {/* Premium Custom Cursor with smoother transitions */}
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
                borderRadius: "50%",
                transition: { duration: 0.3 },
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
                transition: { duration: 0.3 },
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
                transition: { duration: 0.3 },
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
                transition: { duration: 0.3 },
              },
            }}
            initial="default"
            animate={cursorVariant}
            transition={{
              type: "spring",
              ...fastSpring,
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
                  style={{ display: hasInteracted ? "block" : "none" }}
                />
                <motion.span
                  className="text-neutral-900 text-xs font-light tracking-[0.2em] uppercase mb-1"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {language === "pt" ? "Explorar" : "Explore"}
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
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* Premium Header Navigation */}
      <motion.header
        className="fixed top-0 left-0 right-0 h-[90px] z-50 flex items-center px-8 transition-all duration-500"
        initial={{ y: -100 }}
        animate={{
          y: 0,
          backgroundColor: lastScrollY > 40 ? "rgba(18, 18, 20, 0.85)" : "transparent",
          backdropFilter: lastScrollY > 40 ? "blur(20px)" : "none",
          boxShadow: lastScrollY > 40 ? "0 10px 30px -10px rgba(0,0,0,0.3)" : "none",
          borderBottom: lastScrollY > 40 ? "1px solid rgba(var(--color-accent-rgb), 0.15)" : "none",
        }}
        style={{
          transform: scrollDirection === "up" || lastScrollY < 100 ? "translateY(0)" : "translateY(-100%)",
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo with hover animation */}
          <Link to="/" className="text-white flex items-center group relative z-10">
            <motion.div
              initial={{ filter: "drop-shadow(0 0 0 rgba(211, 161, 126, 0))" }}
              whileHover={{ filter: "drop-shadow(0 0 8px rgba(211, 161, 126, 0.6))" }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden flex items-center"
            >
              <motion.svg
                width="120"
                height="24"
                viewBox="0 0 120 24"
                className="text-white group-hover:text-accent transition-colors duration-500"
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <path
                  d="M10 4L18 12L10 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <motion.path
                  d="M30 6H50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              </motion.svg>
              <motion.span
                className="ml-3 font-serif tracking-wider text-lg group-hover:text-accent transition-colors duration-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                afetto
              </motion.span>
            </motion.div>
          </Link>
  
          {/* Premium CTA Button with layered effects */}
          <Link
            to="/agendar"
            className="hidden md:flex items-center text-white border border-white/20 px-5 py-2.5 transition-all duration-500 group relative overflow-hidden rounded-sm"
            onMouseEnter={() => handleCtaHover(true)}
            onMouseLeave={() => handleCtaHover(false)}
          >
            <span className="relative z-10 font-light tracking-wider">
              {language === "pt" ? "Agendar Visita" : "Book a Visit"}
            </span>
            {/* Multi-layered hover effects */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent/50 to-accent/30 z-0 opacity-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%", opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </Link>
        </div>
      </motion.header>
      
      {/* Cinematic Hero Section 2.0 */}
      <motion.section 
        ref={heroRef}
        style={{ 
          opacity: heroOpacity, 
          y: heroY, 
          scale: heroScale 
        }}
        className="relative h-[100vh] min-h-[700px] flex items-center overflow-hidden"
        onViewportEnter={() => setIsInView({...isInView, hero: true})}
        onViewportLeave={() => setIsInView({...isInView, hero: false})}
      >
        {/* Enhanced Video Background with Layered Depth */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            {!videoLoaded && (
              <motion.div 
                className="absolute inset-0 z-30 bg-black flex items-center justify-center"
                initial={{ opacity: 1 }}
                exit={{ 
                  opacity: 0,
                  transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                }}
              >
                <motion.div
                  className="relative w-24 h-24"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Ultra premium loading animation */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d3a17e" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#d3a17e" stopOpacity="1" />
                        <stop offset="100%" stopColor="#d3a17e" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    <motion.circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="url(#gradient)" 
                      strokeWidth="1"
                      strokeDasharray="283"
                      strokeDashoffset="283"
                      animate={{ strokeDashoffset: [283, 0] }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    />
                    <motion.path
                      d="M 35 50 L 45 60 L 65 40"
                      fill="none"
                      stroke="#d3a17e"
                      strokeWidth="1.5"
                      strokeDasharray="50"
                      strokeDashoffset="50"
                      animate={{ 
                        strokeDashoffset: [50, 0],
                        opacity: [0, 1] 
                      }}
                      transition={{
                        delay: 2,
                        duration: 0.8,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatDelay: 2.2
                      }}
                    />
                    <motion.text
                      x="50" 
                      y="50" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      fill="#d3a17e"
                      opacity="0"
                      animate={{ opacity: [0, 0.8, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      style={{ 
                        fontSize: '8px', 
                        fontFamily: 'sans-serif', 
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                      }}
                    >
                      afetto
                    </motion.text>
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Enhanced video container with adaptive brightness */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.05, filter: 'brightness(0.6)' }}
            animate={{ 
              scale: 1,
              filter: 'brightness(0.85)',
              transition: { duration: 4, ease: [0.22, 1, 0.36, 1] }
            }}
          >
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              onLoadedData={handleVideoLoaded}
              className="w-full h-full object-cover"
              style={{ 
                opacity: videoLoaded ? 1 : 0,
                transition: 'opacity 1.5s ease'
              }}
            >
              <source src="/videos/luxury-atelier.webm" type="video/webm" />
              <source src="/videos/luxury-atelier.mp4" type="video/mp4" />
            </video>
            
            {/* Multi-layered gradient system for premium depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 mix-blend-multiply z-1"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/95 z-2"></div>
            
            {/* Enhanced texture overlay with optical depth */}
            <motion.div 
              className="absolute inset-0 opacity-[0.08] z-3" 
              style={{ 
                backgroundImage: 'url(/images/grain-texture-light.png)', 
                backgroundSize: '200px' 
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 120,
                ease: "linear",
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
            
            {/* Dynamic light particles system */}
            {!prefersReducedMotion && !isMobile && (
              <motion.div className="absolute inset-0 z-4 overflow-hidden">
                {Array(20).fill(0).map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute rounded-full"
                    initial={{ 
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{
                      opacity: [0, 0.4, 0],
                      scale: [0, 1, 0],
                      filter: [
                        'blur(2px) brightness(1)', 
                        'blur(1px) brightness(1.5)', 
                        'blur(2px) brightness(1)'
                      ],
                    }}
                    transition={{
                      duration: 8 + Math.random() * 15,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: Math.random() * 10,
                    }}
                    style={{
                      width: `${2 + Math.random() * 6}px`,
                      height: `${2 + Math.random() * 6}px`,
                      background: 'radial-gradient(circle, rgba(211,161,126,0.8) 0%, rgba(211,161,126,0) 70%)',
                    }}
                  />
                ))}
              </motion.div>
            )}
            
            {/* Animated vignette effect */}
            <motion.div 
              className="absolute inset-0 z-5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 2 }}
              style={{
                background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.8) 100%)',
              }}
            />
          </motion.div>
        </div>
        
        {/* Elegant architectural grid */}
        <div className="absolute inset-0 z-10 opacity-[0.045] pointer-events-none">
          <div className="grid grid-cols-6 md:grid-cols-12 h-full w-full">
            {Array(12).fill(0).map((_, i) => (
              <div key={`grid-col-${i}`} className="h-full border-l border-white/50 last:border-r"></div>
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
        <div className="relative z-20 container mx-auto px-6 md:px-20 flex h-full items-center">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-6xl"
            style={{
              y: heroTitleY
            }}
          >
            {/* Hero Typography */}
            <motion.div variants={fadeInUp} className="overflow-visible mb-10">
              <div className="overflow-visible">
                <motion.p
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 0.6, 
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="font-semibold text-accent tracking-[0.38em] uppercase text-base mb-8 relative"
                >
                  <span className="relative">
                    {language === 'pt' ? 'Ateliê de Design' : 'Atelier de Diseño'}
                    <motion.span 
                      className="absolute -bottom-2 left-0 h-[1px] w-full bg-accent/40"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.2, delay: 1.2 }}
                    />
                  </span>
                </motion.p>
              </div>
              
              <h1 className="font-serif text-7xl md:text-9xl xl:text-[11rem] leading-[1.01] tracking-[-0.04em] text-white/95 relative drop-shadow-2xl">
                {/* Title with enhanced 3D effect */}
                <div className="overflow-hidden relative">
                  <motion.div
                    initial={{ y: 150 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                    style={{ 
                      textShadow: '0 15px 45px rgba(0,0,0,0.4)',
                      transform: 'perspective(1000px)'
                    }}
                  >
                    {language === 'pt' ? 'Objetos com' : 'Objetos con'}
                  </motion.div>
                </div>
                
                <div className="overflow-hidden mt-1 md:mt-0">
                  <motion.div
                    initial={{ y: 150 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                    style={{ 
                      textShadow: '0 15px 45px rgba(0,0,0,0.4)',
                      transform: 'perspective(1000px)'
                    }}
                  >
                    {language === 'pt' ? 'significado' : 'significado'}
                  </motion.div>
                </div>
                
                {/* Enhanced accent line with animated glow */}
                <motion.div 
                  className="absolute -bottom-8 left-0 h-[3px] w-40 bg-gradient-to-r from-accent via-accent/80 to-transparent"
                  initial={{ scaleX: 0, filter: "blur(0px)" }}
                  animate={{ 
                    scaleX: 1, 
                    filter: ["blur(0px)", "blur(3px)", "blur(0px)"]
                  }}
                  transition={{ 
                    scaleX: { 
                      duration: 1.8, 
                      delay: 2.2, 
                      ease: [0.22, 1, 0.36, 1] 
                    },
                    filter: {
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }
                  }}
                  style={{ transformOrigin: "left" }}
                />
                
                {/* Background accent element */}
                <motion.div
                  className="absolute -right-28 -bottom-20 w-64 h-64 opacity-5 hidden xl:block"
                  initial={{ scale: 0, rotate: 45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 2, delay: 2 }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="49.5" stroke="white" strokeOpacity="0.5" />
                    <circle cx="50" cy="50" r="30" stroke="white" strokeOpacity="0.5" />
                    <path d="M50 0V100" stroke="white" strokeOpacity="0.3" />
                    <path d="M0 50H100" stroke="white" strokeOpacity="0.3" />
                  </svg>
                </motion.div>
              </h1>
            </motion.div>
              
            {/* Sophisticated subtitle with elegant reveal */}
            <motion.div 
              variants={fadeInUp}
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
        </div>

      </motion.section>
      
      {/* Featured Projects - Gallery Experience */}
      <motion.section
        ref={galleryRef}
        className="relative bg-gradient-to-b from-[#f5ede4] to-[#e6e1db] py-36 md:py-60 overflow-hidden"
        onViewportEnter={() => setIsInView({...isInView, gallery: true})}
      >
        {/* Premium architectural grid */}
        <div className="absolute inset-0 opacity-[0.045] pointer-events-none">
          <div className="h-full w-full grid grid-cols-6 md:grid-cols-12">
            {Array(12).fill(0).map((_, i) => (
              <div key={`grid-col-${i}`} className="h-full border-l border-black/30 last:border-r"></div>
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
        
        <div className="relative container mx-auto px-6 md:px-20">
          {/* Section header */}
          <div className="mb-36">
            <div className="grid grid-cols-12 gap-y-14">
              <motion.div 
                className="col-span-12 md:col-span-5 mb-12"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}              >
                <div className="text-accent uppercase tracking-[0.28em] text-sm font-semibold mb-8">
                  {language === 'pt' ? '02 — Portfólio' : '02 — Portafolio'}
                </div>
                <h2 className="text-5xl md:text-6xl xl:text-7xl font-serif leading-[1.08] mb-10 tracking-tight text-neutral-900/95">
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
                  className="h-[2.5px] w-32 bg-gradient-to-r from-accent via-accent/80 to-transparent rounded-full shadow-lg mb-10"
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
          
          {/* Enhanced Projects Gallery with Kinetic Scroll Effect */}
          <div className="relative mb-32">
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
                  className="flex space-x-8"
                  drag={!isMobile ? "x" : false}
                  dragConstraints={projectsScrollRef}
                  dragElastic={0.1}
                  style={{ 
                    width: 'max-content', 
                    paddingLeft: '8vw', 
                    paddingRight: '8vw' 
                  }}
                >
                  {/* Generate duplicate projects for infinite scroll effect */}
                  {[...featuredProjects, ...featuredProjects].map((project, index) => (
                    <motion.div 
                      key={`project-${project.id}-${index}`}
                      className="w-[min(600px,80vw)] flex-shrink-0 scroll-snap-align-start relative overflow-hidden"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ 
                        duration: 1.2, 
                        delay: 0.05 * index,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      whileHover={{ y: -12 }}
                    >
                      <motion.img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1, filter: "grayscale(0.3)" }}
                        whileInView={{ scale: 1, filter: "grayscale(0)" }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ 
                          scale: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
                          filter: { duration: 0.8 }
                        }}
                      />
                      
                      {/* Deluxe overlay with layered gradients */}
                      <motion.div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                        <motion.div 
                          className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        />
                        
                        {/* Premium content with strategic reveals */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                          >
                            {/* Category with subtle accent */}
                            <motion.div 
                              className="inline-block"
                              initial={{ opacity: 0, y: 10 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-accent/90 text-xs tracking-widest uppercase px-3 py-1 border border-accent/30 backdrop-blur-sm mb-3 inline-block">
                                {project.category}
                              </span>
                            </motion.div>
                            
                            {/* Title with elegant animation */}
                            <div className="overflow-hidden mb-3">
                              <motion.h3 
                                className="text-white text-2xl font-serif"
                                initial={{ y: 30 }}
                                whileInView={{ y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                              >
                                {project.title}
                              </motion.h3>
                            </div>
                            
                            {/* Refined accent line */}
                            <motion.div 
                              className="h-px w-16 bg-accent/80 mb-4"
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: 0.3 }}
                              style={{ transformOrigin: "left" }}
                            />
                            
                            {/* Description with sophisticated fade-in */}
                            <motion.p 
                              className="text-white/90 text-sm max-w-md leading-relaxed"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            >
                              {project.description[language]}
                            </motion.p>
                            
                            {/* Premium call-to-action */}
                            <motion.div
                              className="mt-6"
                              initial={{ opacity: 0, y: 10 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                            >
                              <Link
                                to={`/projeto/${project.slug}`}
                                className="inline-flex items-center group"
                              >
                                <motion.span 
                                  className="text-white border-b border-transparent group-hover:border-accent transition-all duration-500"
                                  whileHover={{ x: 2 }}
                                >
                                  {language === 'pt' ? 'Ver detalhes' : 'Ver detalles'}
                                </motion.span>
                                <motion.div
                                  className="ml-2"
                                  animate={{ 
                                    x: [0, 5, 0],
                                    transition: { 
                                      repeat: Infinity, 
                                      duration: 2, 
                                      ease: "easeInOut" 
                                    } 
                                  }}
                                >
                                  <ArrowRight size={14} className="text-accent" />
                                </motion.div>
                              </Link>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                      
                      {/* Premium lower info card */}
                      <div className="p-6 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-neutral-900 font-medium mb-1">{project.title}</h3>
                            <div className="text-neutral-500 text-sm">{project.category}</div>
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 45 }}
                            transition={{ duration: 0.2 }}
                            className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center"
                          >
                            <Plus size={14} className="text-accent" />
                          </motion.div>
                        </div>
                        
                        {/* Subtle progress indicator */}
                        <div className="h-[2px] w-full bg-neutral-100 mt-4 overflow-hidden">
                          <motion.div 
                            className="h-full bg-accent/30"
                            style={{ 
                              width: `${100 / featuredProjects.length}%`,
                              marginLeft: `${(index % featuredProjects.length) / featuredProjects.length * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Active state indicator */}
                      {(index % featuredProjects.length) === activeProject && (
                        <motion.div 
                          className="absolute top-4 right-4 w-3 h-3 rounded-full bg-accent"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              
              {/* Enhanced scroll indicators */}
              <div className="flex justify-center mt-14 space-x-5">
                {featuredProjects.map((_, index) => (
                  <motion.button
                    key={index}
                    className="w-2.5 h-2.5 rounded-full bg-neutral-300 relative"
                    whileHover={{ 
                      scale: 1.5,
                      transition: { duration: 0.1 }
                    }}
                    onClick={() => {
                      if (projectsScrollRef.current) {
                        const scrollAmount = index * (isMobile ? 85 : 606); // width + gap
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
                        transition={{ 
                          type: 'spring',
                          stiffness: 220, 
                          damping: 20
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              
              {/* Scroll hint */}
              </div>
              
              {/* Scroll hint with animated arrow */}
              
              {/* Scroll hint */}
              <motion.div
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <motion.div
                  animate={{
                    x: [0, 10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight size={16} className="text-neutral-400" />
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Mobile CTA */}
          <div className="text-center mt-24 md:hidden">
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
        </motion.section>
      </motion.div>
      
      {/* About Section with Dynamic Parallax */}
      <motion.section 
        ref={aboutRef}
        className="py-40 md:py-72 overflow-hidden relative bg-gradient-to-b from-[#1a1713]/95 to-[#23201C]/70"
        onViewportEnter={() => setIsInView({...isInView, about: true})}
      >
        {/* Parallax background image */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            y: useTransform(smoothAboutProgress, [0, 1], ['-10%', '10%']),
            scale: useTransform(smoothAboutProgress, [0, 1], [1.1, 1])
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src="/images/atelier-background.jpg" 
            alt="Atelier background"
            className="w-full h-full object-cover" 
          />
        </motion.div>
        
        {/* Content wrapper with backdrop blur */}
        <div className="container relative z-10 mx-auto px-6 md:px-20">
          <div className="grid grid-cols-12 gap-y-20 md:gap-x-16 items-center">
            {/* Image column */}
            <motion.div 
              className="col-span-12 md:col-span-6"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative">
                <motion.div 
                  className="absolute -top-6 -left-6 w-full h-full border border-accent/20"
                  initial={{ opacity: 0, x: -20, y: -20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
                
                <div className="overflow-hidden">
                  <motion.img 
                    src="/images/craftsman-working.jpg" 
                    alt="Craftsman at work"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                
                <motion.div 
                  className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/10 backdrop-blur-sm flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <svg viewBox="0 0 100 100" width="64" height="64">
                      <path 
                        d="M 50 0 A 50 50 0 1 1 49.9 0" 
                        fill="none" 
                        stroke="rgba(211, 161, 126, 0.8)" 
                        strokeWidth="0.5"
                        strokeDasharray="0.5 3"
                      />
                      <text 
                        x="50%" 
                        y="50%" 
                        fontSize="8" 
                        fill="rgba(211, 161, 126, 0.9)" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        style={{ fontFamily: 'serif', letterSpacing: '1px' }}
                      >
                        DESDE 1997
                      </text>
                    </svg>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Text column with backdrop blur */}
            <motion.div 
              className="col-span-12 md:col-span-6"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white/[0.06] backdrop-filter backdrop-blur-[7px] p-10 md:p-14 relative border border-white/10 rounded-2xl shadow-lg">
                <div className="text-accent uppercase tracking-[0.25em] text-xs font-medium mb-6">
                  {language === 'pt' ? '03 — Nossa História' : '03 — Nuestra Historia'}
                </div>
                
                <h2 className="text-4xl md:text-5xl xl:text-6xl font-serif leading-[1.1] mb-8 tracking-tight text-white">
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: 80 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {language === 'pt' ? 'Tradição encontra' : 'Tradición encuentra'}
                    </motion.div>
                  </div>
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: 80 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {language === 'pt' ? 'contemporaneidade' : 'contemporaneidad'}
                    </motion.div>
                  </div>
                </h2>
                
                <motion.div 
                  className="h-[2.5px] w-32 bg-accent mb-12 rounded-full shadow-md"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                />
                
                <div className="overflow-hidden">
                  <motion.p 
                    className="text-white/90 leading-relaxed mb-12 text-lg"
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
                
                {/* Dynamic CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to="/sobre"
                    className="group inline-flex items-center justify-center overflow-hidden relative"
                    onMouseEnter={() => handleCtaHover(true)}
                    onMouseLeave={() => handleCtaHover(false)}
                  >
                    <motion.div 
                      className="relative z-10 bg-[#D4B798] px-8 py-4 text-black font-medium tracking-wide overflow-hidden group-hover:text-black transition-colors duration-300"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                      }}
                    >
                      <span className="relative z-20">
                        {language === 'pt' ? 'Conheça nossa história' : 'Conozca nuestra historia'}
                      </span>
                      
                      {/* Radial expansion background effect */}
                      <motion.div 
                        className="absolute inset-0 z-10 bg-white/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ 
                          scale: 1.5, 
                          opacity: 1,
                          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                        }}
                        style={{ borderRadius: "50%", transformOrigin: "center" }}
                      />
                      
                      {/* Glow effect on hover */}
                      <motion.div 
                        className="absolute inset-0 z-0"
                        initial={{ boxShadow: "0 0 0 rgba(212, 183, 152, 0)" }}
                        whileHover={{ 
                          boxShadow: "0 0 20px rgba(212, 183, 152, 0.6)" 
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1.5, 
                          ease: "easeInOut" 
                        }}
                      >
                        <ArrowRight size={16} className="text-black" />
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 bg-black/40 z-1 pointer-events-none opacity-40 mix-blend-overlay rounded-t-3xl" 
          style={{ 
            backgroundImage: 'url(/images/noise-pattern.png)', 
            backgroundSize: '120px 120px' 
          }}
        />
      </motion.section>
      
      {/* Client Testimonials with Smooth Scroll */}
      <motion.section 
        className="py-32 md:py-44 bg-gradient-to-b from-[#f5ede4] via-[#f0ece7] to-[#e6e1db] relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background accent elements */}
        <div className="absolute inset-0 opacity-[0.045] pointer-events-none">
          <div className="h-full w-full grid grid-cols-6 md:grid-cols-12">
            {Array(12).fill(0).map((_, i) => (
              <div key={`grid-col-${i}`} className="h-full border-l border-black/30 last:border-r"></div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="absolute top-0 left-0 w-screen h-[1px] bg-black/5"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
        />
        
        <div className="container mx-auto px-6 md:px-20">
          {/* Section header */}
          <div className="mb-24 max-w-2xl">
            <div className="text-accent uppercase tracking-[0.28em] text-sm font-semibold mb-8">
              {language === 'pt' ? '04 — Depoimentos' : '04 — Testimonios'}
            </div>
            <h2 className="text-5xl md:text-6xl font-serif leading-[1.1] mb-10 tracking-tight text-neutral-900/90">
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 80 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {language === 'pt' ? 'O que nossos clientes dizem' : 'Lo que dicen nuestros clientes'}
                </motion.div>
              </div>
            </h2>
            <motion.div 
              className="h-[2.5px] w-32 bg-accent mb-10 rounded-full shadow-md"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left" }}
            />
          </div>
          
          {/* Testimonials scroll container */}
          <div 
            className="overflow-y-auto max-h-[650px] pb-8 hide-scrollbar"
            style={{ scrollSnapType: 'y mandatory' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white shadow-lg rounded-sm p-10 scroll-snap-align-start overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                  }}
                >
                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-accent/5"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                  
                  <motion.div 
                    className="absolute -bottom-14 -left-14 w-28 h-28 rounded-full bg-accent/3"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  />
                  
                  {/* Quote icon with elegant animation */}
                  <div className="relative mb-8">
                    <motion.div 
                      className="font-serif text-7xl text-accent/10 absolute -top-6 -left-2"
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      "
                    </motion.div>
                    <motion.div 
                      className="h-px w-16 bg-accent/40"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                  
                  {/* Premium quote text with letter animation */}
                  <div className="relative z-10">
                    <p className="text-neutral-700 text-lg italic mb-10 leading-relaxed">
                      {testimonial.quote[language].split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.01, 
                            delay: 0.3 + (i * 0.005),
                            ease: "linear"
                          }}
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
                  
                  {/* Client info with enhanced layout */}
                  <div className="flex items-center relative z-10">
                    <motion.div 
                      className="w-16 h-16 rounded-full overflow-hidden mr-5 border-2 border-accent/10"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <motion.img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.4 }}
                      />
                    </motion.div>
                    <div>
                      <motion.div 
                        className="font-serif text-xl text-neutral-900 mb-1"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        {testimonial.name}
                      </motion.div>
                      <motion.div 
                        className="text-neutral-500 text-sm flex items-center"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <span className="mr-2">{testimonial.title}</span>
                        <motion.div 
                          className="h-[4px] w-[4px] rounded-full bg-accent"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Subtle accent border */}
                  <motion.div 
                    className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent/50 to-accent/10"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Premium Contact Section */}
      <motion.section 
        ref={contactRef}
        className="py-40 md:py-64 overflow-hidden relative bg-gradient-to-b from-[#181617] via-[#23201C] to-[#1a1713]"
        onViewportEnter={() => setIsInView({...isInView, contact: true})}
      >
        {/* Dynamic background with layered gradients */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            background: 'radial-gradient(circle at 30% 40%, rgba(0,0,0,0.8), rgba(0,0,0,0.95))',
            y: useTransform(scrollY, [0, 1000], ['0%', '5%'])
          }}
        />
        
        <motion.div 
          className="absolute inset-0 z-1 opacity-10"
          style={{ 
            backgroundImage: 'url(/images/texture-pattern.png)',
            backgroundSize: '200px',
            y: useTransform(scrollY, [0, 500], ['0%', '-5%'])
          }}
        />
        
        {/* Accent elements with parallax */}
        <motion.div 
          className="absolute top-[10%] right-[5%] w-[300px] h-[300px] opacity-5 hidden lg:block"
          initial={{ opacity: 0, rotate: 25 }}
          whileInView={{ opacity: 0.05, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            y: useTransform(scrollY, [0, 500], ['0%', '-10%'])
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="0.2" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.1" fill="none" />
          </svg>
        </motion.div>
        
        <div className="container relative z-10 mx-auto px-6 md:px-20">
          <div className="grid grid-cols-12 gap-y-20 md:gap-x-20">
            {/* Form column */}
            <motion.div 
              className="col-span-12 md:col-span-7"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white/[0.07] backdrop-filter backdrop-blur-[8px] p-10 md:p-14 relative border border-white/10 rounded-2xl shadow-lg">
                <div className="text-accent uppercase tracking-[0.25em] text-xs font-medium mb-6">
                  {language === 'pt' ? '05 — Contato' : '05 — Contacto'}
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif leading-[1.1] mb-8 tracking-tight text-white">
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: 80 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {language === 'pt' ? 'Vamos conversar sobre' : 'Hablemos sobre'}
                    </motion.div>
                  </div>
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: 80 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {language === 'pt' ? 'seu próximo projeto' : 'su próximo proyecto'}
                    </motion.div>
                  </div>
                </h2>
                
                <motion.div 
                  className="h-[2.5px] w-32 bg-accent mb-12 rounded-full shadow-md"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                />
                
                {/* Premium Contact Form */}
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm block">
                        {language === 'pt' ? 'Nome' : 'Nombre'}
                      </label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors duration-300"
                        placeholder={language === 'pt' ? 'Seu nome' : 'Su nombre'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm block">
                        {language === 'pt' ? 'Email' : 'Email'}
                      </label>
                      <input 
                        type="email" 
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors duration-300"
                        placeholder={language === 'pt' ? 'Seu email' : 'Su email'}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white/70 text-sm block">
                      {language === 'pt' ? 'Assunto' : 'Asunto'}
                    </label>
                    <select className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors duration-300 appearance-none">
                      <option value="" className="bg-neutral-900">
                        {language === 'pt' ? 'Selecione um assunto' : 'Seleccione un asunto'}
                      </option>
                      <option value="projeto" className="bg-neutral-900">
                        {language === 'pt' ? 'Novo projeto' : 'Nuevo proyecto'}
                      </option>
                      <option value="orçamento" className="bg-neutral-900">
                        {language === 'pt' ? 'Solicitar orçamento' : 'Solicitar presupuesto'}
                      </option>
                      <option value="parceria" className="bg-neutral-900">
                        {language === 'pt' ? 'Parceria' : 'Asociación'}
                      </option>
                      <option value="outro" className="bg-neutral-900">
                        {language === 'pt' ? 'Outro assunto' : 'Otro asunto'}
                      </option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white/70 text-sm block">
                      {language === 'pt' ? 'Mensagem' : 'Mensaje'}
                    </label>
                    <textarea 
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white px-4 py-3 h-36 focus:outline-none focus:border-accent/50 transition-colors duration-300 resize-none"
                      placeholder={language === 'pt' ? 'Sua mensagem' : 'Su mensaje'}
                    ></textarea>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="group inline-flex items-center justify-center overflow-hidden relative"
                      onMouseEnter={() => handleCtaHover(true)}
                      onMouseLeave={() => handleCtaHover(false)}
                    >
                      <motion.div 
                        className="relative z-10 bg-[#D4B798] px-10 py-4 text-black font-medium tracking-wide overflow-hidden group-hover:text-black transition-colors duration-300"
                        whileHover={{ 
                          scale: 1.05,
                          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                        }}
                      >
                        <span className="relative z-20">
                          {language === 'pt' ? 'Enviar mensagem' : 'Enviar mensaje'}
                        </span>
                        
                        {/* Radial expansion background effect */}
                        <motion.div 
                          className="absolute inset-0 z-10 bg-white/20"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ 
                            scale: 1.5, 
                            opacity: 1,
                            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                          }}
                          style={{ borderRadius: "50%", transformOrigin: "center" }}
                        />
                        
                        {/* Glow effect on hover */}
                        <motion.div 
                          className="absolute inset-0 z-0"
                          initial={{ boxShadow: "0 0 0 rgba(212, 183, 152, 0)" }}
                          whileHover={{ 
                            boxShadow: "0 0 20px rgba(212, 183, 152, 0.6)" 
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                      
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5, 
                            ease: "easeInOut" 
                          }}
                        >
                          <ArrowRight size={16} className="text-black" />
                        </motion.div>
                      </div>
                    </button>
                  </div>
                </motion.form>
              </div>
            </motion.div>
            
            {/* Info column */}
            <motion.div 
              className="col-span-12 md:col-span-5"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-full flex flex-col">
                <div className="bg-white/[0.06] backdrop-filter backdrop-blur-[8px] p-10 md:p-14 border border-white/10 mb-8 rounded-2xl shadow-lg">
                  <h3 className="text-white font-medium text-lg mb-8">
                    {language === 'pt' ? 'Informações de contato' : 'Información de contacto'}
                  </h3>
                  
                  <ul className="space-y-8">
                    <motion.li 
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4B798" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <div className="text-white/50 text-sm mb-1">
                          {language === 'pt' ? 'Endereço' : 'Dirección'}
                        </div>
                        <div className="text-white leading-relaxed">
                          Rua Augusta, 1500<br />
                          São Paulo, SP, Brasil
                        </div>
                      </div>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4B798" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="text-white/50 text-sm mb-1">
                          {language === 'pt' ? 'Telefone' : 'Teléfono'}
                        </div>
                        <div className="text-white">
                          +55 (11) 3456-7890
                        </div>
                      </div>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4B798" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <div>
                        <div className="text-white/50 text-sm mb-1">
                          Email
                        </div>
                        <div className="text-white">
                          contato@afettodesign.com
                        </div>
                      </div>
                    </motion.li>
                  </ul>
                </div>
                
                {/* Working hours */}
                <div className="bg-white/[0.06] backdrop-filter backdrop-blur-[8px] p-10 md:p-14 border border-white/10 flex-grow rounded-2xl shadow-lg">
                  <h3 className="text-white font-medium text-lg mb-8">
                    {language === 'pt' ? 'Horário de atendimento' : 'Horario de atención'}
                  </h3>
                  
                  <ul className="space-y-4">
                    <motion.li 
                      className="flex justify-between text-white/80"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      <span>{language === 'pt' ? 'Segunda - Sexta' : 'Lunes - Viernes'}</span>
                      <span>9:00 - 18:00</span>
                    </motion.li>
                    <motion.li 
                      className="flex justify-between text-white/80"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <span>{language === 'pt' ? 'Sábado' : 'Sábado'}</span>
                      <span>10:00 - 15:00</span>
                    </motion.li>
                    <motion.li 
                      className="flex justify-between text-white/80"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                    >
                      <span>{language === 'pt' ? 'Domingo' : 'Domingo'}</span>
                      <span>{language === 'pt' ? 'Fechado' : 'Cerrado'}</span>
                    </motion.li>
                  </ul>
                  
                  <motion.div 
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <div className="text-white/50 text-sm mb-3">
                      {language === 'pt' ? 'Siga-nos nas redes sociais' : 'Síganos en las redes sociales'}
                    </div>
                    <div className="flex space-x-4">
                      {['instagram', 'facebook', 'pinterest', 'linkedin'].map((social, idx) => (
                        <motion.a
                          key={social}
                          href={`https://${social}.com`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#D4B798] hover:border-[#D4B798] transition-colors duration-300"
                          whileHover={{ 
                            scale: 1.2,
                            backgroundColor: 'rgba(212, 183, 152, 0.1)',
                            transition: { duration: 0.3 }
                          }}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 1 + (idx * 0.1) }}
                        >
                          <Icon name={social} size={16} />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 bg-black/40 z-1 pointer-events-none opacity-40 mix-blend-overlay rounded-t-3xl" 
          style={{ 
            backgroundImage: 'url(/images/noise-pattern.png)', 
            backgroundSize: '120px 120px' 
          }}
        />
      </motion.section>
      
      {/* Elegant Footer with Parallax Effect */}
      <motion.footer 
        className="relative bg-neutral-900 overflow-hidden rounded-t-3xl shadow-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Parallax background */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ 
            y: useTransform(scrollY, [0, 1000], ['0%', '10%'])
          }}
        >
          <img 
            src="/images/footer-background.jpg" 
            alt="Footer background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-transparent"></div>
        </motion.div>
        
        {/* Top border accent */}
        <div className="relative z-10 border-t-2 border-[#D4B798]/40 w-full"></div>
        
        {/* Main footer content */}
        <div className="container mx-auto px-6 md:px-20 relative z-10 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-10">
            {/* Brand column */}
            <div className="md:col-span-4">
              <Link to="/" className="inline-block mb-6">
                <div className="flex items-center">
                  <svg width="50" height="24" viewBox="0 0 120 24" className="text-white">
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
                  <span className="ml-3 font-serif tracking-wider text-xl text-white">afetto</span>
                </div>
              </Link>
              
              <p className="text-white/60 mb-8 leading-relaxed">
                {language === 'pt' 
                  ? 'Criando experiências de design excepcionais, onde cada peça conta uma história única de artesanato e inovação.' 
                  : 'Creando experiencias de diseño excepcionales, donde cada pieza cuenta una historia única de artesanía e innovación.'}
              </p>
              
              {/* Social media links */}
              <div className="flex space-x-4">
                {['instagram', 'facebook', 'pinterest', 'linkedin'].map((social) => (
                  <motion.a
                    key={social}
                    href={`https://${social}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#D4B798] hover:border-[#D4B798] transition-colors duration-300"
                    whileHover={{ 
                      scale: 1.2,
                      backgroundColor: 'rgba(212, 183, 152, 0.1)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Icon name={social} size={16} />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Navigation links */}
            <div className="md:col-span-2">
              <h3 className="text-white font-medium tracking-wider uppercase text-sm mb-6">{language === 'pt' ? 'Links' : 'Enlaces'}</h3>
              <ul className="space-y-4">
                {[
                  { label: { pt: 'Início', es: 'Inicio' }, path: '/' },
                  { label: { pt: 'Projetos', es: 'Proyectos' }, path: '/portfolio' },
                  { label: { pt: 'Sobre', es: 'Sobre' }, path: '/sobre' },
                  { label: { pt: 'Processo', es: 'Proceso' }, path: '/processo' },
                  { label: { pt: 'Contato', es: 'Contacto' }, path: '/contato' }
                ].map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-white/60 hover:text-[#D4B798] transition-colors duration-300 group relative"
                    >
                      <span>{link.label[language]}</span>
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4B798] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Latest projects */}
            <div className="md:col-span-3">
              <h3 className="text-white font-medium tracking-wider uppercase text-sm mb-6">{language === 'pt' ? 'Últimos Projetos' : 'Últimos Proyectos'}</h3>
              <div className="grid grid-cols-2 gap-3">
                {featuredProjects.slice(0, 4).map((project) => (
                  <Link key={project.id} to={`/projeto/${project.slug}`} className="block overflow-hidden">
                    <motion.div 
                      className="w-full aspect-square relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Plus size={20} className="text-white" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Contact info */}
            <div className="md:col-span-3">
              <h3 className="text-white font-medium tracking-wider uppercase text-sm mb-6">{language === 'pt' ? 'Contato' : 'Contacto'}</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="mt-1 text-[#D4B798]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <span className="text-white/60">
                    Rua Augusta, 1500<br />
                    São Paulo, SP, Brasil
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="mt-1 text-[#D4B798]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <span className="text-white/60">+55 (11) 3456-7890</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="mt-1 text-[#D4B798]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <span className="text-white/60">contato@afettodesign.com</span>
                </li>
              </ul>
              
              {/* Newsletter subscription */}
              <div className="mt-8">
                <h4 className="text-white text-sm mb-4">{language === 'pt' ? 'Assine nossa newsletter' : 'Suscríbase a nuestro boletín'}</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder={language === 'pt' ? 'Seu email' : 'Su email'} 
                    className="bg-white/10 border border-white/20 text-white px-4 py-2 flex-grow focus:outline-none focus:border-[#D4B798]"
                  />
                  <button className="bg-[#D4B798] px-4 text-black font-medium hover:bg-[#D4B798]/90 transition-colors duration-300">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Copyright section */}
          <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/40 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Afetto Design. {language === 'pt' ? 'Todos os direitos reservados.' : 'Todos los derechos reservados.'}
            </div>
            <div className="text-white/40 text-sm">
              <Link to="/privacidade" className="hover:text-[#D4B798] transition-colors duration-300 mr-6">
                {language === 'pt' ? 'Política de Privacidade' : 'Política de Privacidad'}
              </Link>
              <Link to="/termos" className="hover:text-[#D4B798] transition-colors duration-300">
                {language === 'pt' ? 'Termos de Uso' : 'Términos de Uso'}
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
} 
export default Home;