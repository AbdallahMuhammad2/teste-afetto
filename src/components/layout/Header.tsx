import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LanguageContext from '../../context/LanguageContext';
import { translations } from '../../data/translations';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);
  const location = useLocation();
  
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white bg-opacity-95 shadow-sm py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link to="/" className="text-3xl font-serif tracking-tight">
          Mobilia
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-6">
            <Link 
              to="/" 
              className={`hover:text-accent transition-colors ${location.pathname === '/' ? 'text-accent' : ''}`}
            >
              {t.nav.home}
            </Link>
            <Link 
              to="/portfolio" 
              className={`hover:text-accent transition-colors ${location.pathname === '/portfolio' ? 'text-accent' : ''}`}
            >
              {t.nav.portfolio}
            </Link>
            <Link 
              to="/customization" 
              className={`hover:text-accent transition-colors ${location.pathname === '/customization' ? 'text-accent' : ''}`}
            >
              {t.nav.customization}
            </Link>
            <Link 
              to="/about" 
              className={`hover:text-accent transition-colors ${location.pathname === '/about' ? 'text-accent' : ''}`}
            >
              {t.nav.about}
            </Link>
            <Link 
              to="/contact" 
              className={`hover:text-accent transition-colors ${location.pathname === '/contact' ? 'text-accent' : ''}`}
            >
              {t.nav.contact}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setLanguage('pt')} 
              className={`text-sm ${language === 'pt' ? 'font-medium text-accent' : 'text-neutral-500'}`}
            >
              PT
            </button>
            <span className="text-neutral-400">|</span>
            <button 
              onClick={() => setLanguage('es')} 
              className={`text-sm ${language === 'es' ? 'font-medium text-accent' : 'text-neutral-500'}`}
            >
              ES
            </button>
          </div>
        </div>
        
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transition-transform duration-300 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="h-full flex flex-col p-8">
          <div className="flex justify-between items-center mb-12">
            <Link to="/" className="text-3xl font-serif tracking-tight">
              Mobilia
            </Link>
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-6 text-xl">
            <Link to="/" className={location.pathname === '/' ? 'text-accent' : ''}>
              {t.nav.home}
            </Link>
            <Link to="/portfolio" className={location.pathname === '/portfolio' ? 'text-accent' : ''}>
              {t.nav.portfolio}
            </Link>
            <Link to="/customization" className={location.pathname === '/customization' ? 'text-accent' : ''}>
              {t.nav.customization}
            </Link>
            <Link to="/about" className={location.pathname === '/about' ? 'text-accent' : ''}>
              {t.nav.about}
            </Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'text-accent' : ''}>
              {t.nav.contact}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3 mt-auto">
            <button 
              onClick={() => setLanguage('pt')} 
              className={`text-sm ${language === 'pt' ? 'font-medium text-accent' : 'text-neutral-500'}`}
            >
              PT
            </button>
            <span className="text-neutral-400">|</span>
            <button 
              onClick={() => setLanguage('es')} 
              className={`text-sm ${language === 'es' ? 'font-medium text-accent' : 'text-neutral-500'}`}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;