'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: {
    pt: string;
    es: string;
  };
  name: string;
  location: {
    pt: string;
    es: string;
  };
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: {
      pt: "A Mobilia transformou completamente nossa casa com móveis sob medida que parecem obras de arte. Cada detalhe foi considerado, cada acabamento é impecável. É incrível como os espaços agora refletem perfeitamente nossa personalidade.",
      es: "Mobilia transformó completamente nuestra casa con muebles a medida que parecen obras de arte. Cada detalle fue considerado, cada acabado es impecable. Es increíble cómo los espacios ahora reflejan perfectamente nuestra personalidad."
    },
    name: "Sofia Mendes",
    location: {
      pt: "São Paulo, Brasil",
      es: "São Paulo, Brasil"
    },
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    id: 2,
    quote: {
      pt: "Escolher a Mobilia foi a melhor decisão que tomamos para nossa reforma. Desde o primeiro contato até a instalação final, o profissionalismo e atenção aos detalhes superaram todas as expectativas. Nossa sala agora é o destaque da casa.",
      es: "Elegir Mobilia fue la mejor decisión que tomamos para nuestra renovación. Desde el primer contacto hasta la instalación final, el profesionalismo y atención al detalle superaron todas las expectativas. Nuestra sala ahora es el punto destacado de la casa."
    },
    name: "Carlos Rodriguez",
    location: {
      pt: "Buenos Aires, Argentina",
      es: "Buenos Aires, Argentina"
    },
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: 3,
    quote: {
      pt: "Mobilia elevou o conceito de design de interiores a um novo patamar. Seu conhecimento de materiais sustentáveis e design atemporal nos ajudou a criar um espaço que não apenas é bonito, mas também consciente e funcional para nossa família.",
      es: "Mobilia elevó el concepto de diseño de interiores a un nuevo nivel. Su conocimiento de materiales sostenibles y diseño atemporal nos ayudó a crear un espacio que no solo es hermoso, sino también consciente y funcional para nuestra familia."
    },
    name: "Gabriela Torres",
    location: {
      pt: "Santiago, Chile",
      es: "Santiago, Chile"
    },
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5
  }
];

