import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProcessTimelineProps {
  language: 'pt' | 'es';
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ language }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Process steps data
  const steps = [
    {
      id: 1,
      title: language === 'pt' ? 'Consulta Inicial' : 'Consulta Inicial',
      description: language === 'pt' 
        ? 'Entendemos suas necessidades e desejos para criar um projeto sob medida.'
        : 'Entendemos sus necesidades y deseos para crear un proyecto a medida.',
      imageUrl: '/images/process/consultation.jpg' // Replace with actual image
    },
    {
      id: 2,
      title: language === 'pt' ? 'Design e Projeto' : 'Diseño y Proyecto',
      description: language === 'pt'
        ? 'Criamos desenhos e visualizações 3D para você aprovar antes da produção.'
        : 'Creamos dibujos y visualizaciones 3D para que apruebe antes de la producción.',
      imageUrl: '/images/process/design.jpg' // Replace with actual image
    },
    {
      id: 3,
      title: language === 'pt' ? 'Produção Artesanal' : 'Producción Artesanal',
      description: language === 'pt'
        ? 'Fabricamos seus móveis com materiais de alta qualidade e técnicas artesanais.'
        : 'Fabricamos sus muebles con materiales de alta calidad y técnicas artesanales.',
      imageUrl: '/images/process/crafting.jpg' // Replace with actual image
    },
    {
      id: 4,
      title: language === 'pt' ? 'Entrega e Instalação' : 'Entrega e Instalación',
      description: language === 'pt'
        ? 'Entregamos e instalamos seu projeto com toda a atenção aos detalhes.'
        : 'Entregamos e instalamos su proyecto con toda la atención a los detalles.',
      imageUrl: '/images/process/installation.jpg' // Replace with actual image
    }
  ];
  
  // Handle scroll events to update progress
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const progress = scrollLeft / (scrollWidth - clientWidth);
        setScrollProgress(progress);
        
        // Update current step based on scroll position
        const stepIndex = Math.min(
          Math.floor(progress * steps.length),
          steps.length - 1
        );
        setCurrentStep(stepIndex);
      }
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [steps.length]);
  
  // Navigation functions
  const scrollToStep = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const stepWidth = container.scrollWidth / steps.length;
      container.scrollTo({
        left: index * stepWidth,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollPrev = () => {
    if (currentStep > 0) {
      scrollToStep(currentStep - 1);
    }
  };
  
  const scrollNext = () => {
    if (currentStep < steps.length - 1) {
      scrollToStep(currentStep + 1);
    }
  };
  
  return (
    <section className="relative py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl mb-4 text-gray-900">
            {language === 'pt' ? 'Nosso Processo' : 'Nuestro Proceso'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            {language === 'pt'
              ? 'Do conceito à criação, cada etapa é executada com precisão e cuidado'
              : 'Del concepto a la creación, cada paso se ejecuta con precisión y cuidado'}
          </p>
        </motion.div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-gray-200 sticky top-0 z-10">
        <motion.div 
          className="h-full bg-bronze" 
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
      
      {/* Horizontal scroll container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className="min-w-full sm:min-w-[80%] md:min-w-[60%] lg:min-w-[40%] h-[60vh] snap-center flex-shrink-0 px-6"
          >
            <div className="mx-auto h-full max-w-2xl flex flex-col items-center justify-center">
              <motion.div 
                className="w-full aspect-video overflow-hidden rounded-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.7, 
                  ease: [0.6, 0.05, 0, 0.9], // Fixed easing
                  delay: 0.1 
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <img 
                  src={step.imageUrl || '/images/placeholder.jpg'} 
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.7, 
                  ease: [0.6, 0.05, 0, 0.9], // Fixed easing
                  delay: 0.2
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h3 className="font-serif text-2xl mb-2 text-gray-900">
                  <span className="text-bronze mr-2">{step.id}.</span>
                  {step.title}
                </h3>
                <p className="text-center text-gray-700">{step.description}</p>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={scrollPrev}
          className="p-2 rounded-full bg-white border border-gray-300 text-gray-700 disabled:opacity-50"
          disabled={currentStep === 0}
          aria-label="Previous step"
        >
          <ChevronLeft size={20} />
        </button>
        
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToStep(index)}
            className={`w-3 h-3 rounded-full ${
              currentStep === index ? 'bg-bronze' : 'bg-gray-300'
            }`}
            aria-label={`Go to step ${index + 1}`}
            aria-current={currentStep === index}
          />
        ))}
        
        <button
          onClick={scrollNext}
          className="p-2 rounded-full bg-white border border-gray-300 text-gray-700 disabled:opacity-50"
          disabled={currentStep === steps.length - 1}
          aria-label="Next step"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default ProcessTimeline;