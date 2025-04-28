'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  
  // Background color transition on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Quote animation on scroll
  useEffect(() => {
    const quote = quoteRef.current;
    if (!quote) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          quote.classList.add('animate-draw-arrow');
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(quote);
    return () => observer.unobserve(quote);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: useTransform(
          scrollYProgress,
          [0, 0.2, 0.8, 1],
          ["#FFFFFF", "#ECEAE7", "#ECEAE7", "#FFFFFF"]
        ) as any
      }}
    >
      <div className="container mx-auto flex flex-col md:flex-row min-h-screen">
        {/* Fixed image (70%) */}
        <div className="md:w-7/10 relative h-[50vh] md:h-screen md:sticky md:top-0">
          <Image
            src="/story-image.webp"
            alt="Artesão trabalhando em móvel de madeira"
            fill
            className="object-cover grayscale"
            priority
          />
        </div>
        
        {/* Scrollable content (30%) */}
        <div className="md:w-3/10 px-6 py-16 md:py-24 md:pl-0 md:pr-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-8">Nossa História</h2>
            
            <p className="mb-8 text-lg leading-relaxed">
              Desde 2008, transformamos madeira em arte funcional. Cada peça que criamos carrega não apenas nossa assinatura, mas também a essência de quem a escolheu.
            </p>
            
            <p className="mb-12 text-lg leading-relaxed">
              Nossa jornada começou em uma pequena oficina em São Paulo, onde o fundador João Mendes uniu sua paixão por design e marcenaria tradicional para criar móveis que desafiam o tempo.
            </p>
            
            <div ref={quoteRef} className="relative mb-12 pl-6 border-l-2 border-amber-700">
              <p className="font-serif italic text-xl md:text-2xl mb-4">
                "Madeira não é apenas material, é história viva em nossas mãos."
              </p>
              <cite className="text-amber-800 not-italic">— João Mendes, Fundador</cite>
              
              {/* SVG arrow that draws itself on scroll */}
              <svg 
                className="absolute -right-4 bottom-0 w-24 h-24 text-amber-700 opacity-70 svg-arrow"
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M20 50 C20 20, 50 20, 80 50 C50 80, 20 80, 20 50 Z" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeDasharray="200"
                  strokeDashoffset="200"
                />
              </svg>
            </div>
            
            <p className="text-lg leading-relaxed mb-8">
              Hoje, nosso ateliê reúne artesãos apaixonados que combinam técnicas centenárias com tecnologia de ponta para criar peças que transcendem gerações.
            </p>
            
            <p className="text-lg leading-relaxed">
              Cada móvel que sai de nossas mãos leva consigo uma promessa: a de transformar espaços em histórias e casas em lares.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}