export const TestimonialSection = ({ language }: { language: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { duration: 0.6, ease: [0.6, 0.05, -0.01, 0.9] },
        opacity: { duration: 0.5, ease: "easeInOut" },
        scale: { duration: 0.4, ease: "easeInOut" }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { duration: 0.5, ease: [0.6, 0.05, -0.01, 0.9] },
        opacity: { duration: 0.4 }
      }
    })
  };
  
  return (
    <section ref={ref} className="py-32 md:py-40 bg-white overflow-hidden relative">
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-porcelain -skew-x-12 -translate-x-1/3 z-0"></div>
      <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-gradient-to-br from-bronze/5 to-bronze/10 blur-3xl opacity-80"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-tr from-bronze/5 to-bronze/10 blur-3xl opacity-70"></div>
      
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[600px] pointer-events-none"
        style={{ opacity: inView ? 1 : 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.5, ease: [0.6, 0.05, -0.01, 0.9] }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="absolute top-24 left-52 w-16 h-16 border border-bronze/20 rounded-md transform rotate-12"></div>
          <div className="absolute bottom-32 left-20 w-20 h-20 border border-bronze/10 rounded-full"></div>
          <div className="absolute top-1/3 right-32 w-24 h-24 border border-bronze/10 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-36 right-48 w-12 h-12 border border-bronze/15 rounded-md transform -rotate-12"></div>
        </div>
      </motion.div>
      
      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.7, ease: [0.6, 0.05, -0.01, 0.9] }}
          className="text-center mb-20"
        >
          <span className="text-bronze uppercase tracking-widest text-sm font-medium mb-3 block">
            {language === 'pt' ? 'O Que Dizem Nossos Clientes' : 'Lo Que Dicen Nuestros Clientes'}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-5">
            {language === 'pt' ? 'Histórias de Transformação' : 'Historias de Transformación'}
          </h2>
          <div className="relative w-24 h-0.5 bg-bronze mx-auto mb-8">
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 rounded-full bg-bronze"
              animate={{ 
                left: ['0%', '100%', '0%']
              }}
              transition={{
                duration: 12,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>
        </motion.div>
        
        {/* Premium Testimonial Carousel */}
        <div ref={carouselRef} className="relative px-4 md:px-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div 
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white rounded-md shadow-2xl p-10 md:p-14 max-w-4xl mx-auto relative"
            >
              {/* Large quote mark */}
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                className="absolute top-12 left-12 w-20 h-20 text-bronze/10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
              </svg>
              
              <div className="relative z-10">
                <p className="text-xl md:text-2xl text-carbon/90 font-serif italic leading-relaxed mb-10">
                  {testimonials[currentIndex].quote[language as 'pt' | 'es']}
                </p>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-6 md:mb-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-5 ring-2 ring-bronze/20">
                      <img 
                        src={testimonials[currentIndex].avatar} 
                        alt={testimonials[currentIndex].name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-carbon text-lg">{testimonials[currentIndex].name}</h4>
                      <p className="text-neutral-500">
                        {testimonials[currentIndex].location[language as 'pt' | 'es']}
                      </p>
                    </div>
                  </div>
                  
                  {/* Star rating */}
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-bronze' : 'text-neutral-300'} fill-current`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Enhanced decorative elements */}
              <motion.div 
                className="absolute w-28 h-28 -bottom-5 -right-5 border border-bronze/20 rounded-md"
                animate={{ 
                  rotate: [0, -1, 0, 1, 0],
                  scale: [1, 1.01, 1, 0.99, 1]
                }}
                transition={{ 
                  duration: 8, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              <motion.div 
                className="absolute w-full h-full border border-bronze/20 rounded-md"
                animate={{ 
                  rotate: [0, 0.5, 0, -0.5, 0],
                  scale: [1, 1.01, 1, 0.99, 1] 
                }}
                transition={{ 
                  duration: 6, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Pagination dots */}
          <div className="flex justify-center items-center mt-10 gap-3">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className="group focus:outline-none"
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <motion.div 
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    index === currentIndex ? 'bg-bronze' : 'bg-neutral-300 group-hover:bg-neutral-400'
                  }`}
                  animate={index === currentIndex ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1, repeat: index === currentIndex ? Infinity : 0 }}
                />
              </button>
            ))}
          </div>
          
          {/* Carousel navigation arrows */}
          <div className="hidden md:block">
            <motion.button 
              className="absolute top-1/2 -translate-y-1/2 -left-4 w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-carbon hover:text-bronze transition-colors"
              whileHover={{ x: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            
            <motion.button 
              className="absolute top-1/2 -translate-y-1/2 -right-4 w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-carbon hover:text-bronze transition-colors"
              whileHover={{ x: 3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
        
        {/* Enhanced client logos section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 40 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.6, 0.05, -0.01, 0.9] }}
          className="mt-32"
        >
          <div className="text-center mb-12">
            <p className="text-neutral-500 mb-8 text-sm uppercase tracking-wider font-light">
              {language === 'pt' ? 'Reconhecidos por' : 'Reconocidos por'}
            </p>
            <div className="h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {/* TODO: Replace with actual brand logos */}
            <motion.img 
              src="https://via.placeholder.com/120x40/f8f8f8/999999?text=Logo+1" 
              alt="Brand logo" 
              className="h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img 
              src="https://via.placeholder.com/120x40/f8f8f8/999999?text=Logo+2" 
              alt="Brand logo" 
              className="h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img 
              src="https://via.placeholder.com/120x40/f8f8f8/999999?text=Logo+3" 
              alt="Brand logo" 
              className="h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img 
              src="https://via.placeholder.com/120x40/f8f8f8/999999?text=Logo+4" 
              alt="Brand logo" 
              className="h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};