import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import Icon from './ui/Icon';

interface AboutSectionProps {
  aboutRef: React.RefObject<HTMLDivElement>;
  handleLinkHover: (enter: boolean) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ aboutRef, handleLinkHover }) => {
  const { language } = useContext(LanguageContext);
  
  // Parallax effect for background and images
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });
  
  // Transform values for parallax effect [-10%, 10%]
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  
  // Values for content fading in at half-screen
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, 0]);
  
  return (
    <motion.section 
      ref={aboutRef}
      className="py-32 md:py-48 overflow-hidden relative"
    >
      {/* Parallax background */}
      <motion.div 
        className="absolute inset-0 z-0 bg-stone-100"
        style={{ y: backgroundY }}
      />
      
      {/* Background texture */}
      <div 
        className="absolute inset-0 bg-opacity-5 mix-blend-overlay z-1"
        style={{ 
          backgroundImage: 'url(/images/texture.png)',
          backgroundSize: 'cover'
        }}
      />
      
      <div className="container mx-auto px-8 md:px-16 relative z-10">
        <div className="grid grid-cols-12 gap-y-24 md:gap-y-0 md:gap-x-10 items-start">
          {/* Left column: Text content */}
          <motion.div 
            className="col-span-12 md:col-span-6 md:col-start-1 md:sticky md:top-32"
            style={{
              opacity: contentOpacity,
              y: contentY
            }}
          >
            <div className="max-w-xl">
              <div className="text-accent uppercase tracking-[0.25em] text-xs font-medium mb-6">
                {language === 'pt' ? '03 — Nossa História' : '03 — Nuestra Historia'}
              </div>
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-serif leading-[1.1] mb-8 tracking-tight text-neutral-900">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: 80 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {language === 'pt' ? 'Tradição encontra contemporaneidade' : 'Tradición encuentra contemporaneidad'}
                  </motion.div>
                </div>
              </h2>
              <motion.div 
                className="h-px w-24 bg-accent mb-10"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
              
              <div className="overflow-hidden">
                <motion.p 
                  className="text-neutral-700 leading-relaxed mb-12 text-lg"
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {language === 'pt' 
                    ? 'Por mais de duas décadas, aperfeiçoamos a arte de criar mobiliário que harmoniza métodos tradicionais com design contemporâneo, resultando em peças que não apenas ocupam espaços, mas contam histórias e evocam emoções.'
                    : 'Por más de dos décadas, hemos perfeccionado el arte de crear mobiliario que armoniza métodos tradicionales con diseño contemporáneo, resultando en piezas que no solo ocupan espacios, sino que cuentan historias y evocan emociones.'}
                </motion.p>
              </div>
              
              {/* Call to action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8"
              >
                <Link
                  to="/filosofia"
                  className="inline-flex items-center group relative"
                  onMouseEnter={() => handleLinkHover(true)}
                  onMouseLeave={() => handleLinkHover(false)}
                >
                  <span className="text-neutral-800 group-hover:text-accent transition-colors duration-500 mr-3 relative">
                    {language === 'pt' ? 'Conheça nossa filosofia' : 'Conozca nuestra filosofía'}
                    <motion.span
                      className="absolute -bottom-px left-0 w-full h-[1px] bg-accent/40"
                      initial={{ scaleX: 0, transformOrigin: 'right' }}
                      whileHover={{ scaleX: 1, transformOrigin: 'left' }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                  <motion.div
                    className="w-7 h-7 rounded-full border border-accent/30 flex items-center justify-center overflow-hidden"
                    whileHover={{ 
                      scale: 1.1,
                      borderColor: 'rgba(var(--color-accent-rgb), 0.5)'
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      animate={{ x: [-12, 16] }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: 'loop', 
                        duration: 1.5, 
                        ease: [0.22, 1, 0.36, 1],
                        repeatDelay: 0.5
                      }}
                    >
                      <ArrowRight size={12} className="text-accent" />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right column: Prominent image with parallax */}
          <motion.div 
            className="col-span-12 md:col-span-6 md:col-start-7"
            style={{
              opacity: contentOpacity,
              y: contentY
            }}
          >
            {/* Main image with parallax */}
            <motion.div
              className="relative rounded-sm overflow-hidden mb-16"
              style={{ y: useTransform(scrollYProgress, [0, 1], ['-5%', '5%']) }}
            >
              <img 
                src="/images/atelier-craftsmanship.jpg" 
                alt="Craftsmanship"
                className="w-full h-auto object-cover"
              />
              
              {/* Overlay with blur for visual depth */}
              <div className="absolute inset-0 backdrop-blur-[5px] bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
            
            {/* Value propositions */}
            <div className="grid grid-cols-1 gap-10 mb-12">
              {[
                {
                  icon: "quality",
                  title: language === 'pt' ? 'Materiais Exclusivos' : 'Materiales Exclusivos',
                  description: language === 'pt' 
                    ? 'Selecionamos as matérias-primas mais nobres e sustentáveis, priorizando fornecedores locais e processos éticos para garantir peças de qualidade excepcional e durabilidade.' 
                    : 'Seleccionamos las materias primas más nobles y sostenibles, priorizando proveedores locales y procesos éticos para garantizar piezas de calidad excepcional y durabilidad.'
                },
                {
                  icon: "craftsmanship",
                  title: language === 'pt' ? 'Maestria Artesanal' : 'Maestría Artesanal',
                  description: language === 'pt' 
                    ? 'Nossos mestres artesãos combinam técnicas tradicionais transmitidas por gerações com inovações contemporâneas, criando peças de excepcional precisão e beleza atemporal.' 
                    : 'Nuestros maestros artesanos combinan técnicas tradicionales transmitidas por generaciones con innovaciones contemporáneas, creando piezas de excepcional precisión y belleza atemporal.'
                },
                {
                  icon: "design",
                  title: language === 'pt' ? 'Design Personalizado' : 'Diseño Personalizado',
                  description: language === 'pt' 
                    ? 'Cada projeto é único e moldado para refletir sua individualidade. Colaboramos intimamente com clientes para criar peças que transcendem tendências passageiras e capturam a essência atemporal do seu estilo pessoal.' 
                    : 'Cada proyecto es único y moldeado para reflejar su individualidad. Colaboramos íntimamente con clientes para crear piezas que trascienden tendencias pasajeras y capturan la esencia atemporal de su estilo personal.'
                }
              ].map((item, index) => (
                <motion.div 
                  key={item.icon}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="w-14 h-14 rounded-none border border-accent/50 flex items-center justify-center mb-6 group relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-accent/5 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.div
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Icon icon={item.icon} className="w-5 h-5 text-accent" />
                    </motion.div>
                  </div>
                  
                  <div className="flex flex-col">
                    <h4 className="text-lg font-medium mb-3">{item.title}</h4>
                    <motion.div 
                      className="h-px w-16 bg-accent/30 mb-5"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: "left" }}
                    />
                    <p className="text-neutral-600 text-base leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;