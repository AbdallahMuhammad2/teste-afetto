'use client';

import { useState, useEffect } from 'react';

interface UseScrollHideOptions {
  threshold?: number;
  initialVisible?: boolean;
}

export const useScrollHide = (options: UseScrollHideOptions = {}) => {
  const { threshold = 50, initialVisible = true } = options;
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 0) {
        // At the top of the page
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        // Scrolling down beyond threshold
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add event listener with passive option for better performance
    window.addEventListener('scroll', controlNavbar, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY, threshold]);

  return { isVisible, lastScrollY };
};