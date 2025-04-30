import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Customization from './pages/Customization';
import About from './pages/About';
import Contact from './pages/Contact';
import LanguageContext from './context/LanguageContext';
import BackgroundShader from './components/effects/BackgroundShader';
import AdaptiveTheme from './components/effects/AdaptiveTheme';

function App() {
  const location = useLocation();
  const [language, setLanguage] = useState<'pt' | 'es'>('pt');
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen flex flex-col">
        <BackgroundShader />
        <AdaptiveTheme />
        <Header />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/customization" element={<Customization />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;