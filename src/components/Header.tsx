import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import LanguageContext from '../context/LanguageContext';
import { useContext } from 'react';

const Header = () => {
  const { language } = useContext(LanguageContext);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Monitor scroll position for style changes
  useEffect(() => {
    return scrollY.onChange(latest => {
      setScrolled(latest > 64);
    });
  }, [scrollY]);

  return (
    <motion.header
      className="sticky top-0 z-50 flex items-center h-[90px] px-8 w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.75, 0.36, 1] }}
    >
      <div 
        className={`container mx-auto flex justify-between items-center relative z-10 ${
          scrolled ? "py-4" : "py-6"
        }`}
      >
        {/* Logo com animação hover */}
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
              />
              <motion.path
                d="M30 12H60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <motion.path
                d="M30 18H50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </motion.svg>
            <motion.span
              className="ml-3 font-serif tracking-wider text-lg group-hover:text-accent transition-colors duration-500"
            >
              afetto
            </motion.span>
          </motion.div>
        </Link>

        {/* CTA Button */}
        <Link
          to="/agendar"
          className="hidden md:flex items-center text-white border border-white/20 px-5 py-2.5 transition-all duration-500 group relative overflow-hidden rounded-sm"
        >
          <span className="relative z-10 font-light tracking-wider">
            {language === "pt" ? "Agendar Visita" : "Book a Visit"}
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent/50 to-accent/30 z-0 opacity-0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%", opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.32, 0.75, 0.36, 1] }}
          />
        </Link>
      </div>

      {/* Efeito de vidro com backdrop-filter quando scrollado */}
      <div 
        className={`absolute inset-0 transition-all duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      >
        <div 
          className="absolute inset-0 bg-[#12121480]" 
          style={{ 
            backdropFilter: scrolled ? "saturate(180%) blur(14px)" : "none"
          }} 
        />
      </div>
      
      {/* Outline de 1px com ::after */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          zIndex: 1 
        }}
      >
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{ 
            boxShadow: "inset 0 -1px 0 0 rgba(255,255,255,.06)",
            backdropFilter: "blur(14px)"
          }} 
        />
      </div>
    </motion.header>
  );
};

export default Header;