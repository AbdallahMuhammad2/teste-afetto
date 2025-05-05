import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import useMousePosition from '../hooks/useMousePosition';

type EntryPortalProps = {
  onSelect: (type: 'b2c' | 'b2b') => void;
};

const EntryPortal: React.FC<EntryPortalProps> = ({ onSelect }) => {
  const { language } = useContext(LanguageContext);
  const [hoveredOption, setHoveredOption] = useState<'b2c' | 'b2b' | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'text' | 'button'>('default');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const mainControls = useAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const transitionSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Track mouse position for dynamic effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smoothed spring animations for mouse-following elements
  const springConfig = { stiffness: 150, damping: 25 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  // Transform values for parallax effects on bg elements
  const bgX = useTransform(mouseX, [-500, 500], [10, -10]);
  const bgY = useTransform(mouseY, [-500, 500], [10, -10]);
  
  // Additional transforms for more dynamic elements
  const lightX = useTransform(mouseX, [-500, 500], [20, -20]);
  const lightY = useTransform(mouseY, [-500, 500], [20, -20]);
  const particlesX = useTransform(mouseX, [-500, 500], [-15, 15]);
  const particlesY = useTransform(mouseY, [-500, 500], [-15, 15]);
  
  // Enhanced cursor transforms for magnetic effect
  const magneticCursorX = useTransform(mouseX, [-500, 500], [-10, 10]);
  const magneticCursorY = useTransform(mouseY, [-500, 500], [-10, 10]);
  
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

  // Initialize sound effects
  useEffect(() => {
    ambientSoundRef.current = new Audio('/sounds/ambient-luxury.mp3');
    if (ambientSoundRef.current) {
      ambientSoundRef.current.volume = 0.15;
      ambientSoundRef.current.loop = true;
    }
    
    hoverSoundRef.current = new Audio('/sounds/hover-elegant.mp3');
    if (hoverSoundRef.current) {
      hoverSoundRef.current.volume = 0.2;
    }
    
    clickSoundRef.current = new Audio('/sounds/click-soft.mp3');
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = 0.3;
    }
    
    transitionSoundRef.current = new Audio('/sounds/transition-smooth.mp3');
    if (transitionSoundRef.current) {
      transitionSoundRef.current.volume = 0.25;
    }
    
    return () => {
      if (ambientSoundRef.current) ambientSoundRef.current.pause();
      if (hoverSoundRef.current) hoverSoundRef.current.pause();
      if (clickSoundRef.current) clickSoundRef.current.pause();
      if (transitionSoundRef.current) transitionSoundRef.current.pause();
    };
  }, []);
  
  // Handle audio toggle
  const toggleAudio = () => {
    if (audioEnabled) {
      if (ambientSoundRef.current) ambientSoundRef.current.pause();
      setAudioEnabled(false);
    } else {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.play().catch(e => console.log("Audio playback prevented: ", e));
        if (transitionSoundRef.current) {
          transitionSoundRef.current.play().catch(e => console.log("Audio playback prevented: ", e));
        }
      }
      setAudioEnabled(true);
    }
  };

  // Play hover sound effect
  const playHoverSound = () => {
    if (audioEnabled && hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(e => console.log("Audio playback prevented: ", e));
    }
  };
  
  // Play click sound effect
  const playClickSound = () => {
    if (audioEnabled && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(e => console.log("Audio playback prevented: ", e));
    }
  };

  // Enhanced loading sequence with more stages for finer transitions
  useEffect(() => {
    // Prepare DOM for animations
    document.body.style.overflow = 'hidden';
    
    const sequence = async () => {
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
      
      // Stage 6: Reveal additional elements and enable interactions
      await new Promise(resolve => setTimeout(resolve, 300));
      setLoadingStage(6); // Fully loaded state
      
      // Enable custom cursor after everything is loaded
      await new Promise(resolve => setTimeout(resolve, 200));
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
    },
    audio: {
      pt: 'Experiência de áudio',
      es: 'Experiencia de audio'
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
      y: -20,
      x: direction === 'left' ? -10 : 10,
      transition: { 
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] 
      }
    })
  };

  const cursorVariants = {
    default: {
      width: 24,
      height: 24,
      opacity: 0.6
    },
    text: {
      width: 80,
      height: 80,
      opacity: 1
    },
    button: {
      width: 80,
      height: 80,
      opacity: 1
    }
  };

  // Enhanced split text animation with staggered letters
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
    setCursorVariant('text');
    playHoverSound();
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredOption(null);
    setCursorText('');
    setCursorVariant('default');
  };

  // Handle option selection with sound effect
  const handleSelect = (type: 'b2c' | 'b2b') => {
    playClickSound();
    setTimeout(() => onSelect(type), 200);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-black select-none"
    >
      {/* Custom cursor with magnetic effect */}
      {showCursor && (
        <motion.div 
          className="fixed top-0 left-0 z-[100] pointer-events-none mix-blend-difference"
          style={{ 
            x: cursorX,
            y: cursorY,
          }}
        >
          <motion.div 
            className="flex items-center justify-center"
            variants={cursorVariants}
            animate={cursorVariant}
            transition={{ 
              duration: 0.3, 
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.2 } 
            }}
          >
            <motion.div
              className="absolute rounded-full bg-white"
              animate={{ 
                width: cursorVariant === 'default' ? 24 : cursorVariant === 'text' ? 80 : 60,
                height: cursorVariant === 'default' ? 24 : cursorVariant === 'text' ? 80 : 60,
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            
            {cursorText && (
              <motion.span 
                className="text-black uppercase text-xs tracking-widest font-light relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
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
              {/* Animated rings with glowing effect */}
              <motion.div 
                className="absolute inset-0 border border-[#D3A17E]/20 rounded-full"
                animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(211,161,126,0)", "0 0 20px rgba(211,161,126,0.2)", "0 0 0px rgba(211,161,126,0)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div 
                className="absolute inset-3 border border-[#D3A17E]/30 rounded-full"
                animate={{ scale: [1.1, 1, 1.1], boxShadow: ["0 0 0px rgba(211,161,126,0)", "0 0 15px rgba(211,161,126,0.3)", "0 0 0px rgba(211,161,126,0)"] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              />
              <motion.div 
                className="absolute inset-6 border border-[#D3A17E]/50 rounded-full"
                animate={{ scale: [1, 1.2, 1], boxShadow: ["0 0 0px rgba(211,161,126,0)", "0 0 10px rgba(211,161,126,0.4)", "0 0 0px rgba(211,161,126,0)"] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
              />
              <motion.div 
                className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.9 }}
              >
                <motion.span 
                  className="font-serif text-2xl text-[#D3A17E]"
                  animate={{ 
                    textShadow: [
                      "0 0 0px rgba(211,161,126,0)", 
                      "0 0 10px rgba(211,161,126,0.8)", 
                      "0 0 0px rgba(211,161,126,0)"
                    ] 
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  A
                </motion.span>
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
              animate={{ 
                scale: loadingStage >= 6 ? 1.05 : 1.1 
              }}
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

          {/* Enhanced light rays effect with parallax */}
          <motion.div
            className="absolute inset-0 opacity-20 bg-[url('/images/light-rays.png')] bg-cover bg-center mix-blend-overlay"
            style={{
              x: lightX,
              y: lightY,
              scale: 1.1
            }}
            initial={{ opacity: 0, rotate: -5, scale: 1.2 }}
            animate={{ 
              opacity: loadingStage >= 2 ? 0.2 : 0,
              rotate: 0,
              scale: 1.1
            }}
            transition={{ duration: 4 }}
          />
          
          {/* Gold dust particles with enhanced parallax */}
          <motion.div
            className="absolute inset-0 opacity-30 bg-[url('/images/gold-particles.png')] bg-cover bg-center"
            style={{ 
              x: particlesX,
              y: particlesY
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStage >= 2 ? 0.3 : 0 }}
            transition={{ duration: 2 }}
          />
          
          {/* Dynamic radial spotlight following mouse position */}
          <motion.div
            className="absolute inset-0 opacity-0 radial-spotlight"
            style={{ 
              opacity: loadingStage >= 6 ? 0.3 : 0,
              background: `radial-gradient(circle 800px at ${mouseX.get() + window.innerWidth/2}px ${mouseY.get() + window.innerHeight/2}px, rgba(211,161,126,0.08), transparent)` 
            }}
          />
        </motion.div>
        
        {/* Fine grain overlay with animation */}
        <motion.div 
          className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/images/film-grain.png')] bg-repeat"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: loadingStage >= 1 ? [0.15, 0.2, 0.15] : 0 
          }}
          transition={{ 
            opacity: { 
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror" 
            } 
          }}
        />
        
        {/* Enhanced vignette effect */}
        <div className="absolute inset-0 z-10 bg-radial-vignette opacity-80 pointer-events-none" />
        
        {/* Subtle scanline effect */}
        <motion.div 
          className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('/images/scanlines.png')] bg-repeat"
          animate={{
            backgroundPositionY: [0, 100],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "linear" 
          }}
        />
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

      {/* Enhanced logo reveal with 3D effect */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center perspective-1000"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: loadingStage >= 2 ? 1 : 0,
          y: loadingStage >= 4 ? -300 : 0,
          scale: loadingStage >= 4 ? 0.8 : 1,
          rotateX: loadingStage >= 4 ? [0, 10, 0] : 0
        }}
        transition={{ 
          opacity: { duration: 1 }, 
          y: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
          rotateX: { duration: 2, ease: "easeInOut" }
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
          {/* Animated circular elements with glow */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-[#D3A17E]/20"
            animate={{ 
              rotate: 360,
              boxShadow: ["0 0 0px rgba(211,161,126,0)", "0 0 15px rgba(211,161,126,0.15)", "0 0 0px rgba(211,161,126,0)"]
            }}
            transition={{ 
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 4, repeat: Infinity, repeatType: "mirror" }
            }}
          />
          <motion.div 
            className="absolute inset-4 rounded-full border border-[#D3A17E]/30"
            animate={{ 
              rotate: -360,
              boxShadow: ["0 0 0px rgba(211,161,126,0)", "0 0 15px rgba(211,161,126,0.2)", "0 0 0px rgba(211,161,126,0)"]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 3, repeat: Infinity, repeatType: "mirror", delay: 0.5 }
            }}
          />
          <motion.div 
            className="absolute inset-8 rounded-full border border-[#D3A17E]/50"
            animate={{ 
              rotate: 360,
              boxShadow: ["0 0 0px rgba(211,161,126,0)", "0 0 15px rgba(211,161,126,0.3)", "0 0 0px rgba(211,161,126,0)"] 
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 2.5, repeat: Infinity, repeatType: "mirror", delay: 1 }
            }}
          />
          
          {/* Logo center with glowing effect */}
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
                animate={{ 
                  opacity: loadingStage >= 2 ? 1 : 0, 
                  scale: 1,
                  textShadow: ["0 0 0px rgba(211,161,126,0)", "0 0 10px rgba(211,161,126,0.8)", "0 0 0px rgba(211,161,126,0)"]
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.7 },
                  scale: { duration: 0.8, delay: 0.7 },
                  textShadow: { duration: 3, repeat: Infinity, repeatType: "mirror" }
                }}
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
            letterSpacing: "1.2em",
            textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.3)", "0 0 0px rgba(255,255,255,0)"]
          }}
          transition={{ 
            opacity: { duration: 1.5, delay: 0.8 },
            letterSpacing: { duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] },
            textShadow: { duration: 4, repeat: Infinity, repeatType: "mirror" }
          }}
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

      {/* Main content area with enhanced 3D perspective */}
      <motion.div 
        className="absolute inset-0 z-20 flex flex-col justify-center items-center px-6 perspective-1200"
        variants={containerVariants}
        initial="hidden"
        animate={mainControls}
      >
        <div className="container mx-auto max-w-[1600px]">
          {/* Upper headline with enhanced fade in */}
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
              animate={{ 
                opacity: loadingStage >= 4 ? [0.7, 0.9, 0.7] : 0 
              }}
              transition={{ 
                opacity: { 
                  duration: 4, 
                  delay: 0.6, 
                  repeat: Infinity, 
                  repeatType: "mirror" 
                } 
              }}
            >
              {translations.headline[language]}
            </motion.span>
          </motion.div>
          
          {/* Enhanced main title with letter-by-letter animation and 3D effect */}
          <motion.div 
            className="text-center mb-32 perspective-1000"
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStage >= 4 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-wider leading-tight mb-6"
              initial={{ rotateX: 20 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {splitTextAnimation(translations.title[language])}
            </motion.h1>
            
            <motion.div 
              className="h-[1px] w-0 mx-auto"
              style={{ background: 'linear-gradient(to right, transparent, rgba(211,161,126,0.4) 20%, rgba(211,161,126,0.8) 50%, rgba(211,161,126,0.4) 80%, transparent 100%)' }}
              initial={{ width: 0 }}
              animate={{ 
                width: loadingStage >= 4 ? 180 : 0,
                boxShadow: loadingStage >= 5 ? ["0 0 0px rgba(211,161,126,0)", "0 0 10px rgba(211,161,126,0.6)", "0 0 0px rgba(211,161,126,0)"] : "none"
              }}
              transition={{ 
                width: { duration: 1.5, delay: 1.8 },
                boxShadow: { duration: 3, repeat: Infinity, repeatType: "mirror" }
              }}
            />
          </motion.div>

          {/* The two options in a stunning layout with 3D effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-20 perspective-1200">
            {/* Consumer option with enhanced 3D effect */}
            <motion.div
              className="relative group cursor-pointer overflow-hidden perspective-1000 rounded-sm"
              custom="left"
              variants={cardVariants}
              whileHover="hover"
              onMouseEnter={() => handleMouseEnter('b2c')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleSelect('b2c')}
              style={{ 
                opacity: loadingStage >= 5 ? 1 : 0,
                boxShadow: hoveredOption === 'b2c' ? "0 25px 50px -12px rgba(211, 161, 126, 0.15)" : "0 15px 30px -15px rgba(0, 0, 0, 0.25)"
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden transform-gpu transition-transform duration-700 ease-out will-change-transform">
                {/* Background with enhanced parallax effect */}
                <motion.div
                  className="absolute inset-0 bg-[url('/images/residential-luxury.jpg')] bg-cover bg-center z-0 will-change-transform"
                  style={{
                    x: useTransform(mouseX, [-500, 500], [20, -20], { clamp: false }),
                    y: useTransform(mouseY, [-500, 500], [20, -20], { clamp: false }),
                    rotateX: useTransform(mouseY, [-500, 500], [1, -1], { clamp: false }),
                    rotateY: useTransform(mouseX, [-500, 500], [-1, 1], { clamp: false }),
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
                
                {/* Enhanced gold accent elements with glow effect */}
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ 
                    scaleX: hoveredOption === 'b2c' ? 1 : 0,
                    boxShadow: hoveredOption === 'b2c' ? "0 0 10px rgba(211,161,126,0.4)" : "none"
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleX: 0, originX: 1 }}
                  animate={{ 
                    scaleX: hoveredOption === 'b2c' ? 1 : 0,
                    boxShadow: hoveredOption === 'b2c' ? "0 0 10px rgba(211,161,126,0.4)" : "none"
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {/* Left and right borders with enhanced glow */}
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ 
                    scaleY: hoveredOption === 'b2c' ? 1 : 0,
                    boxShadow: hoveredOption === 'b2c' ? "0 0 10px rgba(211,161,126,0.4)" : "none"
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
                
                <motion.div 
                  className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ 
                    scaleY: hoveredOption === 'b2c' ? 1 : 0,
                    boxShadow: hoveredOption === 'b2c' ? "0 0 10px rgba(211,161,126,0.4)" : "none"
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
                
                {/* Content with enhanced animation on hover */}
                <div className="absolute inset-0 p-8 sm:p-10 md:p-12 z-30 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: hoveredOption === 'b2c' ? -20 : 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div 
                      className="mb-5 overflow-hidden"
                      initial={{ height: 24 }}
                      whileHover={{ height: 30 }}
                    >
                      <motion.span 
                        className="text-[#D3A17E] text-xs uppercase tracking-[0.5em] pl-[0.5em] font-light"
                        animate={{ 
                          textShadow: hoveredOption === 'b2c' ? 
                            ["0 0 0px rgba(211,161,126,0)", "0 0 5px rgba(211,161,126,0.7)", "0 0 0px rgba(211,161,126,0)"] : 
                            "none" 
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                      >
                        {translations.consumer.subtitle[language]}
                      </motion.span>
                    </motion.div>
                    
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-6 tracking-wider">
                      {translations.consumer.title[language]}
                    </h2>
                    
                    <p className="text-white/90 mb-8 font-light leading-relaxed md:text-lg max-w-lg">
                      {translations.consumer.description[language]}
                    </p>
                    
                    {/* Feature list with enhanced markers */}
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
                          <motion.span 
                            className="text-sm tracking-wider group-hover:text-[#D3A17E] transition-colors duration-300"
                            animate={{ 
                              x: hoveredOption === 'b2c' ? 3 : 0,
                              opacity: hoveredOption === 'b2c' ? 1 : 0.8
                            }}
                            transition={{ duration: 0.3, delay: 0.05 * index }}
                          >
                            {feature}
                          </motion.span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.div
                      className="inline-flex items-center"
                      initial={{ x: 0 }}
                      animate={{ 
                        x: hoveredOption === 'b2c' ? 5 : 0,
                        filter: hoveredOption === 'b2c' ? "drop-shadow(0 0 8px rgba(211,161,126,0.5))" : "none"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.span 
                        className="text-[#D3A17E] text-sm tracking-widest uppercase pb-1 border-b border-[#D3A17E]/30"
                        animate={{ 
                          borderBottomWidth: hoveredOption === 'b2c' ? "2px" : "1px",
                          borderBottomColor: hoveredOption === 'b2c' ? "rgba(211,161,126,0.6)" : "rgba(211,161,126,0.3)"
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {translations.consumer.cta[language]}
                      </motion.span>
                      <ChevronRight size={18} className="text-[#D3A17E] ml-1" strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Business option with enhanced styling */}
            <motion.div
              className="relative group cursor-pointer overflow-hidden perspective-1000 rounded-sm"
              custom="right"
              variants={cardVariants}
              whileHover="hover"
              onMouseEnter={() => handleMouseEnter('b2b')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleSelect('b2b')}
              style={{ 
                opacity: loadingStage >= 5 ? 1 : 0,
                boxShadow: hoveredOption === 'b2b' ? "0 25px 50px -12px rgba(211, 161, 126, 0.15)" : "0 15px 30px -15px rgba(0, 0, 0, 0.25)"
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden transform-gpu transition-transform duration-700 ease-out will-change-transform">
                {/* Background with enhanced parallax effect */}
                <motion.div
                  className="absolute inset-0 bg-[url('/images/corporate-elegant.jpg')] bg-cover bg-center z-0 will-change-transform"
                  style={{
                    x: useTransform(mouseX, [-500, 500], [20, -20], { clamp: false }),
                    y: useTransform(mouseY, [-500, 500], [20, -20], { clamp: false }),
                    rotateX: useTransform(mouseY, [-500, 500], [1, -1], { clamp: false }),
                    rotateY: useTransform(mouseX, [-500, 500], [-1, 1], { clamp: false }),
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
                
                {/* Enhanced gold accent elements */}
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ 
                    scaleX: hoveredOption === 'b2b' ? 1 : 0,
                    boxShadow: hoveredOption === 'b2b' ? "0 0 10px rgba(211,161,126,0.4)" : "none"
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleX: 0, originX: 1 }}
                  animate={{ 
                    scaleX: hoveredOption === 'b2b' ? 1 : 0,
                    boxShadow: hoveredOption === 'b2b' ? "0 0 10px rgba(211,161,126,0.4)" : "none"
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {/* Left and right borders */}
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ 
                    scaleY: hoveredOption === 'b2b' ? 1 : 0,
                    boxShadow: hoveredOption === 'b2b' ? "0 0 10px rgba(211,161,126,0.4)" : "none"
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
                
                <motion.div 
                  className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#D3A17E]/80 to-transparent z-20"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ 
                    scaleY: hoveredOption === 'b2b' ? 1 : 0,
                    boxShadow: hoveredOption === 'b2b' ? "0 0 10px rgba(211,161,126,0.4)" : "none"
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
                
                {/* Content with enhanced animations on hover */}
                <div className="absolute inset-0 p-8 sm:p-10 md:p-12 z-30 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: hoveredOption === 'b2b' ? -20 : 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div 
                      className="mb-5 overflow-hidden"
                      initial={{ height: 24 }}
                      whileHover={{ height: 30 }}
                    >
                      <motion.span 
                        className="text-[#D3A17E] text-xs uppercase tracking-[0.5em] pl-[0.5em] font-light"
                        animate={{ 
                          textShadow: hoveredOption === 'b2b' ? 
                            ["0 0 0px rgba(211,161,126,0)", "0 0 5px rgba(211,161,126,0.7)", "0 0 0px rgba(211,161,126,0)"] : 
                            "none" 
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                      >
                        {translations.business.subtitle[language]}
                      </motion.span>
                    </motion.div>
                    
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-6 tracking-wider">
                      {translations.business.title[language]}
                    </h2>
                    
                    <p className="text-white/90 mb-8 font-light leading-relaxed md:text-lg max-w-lg">
                      {translations.business.description[language]}
                    </p>
                    
                    {/* Feature list with enhanced markers */}
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
                          <motion.span 
                            className="text-sm tracking-wider group-hover:text-[#D3A17E] transition-colors duration-300"
                            animate={{ 
                              x: hoveredOption === 'b2b' ? 3 : 0,
                              opacity: hoveredOption === 'b2b' ? 1 : 0.8
                            }}
                            transition={{ duration: 0.3, delay: 0.05 * index }}
                          >
                            {feature}
                          </motion.span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.div
                      className="inline-flex items-center"
                      initial={{ x: 0 }}
                      animate={{ 
                        x: hoveredOption === 'b2b' ? 5 : 0,
                        filter: hoveredOption === 'b2b' ? "drop-shadow(0 0 8px rgba(211,161,126,0.5))" : "none"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.span 
                        className="text-[#D3A17E] text-sm tracking-widest uppercase pb-1 border-b border-[#D3A17E]/30"
                        animate={{ 
                          borderBottomWidth: hoveredOption === 'b2b' ? "2px" : "1px",
                          borderBottomColor: hoveredOption === 'b2b' ? "rgba(211,161,126,0.6)" : "rgba(211,161,126,0.3)"
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {translations.business.cta[language]}
                      </motion.span>
                      <ChevronRight size={18} className="text-[#D3A17E] ml-1" strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Language selector with enhanced styling */}
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
          onMouseEnter={playHoverSound}
        >
          <span className="relative z-10 text-xs uppercase tracking-[0.3em] pl-[0.3em]">
            Português
          </span>
          {language === 'pt' && (
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-[#D3A17E]/30" 
              layoutId="langUnderline"
              initial={{ width: 0 }}
              animate={{ 
                width: '60%',
                boxShadow: ["0 0 0px rgba(211,161,126,0)", "0 0 5px rgba(211,161,126,0.5)", "0 0 0px rgba(211,161,126,0)"]
              }}
              transition={{ 
                width: { duration: 0.3 },
                boxShadow: { duration: 2, repeat: Infinity }
              }}
            />
          )}
        </Link>
        
        <span className="text-white/20 text-xs">|</span>
        
        <Link 
          to="?lang=es" 
          className={`relative px-4 py-2 overflow-hidden ${language === 'es' ? 'text-[#D3A17E]' : 'text-white/40 hover:text-white/80'} transition-colors duration-500`}
          onMouseEnter={playHoverSound}
        >
          <span className="relative z-10 text-xs uppercase tracking-[0.3em] pl-[0.3em]">
            Español
          </span>
          {language === 'es' && (
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-[#D3A17E]/30" 
              layoutId="langUnderline"
              initial={{ width: 0 }}
              animate={{ 
                width: '60%',
                boxShadow: ["0 0 0px rgba(211,161,126,0)", "0 0 5px rgba(211,161,126,0.5)", "0 0 0px rgba(211,161,126,0)"]
              }}
              transition={{ 
                width: { duration: 0.3 },
                boxShadow: { duration: 2, repeat: Infinity }
              }}
            />
          )}
        </Link>
      </motion.div>

      {/* Audio toggle button */}
      <motion.button
        className="absolute top-8 left-12 z-30 flex items-center space-x-2 text-white/60 hover:text-[#D3A17E] transition-colors duration-300 text-xs tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: loadingStage >= 6 ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 3 }}
        onClick={toggleAudio}
        onMouseEnter={() => {
          setCursorVariant('button');
          playHoverSound();
        }}
        onMouseLeave={() => setCursorVariant('default')}
      >
        {audioEnabled ? (
          <>
            <Volume2 size={14} />
            <span className="uppercase tracking-[0.2em]">{translations.audio[language]}</span>
          </>
        ) : (
          <>
            <VolumeX size={14} />
            <span className="uppercase tracking-[0.2em]">{translations.audio[language]}</span>
          </>
        )}
      </motion.button>

      {/* Enhanced signature with elegant animation */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-30"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: loadingStage >= 5 ? [0.7, 0.8, 0.7] : 0 
        }}
        transition={{ 
          opacity: { 
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror"
          }
        }}
      >
        <div className="flex flex-col items-center">
          <motion.div 
            className="h-[1px] w-20 bg-[#D3A17E]/30 mb-4"
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: loadingStage >= 5 ? 1 : 0,
              boxShadow: loadingStage >= 5 ? ["0 0 0px rgba(211,161,126,0)", "0 0 5px rgba(211,161,126,0.3)", "0 0 0px rgba(211,161,126,0)"] : "none"
            }}
            transition={{ 
              scaleX: { duration: 1.5, delay: 2.5 },
              boxShadow: { duration: 3, repeat: Infinity, repeatType: "mirror" }
            }}
          />
          
          <motion.div
            className="text-white/40 font-serif text-sm tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: loadingStage >= 5 ? 0.7 : 0, y: loadingStage >= 5 ? 0 : 10 }}
            transition={{ duration: 1, delay: 2.7 }}
          >
            AFETTO © {new Date().getFullYear()}
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle radial mouse follower */}
      <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-10 opacity-20"
        style={{
          x: magneticCursorX,
          y: magneticCursorY,
          backgroundImage: "radial-gradient(circle, rgba(211,161,126,0.1) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          left: cursorX,
          top: cursorY
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loadingStage >= 6 ? 0.2 : 0 }}
        transition={{ duration: 1 }}
      />
      
      {/* Premium hover effect particles */}
      <AnimatePresence>
        {hoveredOption && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-[url('/images/dust-particles.png')] bg-repeat opacity-10"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"]
                }}
                transition={{ duration: 120, ease: "linear", repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntryPortal;