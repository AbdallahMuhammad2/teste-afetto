import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useTransform, useScroll, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import useMousePosition from '../hooks/useMousePosition'; // We'll create this custom hook

type EntryPortalProps = {
  onSelect: (type: 'b2c' | 'b2b') => void;
};

// First, let's create our custom mouse position hook
// filepath: /c:/Users/abdal/OneDrive/Documentos/GitHub/teste-afetto/src/hooks/useMousePosition.ts
// export function useMousePosition() {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   
//   useEffect(() => {
//     const updateMousePosition = (ev: MouseEvent) => {
//       setMousePosition({ x: ev.clientX, y: ev.clientY });
//     };
//     
//     window.addEventListener('mousemove', updateMousePosition);
//     
//     return () => {
//       window.removeEventListener('mousemove', updateMousePosition);
//     };
//   }, []);
//   
//   return mousePosition;
// }

const EntryPortal: React.FC<EntryPortalProps> = ({ onSelect }) => {
  const { language } = useContext(LanguageContext);
  const [hoveredOption, setHoveredOption] = useState<'b2c' | 'b2b' | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const mainControls = useAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse position for parallax effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smoothed spring animations for mouse-following elements
  const springConfig = { stiffness: 150, damping: 25 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  // Transform values for parallax effects on bg elements
  const bgX = useTransform(mouseX, [-500, 500], [10, -10]);
  const bgY = useTransform(mouseY, [-500, 500], [10, -10]);
  
  // Track mouse movement for effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX - window.innerWidth / 2);
      mouseY.set(clientY - window.innerHeight / 2);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Create a 3-stage loading animation sequence
  useEffect(() => {
    // Play audio when site loads (commented out as it needs user interaction)
    // const ambientSound = new Audio('/sounds/ambient-luxury.mp3');
    // ambientSound.volume = 0.1;
    // ambientSound.loop = true;
    // ambientSound.play().catch(e => console.log("Audio playback prevented: ", e));
    
    const sequence = async () => {
      // Prepare DOM for animations
      document.body.style.overflow = 'hidden';
      
      // Stage 1: Initial fade in
      await new Promise(resolve => setTimeout(resolve, 600));
      setLoadingStage(1); // Fade in background
      
      // Stage 2: Logo reveal
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingStage(2); // Reveal logo
      
      // Stage 3: Show divider lines
      await new Promise(resolve => setTimeout(resolve, 700));
      setLoadingStage(3); // Show accent lines
      
      // Stage 4: Main content begins
      await new Promise(resolve => setTimeout(resolve, 600));
      setLoadingStage(4); // Show main heading
      mainControls.start("visible");
      
      // Stage 5: Show options
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoadingStage(5); // Show options
      
      // Enable custom cursor after everything is loaded
      await new Promise(resolve => setTimeout(resolve, 300));
      setShowCursor(true);
    };
    
    sequence();
    
    // Auto-play background video when ready
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Auto-play prevented:", e));
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mainControls]);

  const translations = {
    headline: {
      pt: 'EXPERIÊNCIA AFETTO',
      es: 'EXPERIENCIA AFETTO'
    },
    title: {
      pt: 'Escolha Sua Jornada',
      es: 'Elige Tu Recorrido'
    },
    lead: {
      pt: 'Bem-vindo à',
      es: 'Bienvenido a'
    },
    tagline: {
      pt: 'Arte do Design. Perfeição dos Detalhes.',
      es: 'Arte del Diseño. Perfección de los Detalles.'
    },
    consumer: {
      title: {
        pt: 'COLEÇÃO RESIDENCIAL',
        es: 'COLECCIÓN RESIDENCIAL'
      },
      subtitle: {
        pt: 'Exclusividade & Elegância',
        es: 'Exclusividad & Elegancia'
      },
      description: {
        pt: 'Nossa coleção de peças artesanais premium, concebidas por mestres artesãos italianos, com materiais selecionados e acabamentos impecáveis.',
        es: 'Nuestra colección de piezas artesanales premium, concebidas por maestros artesanos italianos, con materiales seleccionados y acabados impecables.'
      },
      features: {
        pt: ['Edições Limitadas', 'Materiais Nobres', 'Design Autoral', 'Acabamento Artesanal'],
        es: ['Ediciones Limitadas', 'Materiales Nobles', 'Diseño Autoral', 'Acabado Artesanal']
      },
      cta: {
        pt: 'EXPLORAR COLEÇÃO',
        es: 'EXPLORAR COLECCIÓN'
      }
    },
    business: {
      title: {
        pt: 'SOLUÇÕES CORPORATIVAS',
        es: 'SOLUCIONES CORPORATIVAS'
      },
      subtitle: {
        pt: 'Expertise & Personalização',
        es: 'Experiencia & Personalización'
      },
      description: {
        pt: 'Soluções exclusivas para projetos de alta complexidade, com especificações técnicas detalhadas e possibilidades ilimitadas de personalização.',
        es: 'Soluciones exclusivas para proyectos de alta complejidad, con especificaciones técnicas detalladas y posibilidades ilimitadas de personalización.'
      },
      features: {
        pt: ['Especificações Técnicas', 'Projetos Sob Medida', 'Assessoria Especializada', 'Condições Especiais'],
        es: ['Especificaciones Técnicas', 'Proyectos a Medida', 'Asesoramiento Especializado', 'Condiciones Especiales']
      },
      cta: {
        pt: 'ACESSAR PORTAL B2B',
        es: 'ACCEDER PORTAL B2B'
      }
    }
  };

  // Animation variants with cinematic timing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1] 
      }
    },
    hover: (direction: 'left' | 'right') => ({
      y: -15,
      x: direction === 'left' ? -8 : 8,
      transition: { 
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] 
      }
    })
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: { 
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  const splitTextAnimation = (text: string) => {
    return (
      <span className="inline-block overflow-hidden">
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ y: 80, opacity: 0 }}
            animate={{ 
              y: loadingStage >= 4 ? 0 : 80, 
              opacity: loadingStage >= 4 ? 1 : 0 
            }}
            transition={{ 
              duration: 1, 
              ease: [0.16, 1, 0.3, 1],
              delay: 1.2 + index * 0.03 
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    );
  };

  // Handle mouse hover state for custom cursor
  const handleMouseEnter = (type: 'b2c' | 'b2b') => {
    setHoveredOption(type);
    setCursorText(type === 'b2c' ? 'EXPLORAR' : 'ACESSAR');
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredOption(null);
    setCursorText('');
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-black select-none"
    >
      {/* Custom cursor */}
      {showCursor && (
        <motion.div 
          className="fixed top-0 left-0 z-[100] pointer-events-none mix-blend-difference"
          style={{ 
            x: cursorX,
            y: cursorY,
          }}
        >
          <motion.div 
            className={`w-6 h-6 rounded-full bg-white flex items-center justify-center
                      ${cursorText ? 'w-24 h-24' : 'w-6 h-6'}`}
            animate={{ 
              width: cursorText ? 80 : 24,
              height: cursorText ? 80 : 24,
              opacity: 1
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {cursorText && (
              <motion.span 
                className="text-black uppercase text-xs tracking-widest font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {cursorText}
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Initial loading animation with brand-inspired elements */}
      <AnimatePresence>
        {loadingStage < 1 && (
          <motion.div 
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              className="relative w-32 h-32"
              animate={{ rotate: 90 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            >
              <motion.div 
                className="absolute inset-0 border border-[#D3A17E]/20 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div 
                className="absolute inset-3 border border-[#D3A17E]/30 rounded-full"
                animate={{ scale: [1.1, 1, 1.1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              />
              <motion.div 
                className="absolute inset-6 border border-[#D3A17E]/50 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
              />
              <motion.div 
                className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.9 }}
              >
                <span className="font-serif text-2xl text-[#D3A17E]">A</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic background layers */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Dynamic background layer with parallax effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            x: bgX,
            y: bgY,
          }}
        >
          {/* Blurred abstract background video */}
          <motion.div
            className="absolute inset-0 opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStage >= 1 ? 0.4 : 0 }}
            transition={{ duration: 3 }}
          >
            <motion.video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
              autoPlay
              muted
              loop
              playsInline
              initial={{ scale: 1.3 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 10 }}
            >
              <source src="/videos/luxury-ambient-dark.mp4" type="video/mp4" />
            </motion.video>
          </motion.div>
          
          {/* Color gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStage >= 1 ? 0.9 : 0 }}
            transition={{ duration: 2 }}
          />

          {/* Light rays effect */}
          <motion.div
            className="absolute inset-0 opacity-20 bg-[url('/images/light-rays.png')] bg-cover bg-center mix-blend-overlay"
            initial={{ opacity: 0, rotate: -5, scale: 1.2 }}
            animate={{ 
              opacity: loadingStage >= 2 ? 0.2 : 0,
              rotate: 0,
              scale: 1
            }}
            transition={{ duration: 4 }}
          />
          
          {/* Gold dust particles */}
          <motion.div
            className="absolute inset-0 opacity-30 bg-[url('/images/gold-particles.png')] bg-cover bg-center"
            style={{ x: useTransform(mouseX, [-500, 500], [20, -20]), y: useTransform(mouseY, [-500, 500], [20, -20]) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStage >= 2 ? 0.3 : 0 }}
            transition={{ duration: 2 }}
          />
        </motion.div>
        
        {/* Fine grain overlay */}
        <motion.div 
          className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/images/film-grain.png')] bg-repeat"
          initial={{ opacity: 0 }}
          animate={{ opacity: loadingStage >= 1 ? 0.2 : 0 }}
          transition={{ duration: 3 }}
        />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 z-10 bg-radial-vignette opacity-80 pointer-events-none" />
      </div>

      {/* Golden horizontal lines */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-[1px] z-20"
        style={{ background: 'linear-gradient(to right, transparent, rgba(211,161,126,0.4) 20%, rgba(211,161,126,0.8) 50%, rgba(211,161,126,0.4) 80%, transparent 100%)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: loadingStage >= 3 ? 1 : 0, 
          opacity: loadingStage >= 3 ? 1 : 0 
        }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[1px] z-20"
        style={{ background: 'linear-gradient(to right, transparent, rgba(211,161,126,0.4) 20%, rgba(211,161,126,0.8) 50%, rgba(211,161,126,0.4) 80%, transparent 100%)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: loadingStage >= 3 ? 1 : 0, 
          opacity: loadingStage >= 3 ? 1 : 0 
        }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />

      {/* Cinematic logo reveal - Center to top */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: loadingStage >= 2 ? 1 : 0,
          y: loadingStage >= 4 ? -300 : 0,
          scale: loadingStage >= 4 ? 0.8 : 1
        }}
        transition={{ 
          opacity: { duration: 1 }, 
          y: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 1.8, ease: [0.16, 1, 0.3, 1] }
        }}
      >
        <motion.div 
          className="relative w-40 h-40 flex items-center justify-center mb-8"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ 
            opacity: loadingStage >= 2 ? 1 : 0,
            scale: 1
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated circular elements */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-[#D3A17E]/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-4 rounded-full border border-[#D3A17E]/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-8 rounded-full border border-[#D3A17E]/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Logo center */}
          <motion.div 
            className="w-20 h-20 border border-[#D3A17E] relative flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStage >= 2 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="absolute inset-0.5 bg-black/90 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: loadingStage >= 2 ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.span 
                className="font-serif text-3xl text-[#D3A17E]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: loadingStage >= 2 ? 1 : 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                A
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.span 
          className="font-serif tracking-[1.2em] text-3xl text-white uppercase pl-[1.2em]"
          initial={{ opacity: 0, letterSpacing: "0.8em" }}
          animate={{ 
            opacity: loadingStage >= 2 ? 1 : 0,
            letterSpacing: "1.2em"
          }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Afetto
        </motion.span>
        
        <motion.span 
          className="text-[#D3A17E]/90 mt-4 tracking-[0.5em] uppercase text-xs pl-[0.5em]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: loadingStage >= 2 ? 0.9 : 0, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {translations.tagline[language]}
        </motion.span>
      </motion.div>

      {/* Main content area */}
      <motion.div 
        className="absolute inset-0 z-20 flex flex-col justify-center items-center px-6"
        variants={containerVariants}
        initial="hidden"
        animate={mainControls}
      >
        <div className="container mx-auto max-w-[1600px]">
          {/* Upper headline that fades in */}
          <motion.div 
            className="text-center mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: loadingStage >= 4 ? 1 : 0,
              y: loadingStage >= 4 ? 0 : 20
            }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.span 
              className="inline-block text-[#D3A17E]/80 text-xs tracking-[0.5em] uppercase pl-[0.5em] font-light mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: loadingStage >= 4 ? 0.8 : 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {translations.headline[language]}
            </motion.span>
          </motion.div>
          
          {/* Main title with letter-by-letter animation */}
          <motion.div 
            className="text-center mb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStage >= 4 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-wider leading-tight mb-6">
              {splitTextAnimation(translations.title[language])}
            </h1>
            
            <motion.div 
              className="h-[1px] w-0 mx-auto"
              style={{ background: 'linear-gradient(to right, transparent, rgba(211,161,126,0.4) 20%, rgba(211,161,126,0.8) 50%, rgba(211,161,126,0.4) 80%, transparent 100%)' }}
              initial={{ width: 0 }}
              animate={{ width: loadingStage >= 4 ? 180 : 0 }}
              transition={{ duration: 1.5, delay: 1.8 }}
            />
          </motion.div>

          {/* The two options in a stunning layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-20">
            {/* Consumer option - museum quality display */}
            <motion.div
              className="relative group cursor-pointer overflow-hidden perspective-1000"
              custom="left"
              variants={cardVariants}
              whileHover="hover"
              onMouseEnter={() => handleMouseEnter('b2c')}
              onMouseLeave={handleMouseLeave}
              onClick={() => onSelect('b2c')}
              style={{ opacity: loadingStage >= 5 ? 1 : 0 }}
            >
              <div className="relative aspect-[3/4] overflow-hidden transform-gpu transition-transform duration-700 ease-out will-change-transform">
                {/* Background with parallax effect */}
                <motion.div
                  className="absolute inset-0 bg-[url('/images/residential-luxury.jpg')] bg-cover bg-center z-0 will-change-transform"
                  style={{
                    x: useTransform(mouseX, [-500, 500], [15, -15], { clamp: false }),
                    y: useTransform(mouseY, [-500, 500], [15, -15], { clamp: false }),
                  }}
                  animate={{ 
                    scale: hoveredOption === 'b2c' ? 1.08 : 1,
                    filter: hoveredOption === 'b2c' ? 'brightness(1.15)' : 'brightness(1)'
                  }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {/* Premium overlay with depth */}
                <motion.div 
                  className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent"
                  animate={{ opacity: hoveredOption === 'b2c' ? 0.6 : 0.8 }}
                  transition={{ duration: 0.8 }}
                />
                
                {/* Gold accent elements */}
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: hoveredOption === 'b2c' ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleX: 0, originX: 1 }}
                  animate={{ scaleX: hoveredOption === 'b2c' ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {/* Left and right borders */}
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ scaleY: hoveredOption === 'b2c' ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
                
                <motion.div 
                  className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: hoveredOption === 'b2c' ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
                
                {/* Content with animation on hover */}
                <div className="absolute inset-0 p-8 sm:p-10 md:p-12 z-30 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: hoveredOption === 'b2c' ? -10 : 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div 
                      className="mb-5 overflow-hidden"
                      initial={{ height: 24 }}
                      whileHover={{ height: 30 }}
                    >
                      <span className="text-[#D3A17E] text-xs uppercase tracking-[0.5em] pl-[0.5em] font-light">
                        {translations.consumer.subtitle[language]}
                      </span>
                    </motion.div>
                    
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-6 tracking-wider">
                      {translations.consumer.title[language]}
                    </h2>
                    
                    <p className="text-white/90 mb-8 font-light leading-relaxed md:text-lg max-w-lg">
                      {translations.consumer.description[language]}
                    </p>
                    
                    {/* Feature list with fancy markers */}
                    <ul className="grid grid-cols-2 gap-4 mb-10">
                      {translations.consumer.features[language].map((feature, index) => (
                        <li key={index} className="flex items-center text-white/80 group">
                          <motion.span
                            className="h-[1px] w-6 bg-[#D3A17E]/60 mr-3"
                            initial={{ scaleX: 0, originX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          />
                          <span className="text-sm tracking-wider group-hover:text-[#D3A17E] transition-colors duration-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.div
                      className="inline-flex items-center"
                      initial={{ x: 0 }}
                      animate={{ x: hoveredOption === 'b2c' ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-[#D3A17E] text-sm tracking-widest uppercase pb-1 border-b border-[#D3A17E]/30">
                        {translations.consumer.cta[language]}
                      </span>
                      <ChevronRight size={18} className="text-[#D3A17E] ml-1" strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Business option with elegant styling */}
            <motion.div
              className="relative group cursor-pointer overflow-hidden perspective-1000"
              custom="right"
              variants={cardVariants}
              whileHover="hover"
              onMouseEnter={() => handleMouseEnter('b2b')}
              onMouseLeave={handleMouseLeave}
              onClick={() => onSelect('b2b')}
              style={{ opacity: loadingStage >= 5 ? 1 : 0 }}
            >
              <div className="relative aspect-[3/4] overflow-hidden transform-gpu transition-transform duration-700 ease-out will-change-transform">
                {/* Background with parallax effect */}
                <motion.div
                  className="absolute inset-0 bg-[url('/images/corporate-elegant.jpg')] bg-cover bg-center z-0 will-change-transform"
                  style={{
                    x: useTransform(mouseX, [-500, 500], [15, -15], { clamp: false }),
                    y: useTransform(mouseY, [-500, 500], [15, -15], { clamp: false }),
                  }}
                  animate={{ 
                    scale: hoveredOption === 'b2b' ? 1.08 : 1,
                    filter: hoveredOption === 'b2b' ? 'brightness(1.15)' : 'brightness(1)'
                  }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {/* Premium overlay with depth */}
                <motion.div 
                  className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent"
                  animate={{ opacity: hoveredOption === 'b2b' ? 0.6 : 0.8 }}
                  transition={{ duration: 0.8 }}
                />
                
                {/* Gold accent elements */}
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: hoveredOption === 'b2b' ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleX: 0, originX: 1 }}
                  animate={{ scaleX: hoveredOption === 'b2b' ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {/* Left and right borders */}
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ scaleY: hoveredOption === 'b2b' ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
                
                <motion.div 
                  className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: hoveredOption === 'b2b' ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
                
                {/* Content with animation on hover */}
                <div className="absolute inset-0 p-8 sm:p-10 md:p-12 z-30 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: hoveredOption === 'b2b' ? -10 : 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div 
                      className="mb-5 overflow-hidden"
                      initial={{ height: 24 }}
                      whileHover={{ height: 30 }}
                    >
                      <span className="text-[#D3A17E] text-xs uppercase tracking-[0.5em] pl-[0.5em] font-light">
                        {translations.business.subtitle[language]}
                      </span>
                    </motion.div>
                    
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-6 tracking-wider">
                      {translations.business.title[language]}
                    </h2>
                    
                    <p className="text-white/90 mb-8 font-light leading-relaxed md:text-lg max-w-lg">
                      {translations.business.description[language]}
                    </p>
                    
                    {/* Feature list with fancy markers */}
                    <ul className="grid grid-cols-2 gap-4 mb-10">
                      {translations.business.features[language].map((feature, index) => (
                        <li key={index} className="flex items-center text-white/80 group">
                          <motion.span
                            className="h-[1px] w-6 bg-[#D3A17E]/60 mr-3"
                            initial={{ scaleX: 0, originX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          />
                          <span className="text-sm tracking-wider group-hover:text-[#D3A17E] transition-colors duration-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.div
                      className="inline-flex items-center"
                      initial={{ x: 0 }}
                      animate={{ x: hoveredOption === 'b2b' ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-[#D3A17E] text-sm tracking-widest uppercase pb-1 border-b border-[#D3A17E]/30">
                        {translations.business.cta[language]}
                      </span>
                      <ChevronRight size={18} className="text-[#D3A17E] ml-1" strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Language selector with ultra-premium styling */}
      <motion.div 
        className="absolute top-8 right-12 z-30 flex items-center space-x-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: loadingStage >= 4 ? 1 : 0, 
          y: loadingStage >= 4 ? 0 : -10 
        }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <Link 
          to="?lang=pt" 
          className={`relative px-4 py-2 overflow-hidden ${language === 'pt' ? 'text-[#D3A17E]' : 'text-white/40 hover:text-white/80'} transition-colors duration-500`}
        >
          <span className="relative z-10 text-xs uppercase tracking-[0.3em] pl-[0.3em]">
            Português
          </span>
          {language === 'pt' && (
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-[#D3A17E]/30" 
              layoutId="langUnderline"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Link>
        
        <span className="text-white/20 text-xs">|</span>
        
        <Link 
          to="?lang=es" 
          className={`relative px-4 py-2 overflow-hidden ${language === 'es' ? 'text-[#D3A17E]' : 'text-white/40 hover:text-white/80'} transition-colors duration-500`}
        >
          <span className="relative z-10 text-xs uppercase tracking-[0.3em] pl-[0.3em]">
            Español
          </span>
          {language === 'es' && (
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-[#D3A17E]/30" 
              layoutId="langUnderline"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Link>
      </motion.div>

      {/* Signature bottom decoration */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: loadingStage >= 5 ? 0.8 : 0 }}
        transition={{ duration: 0.6, delay: 2.4 }}
      >
        <motion.div 
          className="w-[1px] h-10 bg-[#D3A17E]/30 mx-4"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: loadingStage >= 5 ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
        />
        <motion.div 
          className="text-white/40 text-xs uppercase tracking-[0.3em] pl-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: loadingStage >= 5 ? 0.7 : 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          © {new Date().getFullYear()} <span className="text-[#D3A17E]/60">Afetto</span> Design
        </motion.div>
        <motion.div 
          className="w-[1px] h-10 bg-[#D3A17E]/30 mx-4"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: loadingStage >= 5 ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
        />
      </motion.div>
    </div>
  );
};

export default EntryPortal;