import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent 
} from 'framer-motion';
import { MenuIcon, X, Search, ChevronDown, Globe, Phone } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import Icon from './ui/Icon';

// Configurações de tipografia para animações
const letterAnimation = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    y: -10,
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};

const PremiumHeader: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderSolid, setIsHeaderSolid] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [112, 80]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);
  const backgroundOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  // Menu de navegação principal
  const mainNavigationItems = [
    { 
      name: { pt: 'Início', en: 'Home', es: 'Inicio' },
      path: '/',
    },
    { 
      name: { pt: 'Projetos', en: 'Projects', es: 'Proyectos' },
      path: '/portfolio',
      dropdown: [
        { name: { pt: 'Residencial', en: 'Residential', es: 'Residencial' }, path: '/projetos/residencial' },
        { name: { pt: 'Comercial', en: 'Commercial', es: 'Comercial' }, path: '/projetos/comercial' },
        { name: { pt: 'Institucional', en: 'Institutional', es: 'Institucional' }, path: '/projetos/institucional' },
        { name: { pt: 'Internacional', en: 'International', es: 'Internacional' }, path: '/projetos/internacional' },
      ]
    },
    { 
      name: { pt: 'Materiais', en: 'Materials', es: 'Materiales' },
      path: '/materiais',
      dropdown: [
        { name: { pt: 'Madeiras', en: 'Woods', es: 'Maderas' }, path: '/materiais/madeiras' },
        { name: { pt: 'Tecidos', en: 'Fabrics', es: 'Tejidos' }, path: '/materiais/tecidos' },
        { name: { pt: 'Metais', en: 'Metals', es: 'Metales' }, path: '/materiais/metais' },
        { name: { pt: 'Pedras', en: 'Stones', es: 'Piedras' }, path: '/materiais/pedras' },
      ]
    },
    { 
      name: { pt: 'Processo', en: 'Process', es: 'Proceso' },
      path: '/processo',
    },
    { 
      name: { pt: 'Sobre', en: 'About', es: 'Sobre' },
      path: '/sobre',
    },
    { 
      name: { pt: 'Contato', en: 'Contact', es: 'Contacto' },
      path: '/contato',
    },
  ];

  // Detectar rolagem para mostrar/ocultar o header
  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    
    // Controlar visibilidade do header
    if (currentScrollY > lastScrollY && currentScrollY > 180) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
    
    // Controlar opacidade do fundo
    if (currentScrollY > 60) {
      setIsHeaderSolid(true);
    } else {
      setIsHeaderSolid(false);
    }
    
    setLastScrollY(currentScrollY);
  });

  // Gerenciar cliques fora do dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Efeitos de inicialização
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Fechar menu mobile quando a rota muda
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Manipuladores de eventos
  const toggleMenu = () => {
    if (!isMenuOpen && !isSearchOpen) {
      setIsOverlayVisible(true);
    } else if (!isSearchOpen) {
      setIsOverlayVisible(false);
    }
    
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    if (!isSearchOpen && !isMenuOpen) {
      setIsOverlayVisible(true);
    } else if (!isMenuOpen) {
      setIsOverlayVisible(false);
    }
    
    setIsSearchOpen(!isSearchOpen);
  };

  const handleDropdownToggle = (index: string) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pesquisando por:", searchQuery);
    // Implementar lógica de pesquisa
  };

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    setActiveDropdown(null);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Animações e renderização
  return (
    <React.Fragment>
      <motion.header
        ref={headerRef}
        initial={{ y: -100 }}
        animate={{ 
          y: isHeaderVisible ? 0 : -100,
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30,
          restDelta: 0.01
        }}
        className="fixed top-0 left-0 w-full z-50"
      >
        {/* Elementos decorativos de fundo */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#111111]/95 via-[#191817]/95 to-[#161514]/95 backdrop-blur-lg"
          style={{ opacity: backgroundOpacity }}
        />
        
        <motion.div 
          className="absolute inset-0 border-b border-white/5"
          style={{ opacity: backgroundOpacity }}
        />
        
        {/* Elementos adicionais de marca d'água */}
        <div className={`absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-opacity duration-500 ${isHeaderSolid ? 'opacity-100' : 'opacity-0'}`}></div>
        
        <div className="relative">
          {/* Top Bar */}
          <motion.div 
            className="h-8 border-b border-white/5 bg-black/50 hidden lg:block overflow-hidden"
            style={{
              opacity: useTransform(scrollY, [0, 100], [1, 0]),
              height: useTransform(scrollY, [0, 100], [32, 0])
            }}
          >
            <div className="container mx-auto px-6 flex justify-between items-center h-full text-white/60 text-xs">
              <div className="flex items-center">
                <a href="mailto:contato@afetto.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="tracking-wide">contato@afetto.com</span>
                </a>
                <div className="h-3 w-px bg-white/20 mx-4"></div>
                <a href="tel:+551155555555" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Phone size={12} />
                  <span className="tracking-wide">+55 (11) 5555-5555</span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                {/* Social media */}
                <div className="flex space-x-3">
                  {['instagram', 'facebook', 'pinterest'].map((social) => (
                    <a 
                      key={social} 
                      href={`https://${social}.com`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-accent transition-colors"
                    >
                      <Icon name={social} size={12} />
                    </a>
                  ))}
                </div>
                <div className="h-3 w-px bg-white/20 mx-1"></div>
                {/* Language selector */}
                <div className="relative">
                  <button 
                    className="flex items-center gap-1.5 hover:text-accent transition-colors"
                    onClick={() => handleDropdownToggle('language')}
                  >
                    <Globe size={12} />
                    <span className="uppercase">{language}</span>
                    <ChevronDown size={10} className={`transition-transform duration-300 ${activeDropdown === 'language' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Language dropdown */}
                  <AnimatePresence>
                    {activeDropdown === 'language' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-1 py-2 w-32 bg-neutral-900 border border-white/10 backdrop-blur-lg shadow-xl"
                      >
                        {['pt', 'en', 'es'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => changeLanguage(lang)}
                            className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors ${language === lang ? 'text-accent' : 'text-white/70'}`}
                          >
                            {lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main Header Area */}
          <motion.div 
            className="container mx-auto px-6 flex justify-between items-center relative z-20"
            style={{ height: headerHeight }}
          >
            {/* Logo */}
            <Link to="/" className="relative z-20">
              <motion.div 
                className="flex items-center" 
                style={{ scale: logoScale }}
                whileHover={{ scale: isHeaderSolid ? 0.9 : 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3 group">
                  <motion.div
                    className="relative overflow-hidden"
                    whileHover={{ filter: "drop-shadow(0 0 8px rgba(211, 161, 126, 0.6))" }}
                  >
                    <svg width="40" height="24" viewBox="0 0 120 24" className="transition-colors duration-500 group-hover:text-accent">
                      <path
                        d="M10 4L18 12L10 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white group-hover:text-accent transition-colors duration-500"
                      />
                      <motion.path
                        d="M30 6H50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="text-white group-hover:text-accent transition-colors duration-500"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isReady ? 1 : 0 }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                      />
                      <motion.path
                        d="M30 12H60"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="text-white group-hover:text-accent transition-colors duration-500"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isReady ? 1 : 0 }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                      />
                      <motion.path
                        d="M30 18H50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="text-white group-hover:text-accent transition-colors duration-500"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isReady ? 1 : 0 }}
                        transition={{ duration: 1.5, delay: 0.4 }}
                      />
                    </svg>
                  </motion.div>
                  <motion.span
                    className="font-serif text-xl text-white group-hover:text-accent transition-colors duration-500"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    afetto
                  </motion.span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center space-x-1 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {mainNavigationItems.map((item, index) => (
                <div key={index} className="relative group" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                  <Link
                    to={item.path}
                    className={`px-4 py-3 text-sm tracking-wide transition-colors duration-300 font-light relative ${
                      isActive(item.path) 
                        ? 'text-accent' 
                        : 'text-white/80 hover:text-white'
                    }`}
                    onMouseEnter={() => item.dropdown ? handleDropdownToggle(`nav-${index}`) : null}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>{item.name[language as keyof typeof item.name] || item.name.en}</span>
                      {item.dropdown && (
                        <ChevronDown 
                          size={12} 
                          className={`transition-transform duration-300 ${activeDropdown === `nav-${index}` ? 'rotate-180' : ''}`}
                        />
                      )}
                    </div>
                    
                    {/* Indicador de item ativo */}
                    {isActive(item.path) && (
                      <motion.div 
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                  
                  {/* Efeito de hover */}
                  <AnimatePresence>
                    {hoveredIndex === index && !isActive(item.path) && (
                      <motion.div 
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/30"
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === `nav-${index}` && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 py-3 min-w-[200px] bg-[#151413]/95 border border-white/10 backdrop-blur-lg shadow-2xl z-50"
                          onMouseLeave={() => handleDropdownToggle(`nav-${index}`)}
                        >
                          {item.dropdown.map((dropdownItem, dropdownIndex) => (
                            <Link
                              key={dropdownIndex}
                              to={dropdownItem.path}
                              className="block px-5 py-2.5 text-sm text-white/70 hover:text-accent hover:bg-white/5 transition-colors flex items-center justify-between group"
                            >
                              <span>{dropdownItem.name[language as keyof typeof dropdownItem.name] || dropdownItem.name.en}</span>
                              <motion.div 
                                initial={{ width: 0 }}
                                whileHover={{ width: 5 }}
                                transition={{ duration: 0.2 }}
                                className="h-[3px] bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1">
              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-accent transition-colors relative"
                aria-label="Search"
              >
                <motion.div
                  animate={{ rotate: isSearchOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isSearchOpen ? <X size={16} /> : <Search size={16} />}
                </motion.div>
                {isSearchOpen && (
                  <motion.div 
                    layoutId="buttonEffect"
                    className="absolute inset-0 bg-white/5 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )}
              </button>

              {/* CTA Button - desktop */}
              <div className="hidden lg:block">
                <Link
                  to="/agendar"
                  className="ml-4 flex items-center relative overflow-hidden group"
                >
                  <div className="relative px-5 py-2.5 bg-transparent border border-white/20 text-white font-light z-10 flex items-center space-x-1.5 group-hover:border-accent/50 transition-colors">
                    <span className="tracking-wide text-sm">
                      {language === 'pt' ? 'Agendar visita' : language === 'es' ? 'Programar visita' : 'Schedule visit'}
                    </span>
                    
                    {/* Efeito de hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={toggleMenu}
                  className="ml-1 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-accent transition-colors"
                  aria-label="Menu"
                >
                  <motion.div
                    animate={{ rotate: isMenuOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isMenuOpen ? <X size={18} /> : <MenuIcon size={18} />}
                  </motion.div>
                  {isMenuOpen && (
                    <motion.div 
                      layoutId="buttonEffectMenu"
                      className="absolute inset-0 bg-white/5 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Page Overlay - For mobile menu and search */}
      <AnimatePresence>
        {isOverlayVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={() => {
              setIsMenuOpen(false);
              setIsSearchOpen(false);
              setIsOverlayVisible(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#161514] to-[#111111] z-50 overflow-y-auto lg:hidden"
          >
            <div className="py-24 px-8">
              {/* Mobile navigation items */}
              <div className="space-y-6 mb-12">
                {mainNavigationItems.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.path}
                        className={`text-lg font-serif ${isActive(item.path) ? 'text-accent' : 'text-white/90'}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name[language as keyof typeof item.name] || item.name.en}
                      </Link>
                      {item.dropdown && (
                        <button
                          onClick={() => handleDropdownToggle(`mobile-${index}`)}
                          className="p-2 text-white/70"
                        >
                          <ChevronDown 
                            size={18} 
                            className={`transition-transform duration-300 ${activeDropdown === `mobile-${index}` ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}
                    </div>
                    
                    {item.dropdown && (
                      <AnimatePresence>
                        {activeDropdown === `mobile-${index}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden pl-4 mt-2"
                          >
                            <div className="border-l border-white/10 pl-4 py-2 space-y-4">
                              {item.dropdown.map((dropdownItem, dropdownIndex) => (
                                <Link
                                  key={dropdownIndex}
                                  to={dropdownItem.path}
                                  className="block text-white/70 hover:text-accent transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {dropdownItem.name[language as keyof typeof dropdownItem.name] || dropdownItem.name.en}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                    
                    <div className="h-px bg-white/5 mt-6"></div>
                  </div>
                ))}
              </div>
              
              {/* Mobile contact info */}
              <div className="mt-8">
                <h3 className="text-white/50 uppercase text-xs tracking-wider mb-4">
                  {language === 'pt' ? 'Contato' : language === 'es' ? 'Contacto' : 'Contact'}
                </h3>
                <div className="space-y-3">
                  <a href="tel:+551155555555" className="flex items-center text-white/80 hover:text-accent transition-colors">
                    <Phone size={14} className="mr-2" />
                    +55 (11) 5555-5555
                  </a>
                  <a href="mailto:contato@afetto.com" className="flex items-center text-white/80 hover:text-accent transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    contato@afetto.com
                  </a>
                </div>

                {/* Mobile Social Links */}
                <div className="mt-8">
                  <h3 className="text-white/50 uppercase text-xs tracking-wider mb-4">
                    {language === 'pt' ? 'Redes Sociais' : language === 'es' ? 'Redes Sociales' : 'Social Media'}
                  </h3>
                  <div className="flex space-x-4">
                    {['instagram', 'facebook', 'pinterest', 'linkedin'].map((social) => (
                      <a
                        key={social}
                        href={`https://${social}.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-colors"
                      >
                        <Icon name={social} size={16} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Mobile language selector */}
                <div className="mt-8">
                  <h3 className="text-white/50 uppercase text-xs tracking-wider mb-4">
                    {language === 'pt' ? 'Idioma' : language === 'es' ? 'Idioma' : 'Language'}
                  </h3>
                  <div className="flex space-x-3">
                    {['pt', 'en', 'es'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`px-3 py-1.5 uppercase text-sm border ${
                          language === lang 
                            ? 'border-accent text-accent' 
                            : 'border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* CTA Button - mobile */}
                <div className="mt-10">
                  <Link
                    to="/agendar"
                    className="block text-center py-3 px-6 bg-accent/90 text-black hover:bg-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'pt' ? 'Agendar visita' : language === 'es' ? 'Programar visita' : 'Schedule visit'}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Panel */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 left-0 right-0 mx-auto w-full max-w-3xl px-6 z-50"
          >
            <motion.div 
              className="bg-[#111111]/95 backdrop-blur-lg border border-white/10 p-6 rounded-lg shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center border-b border-white/10 focus-within:border-accent transition-colors pb-2">
                  <Search size={18} className="text-white/50 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'pt' ? 'Pesquisar...' : language === 'es' ? 'Buscar...' : 'Search...'}
                    className="bg-transparent text-white w-full outline-none placeholder:text-white/50 text-lg"
                    autoFocus
                  />
                </div>
                
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: searchQuery.length > 2 ? 'auto' : 0,
                    opacity: searchQuery.length > 2 ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 pb-2">
                    <div className="text-white/50 uppercase text-xs tracking-wider mb-3">
                      {language === 'pt' ? 'Resultados sugeridos' : language === 'es' ? 'Resultados sugeridos' : 'Suggested results'}
                    </div>
                    {/* Aqui você pode renderizar resultados dinâmicos de pesquisa */}
                    <div className="space-y-3 mt-3">
                      {searchQuery.length > 2 && (
                        [
                          { title: 'Projeto Residencial São Paulo', path: '/projetos/sao-paulo' },
                          { title: 'Materiais Naturais', path: '/materiais/naturais' },
                          { title: 'Processo Criativo', path: '/processo' }
                        ].map((result, index) => (
                          <Link
                            key={index}
                            to={result.path}
                            className="flex items-center p-3 hover:bg-white/5 rounded-lg transition-colors group"
                            onClick={() => { setIsSearchOpen(false); setIsOverlayVisible(false); }}
                          >
                            <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center mr-4">
                              {index === 0 && <Icon name="image" size={20} className="text-accent/70" />}
                              {index === 1 && <Icon name="layers" size={20} className="text-accent/70" />}
                              {index === 2 && <Icon name="file-text" size={20} className="text-accent/70" />}
                            </div>
                            <div className="flex-grow">
                              <div className="text-white group-hover:text-accent transition-colors">{result.title}</div>
                              <div className="text-white/50 text-sm">{result.path.split('/')[1]}</div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-sm">
                  <div className="text-white/50">
                    {language === 'pt' ? 'Pressione Enter para pesquisar' : language === 'es' ? 'Presione Enter para buscar' : 'Press Enter to search'}
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent/90 text-black hover:bg-accent transition-colors rounded"
                  >
                    {language === 'pt' ? 'Buscar' : language === 'es' ? 'Buscar' : 'Search'}
                  </button>
                </div>
              </form>
              
              {/* Buscar recentes */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div className="text-white/50 uppercase text-xs tracking-wider">
                    {language === 'pt' ? 'Pesquisas recentes' : language === 'es' ? 'Búsquedas recientes' : 'Recent searches'}
                  </div>
                  <button className="text-accent text-xs hover:underline">
                    {language === 'pt' ? 'Limpar' : language === 'es' ? 'Limpiar' : 'Clear'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Madeira Cumaru', 'Móveis sob medida', 'Projetos comerciais'].map((term, i) => (
                    <button
                      key={i}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors rounded text-sm text-white/70"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer para evitar que o conteúdo fique sob o header */}
      <div className="h-28" />
    </React.Fragment>
  );
};

export default PremiumHeader;