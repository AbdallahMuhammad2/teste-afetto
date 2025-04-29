import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

type NavigationBarProps = {
  language: 'pt-br' | 'en' | 'es';
  onLanguageChange: (lang: 'pt-br' | 'en' | 'es') => void;
}

const languages = {
  'pt-br': 'Português',
  'en': 'English',
  'es': 'Español'
};

const navItems = {
  'pt-br': [
    { label: 'Início', href: '/' },
    { label: 'Projetos', href: '/projetos' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Processo', href: '/processo' },
    { label: 'Contato', href: '/contato' }
  ],
  'en': [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Process', href: '/process' },
    { label: 'Contact', href: '/contact' }
  ],
  'es': [
    { label: 'Inicio', href: '/' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Proceso', href: '/proceso' },
    { label: 'Contacto', href: '/contacto' }
  ]
};

const NavigationBar: React.FC<NavigationBarProps> = ({
  language,
  onLanguageChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Track scroll position to trigger color change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 64) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.nav
        className={`w-full transition-all duration-500 ${
          scrolled 
            ? 'bg-[#F5B400]/90 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between py-5">
            {/* Logo */}
            <Link to="/" className="text-2xl font-serif relative z-10">
              <span className={scrolled ? 'text-white' : 'text-white'}>Afetto</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems[language].map((item, index) => (
                <Link 
                  key={`nav-${index}`} 
                  to={item.href}
                  className={`relative group ${
                    scrolled 
                      ? 'text-white/90 hover:text-white' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                  <motion.span 
                    className="absolute -bottom-1 left-0 h-[2px] bg-white"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    style={{ transformOrigin: 'left' }}
                  />
                </Link>
              ))}
              
              {/* Language Selector with Radix UI for accessibility */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button 
                    className={`flex items-center space-x-1 ${
                      scrolled 
                        ? 'text-white/90 hover:text-white' 
                        : 'text-white/80 hover:text-white'
                    }`}
                    aria-label="Select language"
                  >
                    <Globe size={18} />
                    <span className="sr-only sm:not-sr-only sm:ml-1">
                      {languages[language]}
                    </span>
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenu.Trigger>
                
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={5}
                    className="bg-white rounded-sm shadow-md p-2 w-48 z-50 animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                  >
                    {Object.entries(languages).map(([code, name]) => (
                      <DropdownMenu.Item
                        key={code}
                        className={`
                          flex items-center px-3 py-2 text-sm transition-colors
                          ${language === code ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700 hover:bg-neutral-100'}
                        `}
                        onClick={() => onLanguageChange(code as 'pt-br' | 'en' | 'es')}
                      >
                        {name}
                        {language === code && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto h-2 w-2 rounded-full bg-[#F5B400]"
                          />
                        )}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
            
            {/* Mobile Menu Button */}
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
              <Dialog.Trigger asChild>
                <button 
                  className={`md:hidden ${
                    scrolled 
                      ? 'text-white' 
                      : 'text-white'
                  }`}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  <Menu size={24} />
                </button>
              </Dialog.Trigger>
              
              {/* Mobile Menu with Radix Dialog for accessibility */}
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in-0" />
                <Dialog.Content 
                  className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-[#F5B400] shadow-lg z-50 p-6 overflow-auto animate-in slide-in-from-right"
                >
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-2xl font-serif text-white">Afetto</span>
                    <Dialog.Close asChild>
                      <button className="text-white/90 hover:text-white">
                        <X size={24} />
                      </button>
                    </Dialog.Close>
                  </div>
                  
                  <div className="flex flex-col space-y-6">
                    {navItems[language].map((item, index) => (
                      <Link 
                        key={`mobile-nav-${index}`} 
                        to={item.href}
                        className="text-white/90 hover:text-white text-xl font-light"
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          {item.label}
                        </motion.div>
                      </Link>
                    ))}
                    
                    {/* Mobile Language Selector */}
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-white/70 text-sm mb-3">
                        {language === 'pt-br' ? 'Idioma' : language === 'en' ? 'Language' : 'Idioma'}
                      </p>
                      <div className="flex flex-col space-y-2">
                        {Object.entries(languages).map(([code, name]) => (
                          <button
                            key={`lang-${code}`}
                            className={`text-left px-2 py-1 rounded-sm ${
                              language === code 
                                ? 'bg-white/20 text-white' 
                                : 'text-white/80 hover:bg-white/10'
                            }`}
                            onClick={() => {
                              onLanguageChange(code as 'pt-br' | 'en' | 'es');
                              setIsOpen(false);
                            }}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
        
        {/* Progress Bar */}
        <motion.div 
          className="h-[2px] bg-white/30"
          style={{ scaleX, transformOrigin: 'left' }}
        />
      </motion.nav>
    </header>
  );
};

export default NavigationBar;