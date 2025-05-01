import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import EntryPortal from './components/EntryPortal';
import B2BHome from './pages/b2b/Home';

interface HomePageProps {
  resetUserType: () => void;
}

interface B2BHomePageProps {
  resetUserType: () => void;
}

const App: React.FC = () => {
  // Track user's choice of B2C vs B2B
  const [userType, setUserType] = useState<'b2c' | 'b2b' | null>(null);
  
  // Check if user has made a choice before
  useEffect(() => {
    const savedUserType = localStorage.getItem('afettoUserType');
    if (savedUserType === 'b2c' || savedUserType === 'b2b') {
      setUserType(savedUserType);
    }
  }, []);
  
  // Handle user's selection
  const handleUserTypeSelect = (type: 'b2c' | 'b2b') => {
    setUserType(type);
    localStorage.setItem('afettoUserType', type);
  };
  
  // Option to reset user's choice
  const resetUserType = () => {
    setUserType(null);
    localStorage.removeItem('afettoUserType');
  };

  return (
    <ReactLenis root options={{ 
      lerp: 0.07, // Lower value for smoother scrolling
      duration: 1.2, 
      smoothWheel: true,
      orientation: "vertical",
      // smoothTouch: false, // This option is not available in LenisOptions
      infinite: false // Ensure this is false
    }}>
      <AnimatePresence mode="wait">
        {userType === null ? (
          <EntryPortal onSelect={handleUserTypeSelect} />
        ) : (
          <Routes>
            {/* Different home pages based on user type */}
            <Route path="/" element={userType === 'b2c' ? <Home resetUserType={resetUserType} /> : <B2BHome resetUserType={resetUserType} />} />
            
            {/* Shared routes */}
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            
            {/* B2B specific routes */}
            {userType === 'b2b' && (
              <>
                <Route path="/especificacoes-tecnicas" element={<TechnicalSpecs />} />
                <Route path="/pedidos-atacado" element={<WholesaleOrders />} />
              </>
            )}
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AnimatePresence>
    </ReactLenis>
  );
};

// Placeholder components for B2B specific pages
const TechnicalSpecs = () => <div>Technical Specifications Page</div>;
const WholesaleOrders = () => <div>Wholesale Orders Page</div>;

export default App;