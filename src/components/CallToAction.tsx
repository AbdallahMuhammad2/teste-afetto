'use client';

import { useRef, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useMagnetic } from '../hooks/useMagnetic';
import { EASING_STANDARD } from '../lib/motion-easing';

export default function CallToAction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect for wood texture
  const scrollYProgress = useMotionValue(0);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  // Update scrollYProgress based on viewport position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on element position in viewport
      let progress = 0;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const start = windowHeight;
        const end = 0 - rect.height;
        progress = (rect.top - start) / (end - start);
        progress = Math.min(Math.max(progress, 0), 1);
      }
      
      scrollYProgress.set(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollYProgress]);
  
  // Magnetic button effect
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { magneticProps } = useMagnetic(buttonRef, { strength: 12 });

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden h-screen"
    >
      {/* Wood texture background with parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/wood-texture.webp)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>
      
      {/* Content */}
      <div 
        ref={textRef}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-white"
      >
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASING_STANDARD }}
        >
          Pronto para transformar seu espaço?
        </motion.h2>
        
        <motion.p
          className="text-xl md:text-2xl text-center max-w-2xl mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASING_STANDARD }}
        >
          Cada projeto é único, assim como sua história. Vamos começar a escrever juntos.
        </motion.p>
        
        {/* Magnetic button */}
        <motion.button
          ref={buttonRef}
          className="bg-amber-700 text-white px-10 py-4 text-lg rounded-sm shadow-lg hover:bg-amber-600 transition-colors"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          {...magneticProps}
        >
          Solicitar Orçamento
        </motion.button>
      </div>
    </section>
  );
}