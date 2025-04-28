import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface StorySectionProps {
  language: 'pt' | 'es';
}

const StorySection: React.FC<StorySectionProps> = ({ language }) => {
  const [containerRef, containerInView] = useInView({ triggerOnce: true });
  const [imageRef, imageInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  
  // Reference for scroll-based effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Background color transition on scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#FFFFFF", "#F4F2F0", "#ECEAE7"]
  );
  
  return (
    <motion.section 
      ref={containerRef}
      className="relative min-h-screen py-24"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 md:px-12">
        {/* Fixed Image Column */}
        <motion.div 
          ref={imageRef}
          className="lg:col-span-7 lg:sticky lg:top-32 h-[60vh] lg:h-[75vh]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: imageInView ? 1 : 0, x: imageInView ? 0 : -50 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.6, 0.05, 0, 0.9] // Fixed easing
          }}
        >
          <div className="w-full h-full relative overflow-hidden rounded-lg">
            <img 
              src="https://images.pexels.com/photos/5089159/pexels-photo-5089159.jpeg"
              alt="Artisan crafting furniture"
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-multiply"></div>
          </div>
        </motion.div>
        
        {/* Scrollable Text Column */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl mb-6 text-gray-900">
              {language === 'pt' ? 'Nossa Tradição de Excelência' : 'Nuestra Tradición de Excelencia'}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {language === 'pt' 
                ? 'Por três gerações, nossa família tem se dedicado à arte da marcenaria. O que começou como um pequeno ateliê em 1957 evoluiu para uma renomada casa de design, mantendo o mesmo compromisso com o artesanato que definiu nossos primórdios.'
                : 'Durante tres generaciones, nuestra familia se ha dedicado al arte de la ebanistería. Lo que comenzó como un pequeño taller en 1957 ha evolucionado hasta convertirse en una reconocida casa de diseño, manteniendo el mismo compromiso con la artesanía que definió nuestros inicios.'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {language === 'pt'
                ? 'Cada peça que sai de nossa oficina carrega consigo horas de atenção meticulosa aos detalhes, utilizando técnicas transmitidas por gerações e aprimoradas por sensibilidades de design contemporâneo.'
                : 'Cada pieza que sale de nuestro taller lleva consigo horas de meticulosa atención al detalle, utilizando técnicas transmitidas a través de generaciones y mejoradas por sensibilidades de diseño contemporáneo.'}
            </p>
          </motion.div>
          
          <motion.blockquote
            className="pl-6 border-l-2 border-bronze my-12"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-xl font-serif italic text-gray-800">
              {language === 'pt'
                ? '"Criamos móveis não apenas para os espaços de hoje, mas para as memórias de amanhã."'
                : '"Creamos muebles no solo para los espacios de hoy, sino para los recuerdos del mañana."'}
            </p>
            <footer className="mt-2 text-gray-600">
              — Carlos Mendes, {language === 'pt' ? 'Fundador' : 'Fundador'}
            </footer>
          </motion.blockquote>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {language === 'pt'
                ? 'Selecionamos apenas os melhores materiais - madeiras de origem sustentável, couros de origem ética e ferragens personalizadas - garantindo que seus móveis não apenas transformem seu espaço hoje, mas se tornem um legado para gerações futuras.'
                : 'Seleccionamos solo los mejores materiales: maderas de origen sostenible, cueros de origen ético y herrajes personalizados, garantizando que sus muebles no solo transformen su espacio hoy, sino que se conviertan en un legado para las generaciones futuras.'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === 'pt'
                ? 'Nosso processo permanece profundamente pessoal. Da consulta inicial à instalação final, trabalhamos em estreita colaboração com nossos clientes para criar peças que reflitam sua visão única, beneficiando-se de nossas décadas de experiência.'
                : 'Nuestro proceso sigue siendo profundamente personal. Desde la consulta inicial hasta la instalación final, trabajamos estrechamente con nuestros clientes para crear piezas que reflejen su visión única, beneficiándose de nuestras décadas de experiencia.'}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default StorySection;