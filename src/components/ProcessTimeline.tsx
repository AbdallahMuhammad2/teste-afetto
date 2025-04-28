'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ProcessStep {
  id: number;
  title: {
    pt: string;
    es: string;
  };
  description: {
    pt: string;
    es: string;
  };
  image: string;
  icon: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: {
      pt: 'Consulta Inicial',
      es: 'Consulta Inicial'
    },
    description: {
      pt: 'Começamos compreendendo sua visão, estilo de vida e necessidades únicas através de uma consulta detalhada em seu espaço ou em nosso showroom.',
      es: 'Comenzamos comprendiendo su visión, estilo de vida y necesidades únicas a través de una consulta detallada en su espacio o en nuestro showroom.'
    },
    image: '/images/process/consultation.webp', // TODO: Add actual image path
    icon: '✦'
  },
  {
    id: 2,
    title: {
      pt: 'Design Conceitual',
      es: 'Diseño Conceptual'
    },
    description: {
      pt: 'Nossos designers transformam suas ideias em um conceito visual detalhado, incluindo esboços, materiais propostos e paletas de cores personalizadas.',
      es: 'Nuestros diseñadores transforman sus ideas en un concepto visual detallado, incluyendo bocetos, materiales propuestos y paletas de colores personalizadas.'
    },
    image: '/images/process/design.webp', // TODO: Add actual image path
    icon: '✧'
  },
  {
    id: 3,
    title: {
      pt: 'Materiais & Protótipos',
      es: 'Materiales & Prototipos'
    },
    description: {
      pt: 'Selecionamos materiais de alta qualidade e criamos protótipos detalhados, garantindo que cada elemento atenda aos nossos rigorosos padrões.',
      es: 'Seleccionamos materiales de alta calidad y creamos prototipos detallados, asegurando que cada elemento cumpla con nuestros rigurosos estándares.'
    },
    image: '/images/process/materials.webp', // TODO: Add actual image path
    icon: '✢'
  },
  {
    id: 4,
    title: {
      pt: 'Produção Artesanal',
      es: 'Producción Artesanal'
    },
    description: {
      pt: 'Nossos artesãos experientes trabalham meticulosamente para criar cada peça, combinando técnicas tradicionais com tecnologia avançada.',
      es: 'Nuestros artesanos experimentados trabajan meticulosamente para crear cada pieza, combinando técnicas tradicionales con tecnología avanzada.'
    },
    image: '/images/process/crafting.webp', // TODO: Add actual image path
    icon: '✤'
  },
  {
    id: 5,
    title: {
      pt: 'Instalação & Finalização',
      es: 'Instalación & Finalización'
    },
    description: {
      pt: 'A instalação é realizada com precisão por nossa equipe especializada, garantindo que seu espaço seja transformado exatamente como imaginado.',
      es: 'La instalación se realiza con precisión por nuestro equipo especializado, asegurando que su espacio sea transformado exactamente como lo imaginó.'
    },
    image: '/images/process/installation.webp', // TODO: Add actual image path
    icon: '✥'
  }
];

interface ProcessTimelineProps {
  language: string;
}

export const ProcessTimeline = ({ language }: ProcessTimelineProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [titleRef, titleInView] = useInView({ threshold: 0.5, triggerOnce: true });
  
  // Track scrolling within the horizontal scroll container
  const { scrollXProgress } = useScroll({ container: containerRef });
  
  // Update active step based on scroll position
  useEffect(() => {
    const unsubscribe = scrollXProgress.onChange(value => {
      // Map scroll progress to step number (1-5)
      const newStep = Math.floor(value * 5) + 1;
      if (newStep !== activeStep && newStep >= 1 && newStep <= 5) {
        setActiveStep(newStep);
      }
    });
    
    return () => unsubscribe();
  }, [scrollXProgress, activeStep]);
  
  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-0">
        <motion.div
          ref={titleRef}
          className="text-center mb-10 md:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : 30 }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }}
        >
          <span className="text-bronze uppercase tracking-widest text-sm font-medium mb-3 block">
            {language === 'pt' ? 'Nosso Processo' : 'Nuestro Proceso'}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-5">
            {language === 'pt' ? 'Da Concepção à Criação' : 'De la Concepción a la Creación'}
          </h2>
          <div className="w-16 h-0.5 bg-bronze mx-auto mb-8"></div>
        </motion.div>
        
        {/* Progress bar */}
        <div className="sticky top-24 z-20 py-4 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-8">
            <div className="relative h-1 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-bronze rounded-full"
                style={{ width: useTransform(scrollXProgress, [0, 1], ['0%', '100%']) }}
              />
            </div>
            
            <div className="flex justify-between mt-4">
              {processSteps.map(step => (
                <div 
                  key={step.id} 
                  className={`text-xs md:text-sm font-medium transition-colors duration-300 ${
                    step.id <= activeStep ? 'text-bronze' : 'text-neutral-400'
                  }`}
                >
                  {step.id}. {language === 'pt' ? step.title.pt : step.title.es}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Horizontal scroll container */}
        <div 
          ref={containerRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          style={{ 
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          {processSteps.map(step => (
            <div 
              key={step.id}
              className="min-w-full h-[60vh] flex flex-col md:flex-row snap-start snap-always py-10 px-4 md:px-8"
            >
              <div className="w-full md:w-1/2 pr-0 md:pr-12 mb-8 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.6, 0.05, -0.01, 0.9] }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="h-full"
                >
                  <div className="rounded-xl overflow-hidden h-full">
                    <div className="relative w-full h-full">
                      <div 
                        className="w-full h-full bg-neutral-100"
                        style={{
                          backgroundImage: `url(${step.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      
                      {/* Elegant overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-carbon/20 to-transparent mix-blend-multiply"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="w-full md:w-1/2 pl-0 md:pl-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: [0.6, 0.05, -0.01, 0.9] }}
                  viewport={{ once: true, margin: '-100px' }}
                >
                  <div className="text-6xl text-bronze/30 mb-4">{step.icon}</div>
                  <h3 className="text-3xl md:text-4xl font-serif mb-6">
                    {language === 'pt' ? step.title.pt : step.title.es}
                  </h3>
                  <div className="w-12 h-0.5 bg-bronze mb-8"></div>
                  <p className="text-carbon/80 text-lg md:text-xl leading-relaxed">
                    {language === 'pt' ? step.description.pt : step.description.es}
                  </p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-10">
          <button 
            onClick={() => {
              if (containerRef.current && activeStep > 1) {
                const newStep = activeStep - 1;
                containerRef.current.scrollTo({
                  left: (newStep - 1) * containerRef.current.clientWidth,
                  behavior: 'smooth'
                });
              }
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              activeStep > 1 ? 'bg-white text-carbon hover:text-bronze border border-neutral-200' : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
            }`}
            disabled={activeStep <= 1}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={() => {
              if (containerRef.current && activeStep < 5) {
                const newStep = activeStep + 1;
                containerRef.current.scrollTo({
                  left: (newStep - 1) * containerRef.current.clientWidth,
                  behavior: 'smooth'
                });
              }
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              activeStep < 5 ? 'bg-white text-carbon hover:text-bronze border border-neutral-200' : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
            }`}
            disabled={activeStep >= 5}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};