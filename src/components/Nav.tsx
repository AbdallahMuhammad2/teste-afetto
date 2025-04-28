'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useScrollHide } from '../hooks/useScrollHide';
import { EASING_STANDARD } from '../lib/motion-easing';

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isVisible } = useScrollHide();
  const { scrollY } = useScroll();
  const menuRef = useRef<HTMLDivElement>(null);

  // Dynamic navbar background opacity based on scroll position
  const navbarBgOpacity = useTransform(
    scrollY, 
    [0, 100], 
    ["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.12)"]
  );
  
  const navbarBorderOpacity = useTransform(
    scrollY,
    [0, 100],
    [0, 0.08]
  );

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Menu closing on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Decorative menu indicator line variants
  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: (i: number) => ({
      scaleX: 1,
      opacity: 1,
      transition: { 
        delay: i * 0.15 + 0.3,
        duration: 0.5,
        ease: EASING_STANDARD 
      }
    })
  };

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 backdrop-blur-lg transition-all"
        style={{ 
          backgroundColor: navbarBgOpacity,
          borderBottom: useTransform(navbarBorderOpacity, opacity => 
            `1px solid rgba(255, 255, 255, ${opacity})`)
        }}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.5, ease: EASING_STANDARD }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASING_STANDARD }}
          >
            <a href="/" className="group">
              <span className="inline-block text-3xl font-serif font-light tracking-wider relative after:absolute after:w-full after:h-0.5 after:bg-amber-700 after:bottom-0 after:left-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-500 group-hover:after:scale-x-100 group-hover:after:origin-left">
                Afetto
              </span>
            </a>
          </motion.div>
          
          {/* Hamburger button with enhanced animation */}
          <div className="relative">
            <button 
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="relative z-50 w-12 h-12 flex items-center justify-center overflow-hidden rounded-full hover:bg-white/5 transition-colors group"
              onClick={toggleMenu}
            >
              <div className="relative w-8 h-8 flex flex-col items-center justify-center">
                <motion.div
                  className="w-6 h-[2px] bg-current absolute origin-center rounded-full"
                  animate={{ 
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 0 : -4,
                    width: isMenuOpen ? 28 : 24,
                    backgroundColor: isMenuOpen ? "rgb(255, 255, 255)" : "currentColor"
                  }}
                  transition={{ duration: 0.4, ease: EASING_STANDARD }}
                />
                <motion.div
                  className="w-6 h-[2px] bg-current absolute origin-center rounded-full"
                  animate={{ 
                    opacity: isMenuOpen ? 0 : 1,
                    x: isMenuOpen ? 20 : 0
                  }}
                  transition={{ duration: 0.3, ease: EASING_STANDARD }}
                />
                <motion.div
                  className="w-6 h-[2px] bg-current absolute origin-center rounded-full"
                  animate={{ 
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? 0 : 4,
                    width: isMenuOpen ? 28 : 24,
                    backgroundColor: isMenuOpen ? "rgb(255, 255, 255)" : "currentColor"
                  }}
                  transition={{ duration: 0.4, ease: EASING_STANDARD }}
                />
              </div>
              
              {/* Circular reveal effect on hover */}
              <motion.div 
                className="absolute inset-0 bg-amber-700/10 rounded-full"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            ref={menuRef}
            className="fixed inset-0 z-40 flex items-stretch"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 }
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Left panel - decorative */}
            <motion.div 
              className="hidden lg:block w-1/3 bg-amber-700/90 backdrop-blur-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="h-full flex flex-col justify-between p-16">
                <div className="mt-20">
                  <motion.h2 
                    className="text-white text-5xl font-serif font-light tracking-wide mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    Crafted with<br />passion
                  </motion.h2>
                  <motion.div 
                    className="w-16 h-[1px] bg-white/60 mb-8"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  />
                  <motion.p
                    className="text-white/80 max-w-xs leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    Inspiramos ambientes únicos com marcenaria de alta qualidade, onde cada detalhe revela a alma da madeira.
                  </motion.p>
                </div>
                
                <motion.div
                  className="text-white/60 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  © {new Date().getFullYear()} Afetto Móveis
                </motion.div>
              </div>
            </motion.div>
            
            {/* Right panel - navigation */}
            <motion.div 
              className="flex-1 bg-black/95 backdrop-blur-xl flex items-center justify-center"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              <nav className="flex flex-col items-center space-y-6 lg:space-y-8 p-8">
                {['Portfolio', 'Sobre', 'Processo', 'Contato'].map((item, i) => (
                  <div key={item} className="overflow-hidden">
                    <motion.div
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -80, opacity: 0 }}
                      transition={{ 
                        delay: i * 0.1 + 0.2,
                        duration: 0.7, 
                        ease: [0.33, 1, 0.68, 1]
                      }}
                      className="relative group"
                    >
                      <a 
                        href={`/${item.toLowerCase()}`}
                        className="text-white/90 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide hover:text-white transition-colors duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item}
                      </a>
                      
                      {/* Animated underline */}
                      <motion.div 
                        className="absolute left-0 bottom-2 h-[1px] bg-amber-700 origin-left"
                        variants={lineVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                      />
                      
                      {/* Hover indicator */}
                      <div className="absolute left-0 bottom-2 h-[1px] w-full bg-white/40 scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500" />
                    </motion.div>
                  </div>
                ))}
                
                {/* Social links */}
                <motion.div 
                  className="flex gap-6 mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  {['Instagram', 'Pinterest', 'LinkedIn'].map(social => (
                    <a 
                      key={social}
                      href="#" 
                      className="text-white/50 hover:text-amber-700 text-sm uppercase tracking-wider transition-colors duration-300"
                    >
                      {social}
                    </a>
                  ))}
                </motion.div>
              </nav>
            </motion.div>
            
            {/* Decorative floating elements */}
            <motion.div 
              className="absolute bottom-12 left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-amber-700/20 to-amber-500/5 blur-2xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div 
              className="absolute top-32 right-48 w-32 h-32 rounded-full bg-gradient-to-bl from-white/10 to-white/2 blur-xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}