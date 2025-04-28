import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import useMagnetic from '../../hooks/useMagnetic';

interface CallToActionProps {
  language: 'pt' | 'es';
}

const CallToAction: React.FC<CallToActionProps> = ({ language }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  
  // Use custom magnetic effect for the button
  const { magneticProps } = useMagnetic(buttonRef, { strength: 25 });
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollPosition = window.scrollY;
      const element = containerRef.current;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      if (scrollPosition + viewportHeight > elementTop &&
          scrollPosition < elementTop + elementHeight) {
        const distance = scrollPosition + viewportHeight - elementTop;
        const percentage = Math.min(distance / (viewportHeight + elementHeight), 1);
        
        // Apply parallax effect to background image
        const bgElement = element.querySelector('.bg-image') as HTMLElement;
        if (bgElement) {
          bgElement.style.transform = `translateY(${percentage * 30}px)`;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background image with parallax effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-image absolute inset-0 transition-transform duration-300 ease-out">
          <img 
            src="https://images.pexels.com/photos/4207079/pexels-photo-4207079.jpeg" 
            alt="Wood texture background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white/40"></div>
      </div>
      
      {/* Content */}
      <div ref={ref} className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-gray-900">
            {language === 'pt' 
              ? 'Transforme Seu Espaço Com Elegância Personalizada'
              : 'Transforme Su Espacio Con Elegancia Personalizada'
            }
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            {language === 'pt'
              ? 'Vamos colaborar para criar móveis que incorporem perfeitamente sua visão e estilo de vida'
              : 'Colaboremos para crear muebles que incorporen perfectamente su visión y estilo de vida'
            }
          </p>
          
          {/* Magnetic button */}
          <motion.button 
            ref={buttonRef}
            {...magneticProps}
            onClick={() => navigate('/contact')}
            className="relative px-10 py-4 bg-bronze text-white overflow-hidden font-medium rounded-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">
              {language === 'pt' ? 'Agendar Consulta' : 'Programar Consulta'}
            </span>
            
            {/* Hover effect */}
            <motion.span 
              className="absolute inset-0 bg-white/20"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CallToAction;