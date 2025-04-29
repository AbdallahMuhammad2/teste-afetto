import React, { useContext, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import LanguageContext from '../../context/LanguageContext';
import { translations } from '../../data/translations';
import { projects } from '../../data/projects';

interface FeaturedProjectsProps {
  galleryRef: React.RefObject<HTMLDivElement>;
  setCursorVariant: (variant: string) => void;
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ galleryRef, setCursorVariant }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const featuredProjects = projects.filter(project => project.featured);
  
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [hoverInfo, setHoverInfo] = useState({ x: 0, y: 0, project: null as number | null });
  
  const isInView = useInView(galleryRef, { once: true, amount: 0.1 });
  
  // Handle project hover with enhanced coordinates
  const handleProjectHover = (index: number | null, e?: React.MouseEvent) => {
    setActiveProject(index);
    setCursorVariant(index !== null ? "project" : "default");
    
    if (e && index !== null) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setHoverInfo({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        project: index
      });
    }
  };
  
  return (
    <motion.section
      ref={galleryRef}
      className="relative bg-neutral-50 py-28 md:py-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* Enhanced architectural grid with depth */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full grid grid-cols-6 md:grid-cols-12">
          {Array(12).fill(0).map((_, i) => (
            <motion.div 
              key={`grid-col-${i}`} 
              className="h-full border-l border-black/60 last:border-r"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ 
                duration: 1.2, 
                delay: i * 0.04,
                ease: [0.215, 0.61, 0.355, 1] 
              }}
              style={{ transformOrigin: 'top' }}
            />
          ))}
        </div>
      </div>
      
      {/* Enhanced decorative geometric elements */}
      <motion.div 
        className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.05] pointer-events-none"
        initial={{ rotate: 15, scale: 0.9 }}
        animate={isInView ? { rotate: 0, scale: 1 } : {}}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-black">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.2" fill="none" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.2" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.2" />
          <line x1="22" y1="22" x2="78" y2="78" stroke="currentColor" strokeWidth="0.2" />
          <line x1="22" y1="78" x2="78" y2="22" stroke="currentColor" strokeWidth="0.2" />
        </svg>
      </motion.div>
      
      {/* Enhanced accent circle */}
      <motion.div 
        className="absolute bottom-40 left-20 w-[500px] h-[500px] rounded-full border border-black/10 opacity-[0.06] pointer-events-none"
        initial={{ scale: 0.6 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />
      
      <div className="relative container mx-auto px-8 md:px-12">
        {/* Enhanced section header */}
        <div className="mb-24 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <motion.div 
              className="max-w-lg mb-12 md:mb-0"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-accent uppercase tracking-[0.25em] text-xs font-medium mb-6">
                {language === 'pt' ? 'Nossos Trabalhos' : 'Nuestros Trabajos'}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-8 tracking-tight">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: 120 }}
                    animate={isInView ? { y: 0 } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  >
                    {language === 'pt' ? 'Projetos Selecionados' : 'Proyectos Seleccionados'}
                  </motion.div>
                </div>
              </h2>
              <motion.div 
                className="h-px w-24 bg-accent mb-8"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "left" }}
              />
              <p className="text-neutral-600 text-lg max-w-md leading-relaxed">
                {language === 'pt' 
                  ? 'Uma seleção de projetos que demonstram nosso compromisso com a excelência artesanal e design único.'
                  : 'Una selección de proyectos que demuestran nuestro compromiso con la excelencia artesanal y el diseño único.'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hidden md:block"
            >
              <Link 
                to="/portfolio"
                className="group flex items-center"
                onMouseEnter={() => setCursorVariant("link")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <div className="relative overflow-hidden">
                  <span className="block text-neutral-800 relative z-10">
                    {language === 'pt' ? 'Ver todos os projetos' : 'Ver todos los proyectos'}
                  </span>
                  <motion.div 
                    className="absolute bottom-0 left-0 h-px w-full bg-accent"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1, originX: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <motion.div
                  className="ml-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2, 
                    ease: "easeInOut", 
                    repeatDelay: 1 
                  }}
                >
                  <ChevronRight size={18} className="text-accent" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced gallery with advanced masonry layout */}
        <div className="grid grid-cols-12 gap-y-12 md:gap-y-16 gap-x-6 md:gap-x-8">
          {featuredProjects.map((project, index) => (
            <motion.div 
              key={project.id} 
              className={`
                ${index === 0 ? 'col-span-12 md:col-span-7 md:row-span-2' : ''}
                ${index === 1 ? 'col-span-12 md:col-span-5' : ''}
                ${index === 2 ? 'col-span-12 md:col-span-5' : ''}
                ${index >= 3 ? 'col-span-12 md:col-span-4' : ''}
              `}
              initial={{ opacity: 0, y: 80 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 1.4, 
                delay: 0.1 + index * 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <Link 
                to={`/portfolio/${project.id}`} 
                className="group block h-full aspect-[4/3] overflow-hidden relative"
                onMouseEnter={(e) => handleProjectHover(index, e)}
                onMouseMove={(e) => {
                  if (activeProject === index) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoverInfo({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      project: index
                    });
                  }
                }}
                onMouseLeave={() => handleProjectHover(null)}
              >
                {/* Enhanced project image with advanced hover effects */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      filter: "saturate(1.1) contrast(1.05)"
                    }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Enhanced image treatment */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </motion.div>
                </div>
                
                {/* Floating project info on hover */}
                {activeProject === index && (
                  <motion.div 
                    className="absolute z-20 pointer-events-none bg-black/85 backdrop-blur-sm text-white p-4 rounded-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                      left: `${hoverInfo.x}px`, 
                      top: `${hoverInfo.y}px`,
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '200px'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-sm font-medium">{project.title}</h4>
                    <div className="h-px w-full bg-accent/50 my-2"></div>
                    <p className="text-xs text-white/70">{project.category}</p>
                  </motion.div>
                )}
                
                {/* Enhanced overlay with sophisticated reveal animation */}
                <motion.div 
                  className="absolute inset-0 flex flex-col justify-end p-8"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-90"></div>
                  
                  <div className="relative z-10 transform transition-transform duration-700 translate-y-8 group-hover:translate-y-0">
                    <motion.div 
                      className="h-px w-10 bg-accent mb-5 origin-left transform scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                    />
                    <h3 className="text-white text-xl md:text-2xl font-serif mb-2">{project.title}</h3>
                    <p className="text-white/70 text-sm line-clamp-2 max-w-xs mb-4">
                      {project.description[language]}
                    </p>
                    
                    {/* Enhanced button effect */}
                    <div className="overflow-hidden inline-block relative">
                      <div className="relative group/arrow">
                        <div className="flex items-center gap-2 text-white/70 text-sm group-hover:text-accent transition-colors duration-300">
                          <span>{language === 'pt' ? 'Explorar' : 'Explorar'}</span>
                          <span className="group-hover/arrow:translate-x-1 transition-transform duration-300">
                            →
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-px bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Enhanced corner accent */}
                <div className="absolute top-6 right-6 overflow-hidden">
                  <motion.div 
                    className="w-10 h-10 border border-white/40 backdrop-blur-sm flex items-center justify-center"
                    initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                    whileHover={{ opacity: 1, rotate: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Enhanced Mobile CTA for projects */}
        <div className="text-center mt-16 md:hidden">
          <Link 
            to="/portfolio"
            className="inline-flex items-center px-8 py-3 border border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white transition-all duration-300"
          >
            {language === 'pt' ? 'Ver todos os projetos' : 'Ver todos los proyectos'}
            <ChevronRight className="ml-2" size={16} />
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedProjects;