import React, { useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import { useLenis } from '@studio-freight/react-lenis';

interface NavigationProps {
  lastScrollY: number;
  scrollDirection: 'up' | 'down';
  handleLinkHover: (enter: boolean) => void;
  handleCtaHover: (enter: boolean) => void;
  onSectionClick: (sectionRef: React.RefObject<HTMLDivElement>) => void;
  refs: {
    gallery: React.RefObject<HTMLDivElement>;
    about: React.RefObject<HTMLDivElement>;
    process: React.RefObject<HTMLDivElement>;
    contact: React.RefObject<HTMLDivElement>;
  }
}

const Navigation: React.FC<NavigationProps> = ({ 
  lastScrollY, 
  scrollDirection, 
  handleLinkHover, 
  handleCtaHover,
  onSectionClick,
  refs
}) => {
  const { language } = useContext(LanguageContext);
  
  // Smooth gradient background based on scroll position
  const backgroundGradient = lastScrollY > 40
    ? "linear-gradient(to bottom, rgba(20, 20, 20, 0.75), rgba(20, 20, 20, 0.65))"
    : "transparent";
  
  // Dynamic blur intensity based on scroll depth
  const blurIntensity = Math.min(10, lastScrollY / 20);
  
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 h-[68px] z-50 flex items-center px-8 transition-all duration-500"
      initial={{ y: -100 }}
      animate={{ 
        y: 0,
        background: backgroundGradient,
        backdropFilter: lastScrollY > 40 ? `blur(${blurIntensity}px)` : "none",
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
        {/* Logo with refined hover effect */}
        <Link to="/" className="text-white flex items-center group">
          <motion.div
            whileHover={{ rotate: [0, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <svg width="120" height="24" viewBox="0 0 120 24" className="text-white group-hover:text-accent/90 transition-colors duration-300">
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
          </motion.div>
          <span className="ml-3 font-serif tracking-wider text-lg">afetto</span>
        </Link>
        
        {/* Navigation links with enhanced hover effects */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-10">
            {[
              { key: 'projects', label: language === 'pt' ? 'Projetos' : 'Proyectos', ref: refs.gallery },
              { key: 'about', label: language === 'pt' ? 'Sobre' : 'Sobre', ref: refs.about },
              { key: 'process', label: language === 'pt' ? 'Processo' : 'Proceso', ref: refs.process },
              { key: 'contact', label: language === 'pt' ? 'Contato' : 'Contacto', ref: refs.contact }
            ].map((item) => (
              <li key={item.key}>
                <button 
                  onClick={() => onSectionClick(item.ref)}
                  className="text-white/80 hover:text-white transition-colors duration-300 py-1 relative group"
                  onMouseEnter={() => handleLinkHover(true)}
                  onMouseLeave={() => handleLinkHover(false)}
                >
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Enhanced underline effect */}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-accent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ 
                      scaleX: 1,
                      height: "2px",
                      borderRadius: "8px" 
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    style={{ transformOrigin: "left" }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Enhanced CTA button with gradient hover effect */}
        <Link 
          to="/agendar"
          className="hidden md:flex items-center text-white border border-white/20 px-5 py-2 transition-all duration-500 group relative overflow-hidden rounded-sm"
          onMouseEnter={() => handleCtaHover(true)}
          onMouseLeave={() => handleCtaHover(false)}
        >
          <span className="relative z-10">
            {language === 'pt' ? 'Agendar Visita' : 'Agendar Visita'}
          </span>
          
          {/* Refined hover background with gradient */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scaleX: 0, originX: 0 }}
            whileHover={{ scaleX: 1, originX: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(to right, rgba(var(--color-accent-rgb), 0.15), rgba(var(--color-accent-rgb), 0.05))"
            }}
          />
          
          {/* Arrow indicator with animation */}
          <motion.div
            className="ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
            animate={{ x: [0, 3, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut",
              repeatDelay: 0.5
            }}
          >
            <ArrowRight size={14} className="text-accent" />
          </motion.div>
        </Link>
        
        {/* Mobile menu button with animation */}
        <motion.button 
          className="md:hidden text-white"
          whileTap={{ scale: 0.95 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Navigation;