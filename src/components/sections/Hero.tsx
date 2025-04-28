import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import KineticText from '../effects/KineticText';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  title: string;
  subtitle: string;
  cta: string;
  videoSrc: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, cta, videoSrc }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  
  const overlayOpacity = useTransform(scrollY, [0, 300], [0.3, 0.7]);
  const titleY = useTransform(scrollY, [0, 300], [0, 100]);
  
  useEffect(() => {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    const gradientColors = isDaytime 
      ? ['rgba(181, 129, 69, 0.2)', 'rgba(27, 26, 25, 0.5)']
      : ['rgba(27, 26, 25, 0.4)', 'rgba(181, 129, 69, 0.6)'];
    
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        background: `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }, []);
  
  return (
    <div className="relative h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      
      <motion.div
        ref={containerRef}
        className="absolute inset-0 z-10"
        style={{ opacity: overlayOpacity }}
      />
      
      <div className="relative z-20 h-full flex items-center justify-center text-white px-4">
        <motion.div 
          className="text-center max-w-4xl"
          style={{ y: titleY }}
        >
          <KineticText className="text-5xl md:text-6xl lg:text-7xl font-serif mb-8">
            {title}
          </KineticText>
          
          <motion.p
            className="text-xl md:text-2xl mb-12 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link
              to="/portfolio"
              className="group inline-flex items-center px-8 py-4 border-2 border-white hover:bg-white hover:text-carbon transition-all duration-500 ease-luxury"
            >
              <span className="mr-2">{cta}</span>
              <ChevronRight className="transform group-hover:translate-x-1 transition-transform duration-500 ease-luxury" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;