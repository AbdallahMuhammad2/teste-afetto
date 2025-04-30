import React, { useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import { projects } from '../data/projects';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ProjectsGalleryProps {
  handleProjectHover: (index: number | null) => void;
  handleLinkHover: (enter: boolean) => void;
  activeProject: number | null;
}

const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({
  handleProjectHover,
  handleLinkHover,
  activeProject
}) => {
  const { language } = useContext(LanguageContext);
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const featuredProjects = projects.filter(project => project.featured);
  
  const scrollToProject = (index: number) => {
    if (projectsScrollRef.current) {
      const scrollAmount = index * (isMobile ? 80 : 600 + 24); // width + gap
      projectsScrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="relative bg-stone-50 py-32 md:py-48 overflow-hidden">
      {/* Premium architectural grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full grid grid-cols-6 md:grid-cols-12">
          {Array(12).fill(0).map((_, i) => (
            <div key={`grid-col-${i}`} className="h-full border-l border-black/70 last:border-r"></div>
          ))}
        </div>
      </div>
      
      {/* Subtle accent elements */}
      <motion.div 
        className="absolute top-0 left-0 w-screen h-[1px] bg-black/5"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      />
      
      <motion.div 
        className="absolute bottom-0 right-0 w-screen h-[1px] bg-black/5"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'right' }}
      />
      
      <div className="relative container mx-auto px-8 md:px-16">
        {/* Section header */}
        <div className="mb-32">
          <div className="grid grid-cols-12 gap-y-10">
            <motion.div 
              className="col-span-12 md:col-span-5 mb-8"
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-accent uppercase tracking-[0.25em] text-xs font-medium mb-6">
                {language === 'pt' ? '02 — Portfólio' : '02 — Portafolio'}
              </div>
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-serif leading-[1.1] mb-8 tracking-tight text-neutral-900">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: 80 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {language === 'pt' ? 'Trabalhamos com os melhores' : 'Trabajamos con los mejores'}
                  </motion.div>
                </div>
              </h2>
              <motion.div 
                className="h-px w-24 bg-accent mb-8"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>
            
            <motion.div 
              className="col-span-12 md:col-span-6 md:col-start-7"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-neutral-600 text-lg max-w-xl leading-relaxed">
                {language === 'pt' 
                  ? 'Nossa curadoria de projetos demonstra nosso compromisso com a excelência artesanal e a singularidade que define cada criação. Cada peça reflete a convergência entre tradição e inovação.'
                  : 'Nuestra curaduría de proyectos demuestra nuestro compromiso con la excelencia artesanal y la singularidad que define cada creación. Cada pieza refleja la convergencia entre tradición e innovación.'}
              </p>
              
              <div className="hidden md:block mt-12">
                <Link 
                  to="/portfolio"
                  className="group inline-flex items-center"
                  onMouseEnter={() => handleLinkHover(true)}
                  onMouseLeave={() => handleLinkHover(false)}
                >
                  <span className="relative text-neutral-900 border-b border-transparent transition-all duration-500 group-hover:border-accent">
                    {language === 'pt' ? 'Ver toda a coleção' : 'Ver toda la colección'}
                  </span>
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
                    <ChevronRight size={16} className="text-accent" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced Projects Gallery with kinetic scroll */}
        <div 
          className="relative"
          ref={projectsScrollRef}
        >
          <div 
            className="overflow-x-auto hide-scrollbar pb-12"
            style={{ 
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth' 
            }}
          >
            <motion.div 
              className="flex space-x-6"
              drag={!isMobile ? "x" : false}
              dragConstraints={projectsScrollRef}
              dragElastic={0.1}
              style={{ 
                width: 'max-content', 
                paddingLeft: '8vw', 
                paddingRight: '8vw' 
              }}
            >
              {featuredProjects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="w-[min(600px,80vw)] flex-shrink-0 scroll-snap-align-start"
                  initial={{ opacity: 0, y: 50 }} // 50px offset from bottom
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.1 * index,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.1 } // Quick 0.1s scale-up
                  }}
                  onHoverStart={() => handleProjectHover(index)}
                  onHoverEnd={() => handleProjectHover(null)}
                >
                  <div className="group relative overflow-hidden rounded-sm shadow-xl">
                    <div className="aspect-[4/3] overflow-hidden">
                      <motion.img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.05 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ 
                          scale: 1.05,
                          transition: { duration: 0.1 } // Quick 0.1s scale effect
                        }}
                      />
                    </div>
                    
                    {/* Elegant overlay with backdrop blur */}
                    <motion.div 
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="absolute inset-0 flex flex-col justify-end p-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                        >
                          <div className="text-white/70 text-xs tracking-widest uppercase mb-2">
                            {project.category}
                          </div>
                          <h3 className="text-white text-2xl font-serif mb-3">{project.title}</h3>
                          <div className="h-px w-16 bg-accent/70 mb-4"></div>
                          <p className="text-white/80 text-sm max-w-md">
                            {project.description[language]}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Enhanced scroll indicators */}
          <div className="flex justify-center mt-12 space-x-2">
            {featuredProjects.map((_, index) => (
              <motion.button
                key={index}
                className="w-2 h-2 rounded-full bg-neutral-300 relative"
                whileHover={{ scale: 1.5, transition: { duration: 0.1 } }}
                onClick={() => scrollToProject(index)}
              >
                {index === activeProject && (
                  <motion.div
                    className="absolute inset-0 bg-accent rounded-full"
                    layoutId="projectIndicator"
                    transition={{ 
                      type: 'spring',
                      stiffness: 220, 
                      damping: 20
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Mobile CTA */}
        <div className="text-center mt-16 md:hidden">
          <Link 
            to="/portfolio"
            className="inline-flex items-center px-8 py-4 border border-accent/60 text-neutral-900 hover:bg-accent/5 transition-all duration-500"
            onMouseEnter={() => handleLinkHover(true)}
            onMouseLeave={() => handleLinkHover(false)}
          >
            {language === 'pt' ? 'Ver toda a coleção' : 'Ver toda la colección'}
            <ChevronRight className="ml-2" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsGallery;