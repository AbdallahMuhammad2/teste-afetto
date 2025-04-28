import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const EASING_STANDARD = [0.6, 0.05, -0.01, 0.9];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Parallax effect for title elements
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const btnY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  // Video handling
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => setVideoLoaded(true));
      
      // Try to play the video automatically
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, add a click handler
          const handleFirstInteraction = () => {
            video.play();
            document.removeEventListener('click', handleFirstInteraction);
          };
          document.addEventListener('click', handleFirstInteraction);
        });
      }
    }
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Grain texture overlay for premium feel */}
      <div className="absolute inset-0 z-40 opacity-30 pointer-events-none bg-noise mix-blend-soft-light" />
      
      {/* Animation overlay layer */}
      <motion.div 
        className={`absolute inset-0 z-50 bg-black ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      
      {/* Video Background with poster for fast LCP */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: videoScale }}
      >
        <video 
          ref={videoRef}
          poster="/hero-poster.webp" 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Dynamic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
      
      {/* Main content container with asymmetric layout */}
      <div className="relative z-30 h-full container mx-auto px-6 flex">
        <div className="w-full md:w-9/12 xl:w-7/12 h-full flex flex-col justify-center items-start">
          
          {/* Top decorative line */}
          <motion.div
            className="w-16 h-[1px] bg-amber-500/80 mb-6 md:mb-10 hidden md:block"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 64, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASING_STANDARD }}
          />
          
          {/* Scene number indicator */}
          <motion.div 
            className="absolute top-8 left-8 text-white/40 text-sm z-30 hidden md:flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <span className="tracking-widest">01</span>
            <span className="w-10 h-[1px] bg-white/30"></span>
            <span className="uppercase tracking-wider text-[10px]">Introdução</span>
          </motion.div>
          
          {/* Headline */}
          <div className="relative mb-4 md:mb-8">
            <motion.div
              style={{ y: titleY }}
              className="relative z-20"
            >
              {/* Preheading */}
              <h2 className="font-serif text-lg text-amber-200/90 mb-4 tracking-[0.2em] uppercase">
                <motion.span 
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Marcenaria de luxo
                </motion.span>
              </h2>
              
              {/* Main headline with staggered animation */}
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white/95 leading-[1.1]">
                <div className="overflow-hidden">
                  <motion.span 
                    className="block"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  >
                    Móveis que
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.span 
                    className="block"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  >
                    contam sua
                  </motion.span>
                </div>
                <div className="overflow-hidden relative">
                  <motion.span 
                    className="inline-block"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  >
                    história
                  </motion.span>
                  
                  {/* Animated underline */}
                  <motion.div 
                    className="absolute -bottom-2 left-0 w-full h-[1px] bg-amber-500/60 origin-left" 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
                  />
                </div>
              </h1>
            </motion.div>
          </div>
          
          {/* Subtitle with reveal animation */}
          <motion.div 
            className="mb-8 md:mb-14 max-w-xl"
            style={{ y: subtitleY }}
          >
            <div className="overflow-hidden">
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-white/80 font-light tracking-wide max-w-md"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: EASING_STANDARD }}
              >
                Criados sob medida para cada momento da sua vida, com maestria artesanal e design intemporal.
              </motion.p>
            </div>
          </motion.div>
          
          {/* Buttons with enhanced hover effects */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-5"
            style={{ y: btnY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="perspective-1000">
              <motion.button
                className="relative px-8 py-4 bg-amber-700 text-white overflow-hidden group min-w-[180px]"
                whileHover={{ 
                  rotateX: 5, 
                  rotateY: 10,
                  boxShadow: "0 30px 30px -10px rgba(0, 0, 0, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <span className="relative z-10 font-medium tracking-wider">Ver Portfólio</span>
              </motion.button>
            </div>
            
            <a
              href="#about"
              className="text-white/70 px-8 py-4 flex items-center gap-2 hover:text-white transition-colors duration-300 group"
            >
              <span>Saiba mais</span>
              <span className="block w-5 h-[1px] bg-white/70 group-hover:w-7 transition-all duration-300"></span>
            </a>
          </motion.div>
        </div>
        
        {/* Right side decorative elements (hidden on mobile) */}
        <div className="hidden xl:block w-5/12 relative">
          <div className="absolute bottom-[20%] right-0 w-2/3">
            <motion.div
              className="relative h-[300px] w-full overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 1.2 }}
            >
              {/* Usando img em vez de Image */}
              <img 
                src="/decorative-furniture.webp" 
                alt="Peça decorativa de design" 
                className="absolute inset-0 w-full h-full object-cover filter contrast-125 grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-12 w-full z-30 flex justify-center items-center">
        <motion.div 
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <span className="text-white/50 text-sm tracking-[0.25em] uppercase">Explore</span>
          <motion.div 
            className="w-[1px] h-14 bg-gradient-to-b from-transparent via-white/50 to-white/80"
            animate={{ 
              scaleY: [0.3, 1, 0.3],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
      
      {/* Floating signature mark */}
      <motion.div
        className="hidden md:block absolute bottom-12 right-12 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className="font-serif text-amber-500/80 text-lg relative">
          <span>Afetto</span>
          <motion.div 
            className="absolute -bottom-2 left-0 w-full h-[1px] bg-amber-500/60" 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 2 }}
          />
        </div>
      </motion.div>
    </section>
  );
}