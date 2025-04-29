import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type HeroSectionProps = {
  language: 'pt-br' | 'en' | 'es';
  videoSrc?: string;
  posterSrc?: string;
  onCursorVariantChange?: (variant: string) => void;
}

// Text content localization
const content = {
  'pt-br': {
    headline: ['Objetos', 'com', 'significado'],
    subtitle: 'Criamos peças que transcendem a função para se tornarem expressões de identidade e estilo.',
    cta: 'Explorar projetos',
    ariaLabel: 'Explore nossos projetos de design',
    scrollText: 'Rolar para explorar'
  },
  'en': {
    headline: ['Objects', 'with', 'meaning'],
    subtitle: 'We create pieces that transcend function to become expressions of identity and style.',
    cta: 'Explore projects',
    ariaLabel: 'Explore our design projects',
    scrollText: 'Scroll to explore'
  },
  'es': {
    headline: ['Objetos', 'con', 'significado'],
    subtitle: 'Creamos piezas que trascienden la función para convertirse en expresiones de identidad y estilo.',
    cta: 'Explorar proyectos',
    ariaLabel: 'Explora nuestros proyectos de diseño',
    scrollText: 'Desplázate para explorar'
  }
};

const HeroSection: React.FC<HeroSectionProps> = ({
  language = 'pt-br',
  videoSrc = "/videos/luxury-interior-4k.mp4",
  posterSrc = "/videos/poster-frame.jpg",
  onCursorVariantChange
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effect for blurred furniture silhouettes
  const parallaxY = useTransform(scrollY, [0, 500], [0, 75]);
  
  // Get localized content
  const headlineText = content[language]?.headline || content['en'].headline;
  const subtitleText = content[language]?.subtitle || content['en'].subtitle;
  
  // Preload video and create poster for Largest Contentful Paint optimization
  useEffect(() => {
    const preloadVideo = async () => {
      if (videoRef.current) {
        try {
          // Set up poster frame from first 3 seconds for LCP
          videoRef.current.currentTime = 0.1;
          videoRef.current.muted = true;
          
          // When metadata is loaded we can access frame data
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              // Capture first frame as poster if none provided
              if (!posterSrc && videoRef.current.readyState >= 2) {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                  const posterImage = canvas.toDataURL('image/jpeg', 0.9);
                  videoRef.current.poster = posterImage;
                }
              }
              videoRef.current.play().catch(() => {
                // Auto-play prevented, manual interaction needed
                console.log('Auto-play prevented, awaiting user interaction');
              });
            }
          };
          
          // Set video as loaded when data actually loads
          videoRef.current.oncanplay = () => {
            setVideoLoaded(true);
          };
        } catch (error) {
          console.error('Error preloading video:', error);
        }
      }
    };
    
    preloadVideo();
    
    return () => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = null;
        videoRef.current.oncanplay = null;
      }
    };
  }, [posterSrc]);
  
  // Cursor handling for interactive elements
  const handleMouseEnter = () => {
    if (onCursorVariantChange) onCursorVariantChange('hero');
  };
  
  const handleMouseLeave = () => {
    if (onCursorVariantChange) onCursorVariantChange('default');
  };

  return (
    <motion.section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.165, 0.84, 0.44, 1] }}
    >
      {/* Ultra-optimized 4K H.265 video with poster preload for LCP */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="object-cover h-full w-full"
            poster={posterSrc}
            preload="metadata"
          >
            {/* H.265/HEVC for modern browsers with fallback */}
            <source src={videoSrc} type="video/mp4; codecs=hvc1" />
            <source src={videoSrc} type="video/mp4" />
          </video>
        </motion.div>
        
        {/* Dual overlay system for perfect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(5,5,5,0.90)] via-[rgba(5,5,5,0.60)] to-[rgba(5,5,5,0.10)] z-[1]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.0)_0%,_rgba(0,0,0,0.85)_100%)] z-[2]"></div>
      </div>

      {/* Parallax furniture silhouettes for depth */}
      <motion.div 
        className="absolute inset-0 z-[1] opacity-20 pointer-events-none"
        style={{ y: parallaxY }}
        data-speed="-0.15"
      >
        <div className="absolute inset-0 filter blur-[40px]">
          <img 
            src="/images/furniture-silhouettes.png" 
            alt="" 
            className="h-full w-full object-cover opacity-30"
            aria-hidden="true" 
          />
        </div>
      </motion.div>

      {/* Content container with sophisticated spacing */}
      <div className="relative z-10 h-full w-full flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-5xl">
            {/* Split-word headline with staggered animation */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[1.1] mb-8">
              {headlineText.map((word, index) => (
                <div key={`headline-${index}`} className="inline-block mr-6 overflow-hidden relative">
                  <motion.span
                    className="inline-block"
                    initial={{ y: 120, clipPath: "inset(0 0 100% 0)" }}
                    whileInView={{ y: 0, clipPath: "inset(0 0 0% 0)" }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ 
                      duration: 1.2, 
                      delay: index * 0.12,
                      ease: [0.25, 1, 0.5, 1] 
                    }}
                  >
                    {word}
                    {/* Underline effect for last word */}
                    {index === headlineText.length - 1 && (
                      <motion.span 
                        className="absolute bottom-2 left-0 h-[3px] bg-[#F5B400] w-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.8, 
                          delay: headlineText.length * 0.12 + 0.3,
                          ease: [0.25, 1, 0.5, 1] 
                        }}
                        style={{ transformOrigin: 'left' }}
                      />
                    )}
                  </motion.span>
                </div>
              ))}
            </h1>

            {/* Character-by-character subtitle animation */}
            <div className="max-w-xl mb-12">
              <p className="text-white/90 text-lg md:text-xl">
                {subtitleText.split('').map((char, index) => (
                  <motion.span
                    key={`char-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: 0.8 + (index * 0.01),
                      ease: [0.215, 0.61, 0.355, 1]
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

            {/* Magnetic CTA with accessibility and subtle hover effects */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Link
                to="/portfolio"
                className="group inline-flex items-center relative overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label={content[language].ariaLabel}
              >
                <span className="relative z-10 text-white text-lg tracking-wide px-10 py-4 border-2 border-[#F5B400]/80 flex items-center">
                  <span className="mr-3">{content[language].cta}</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2, 
                      ease: "easeInOut", 
                      repeatDelay: 1 
                    }}
                  >
                    <ChevronRight size={18} />
                  </motion.div>
                  
                  {/* Button hover backdrop with sophisticated reveal */}
                  <motion.div 
                    className="absolute inset-0 bg-[#F5B400]/20 z-[-1]"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1, originX: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with advanced animation */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <div className="uppercase tracking-[0.25em] text-white/60 text-xs font-extralight">
          {content[language].scrollText}
        </div>
        <motion.div 
          className="w-px h-16 relative overflow-hidden"
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1.8, ease: "easeOut" }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-white/60 via-[#F5B400] to-white/0"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;