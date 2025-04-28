import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';

// Sample project data - replace with your actual data
const projects = [
  { id: 1, title: 'Sala de Estar Moderna', category: 'living', imageUrl: '/images/projects/living-1.jpg' },
  { id: 2, title: 'Cozinha Integrada', category: 'kitchen', imageUrl: '/images/projects/kitchen-1.jpg' },
  { id: 3, title: 'Closet Planejado', category: 'closet', imageUrl: '/images/projects/closet-1.jpg' },
  { id: 4, title: 'Quarto Principal', category: 'bedroom', imageUrl: '/images/projects/bedroom-1.jpg' },
  { id: 5, title: 'Escritório Home Office', category: 'office', imageUrl: '/images/projects/office-1.jpg' },
  { id: 6, title: 'Sala de Jantar', category: 'dining', imageUrl: '/images/projects/dining-1.jpg' },
  { id: 7, title: 'Banheiro Spa', category: 'bathroom', imageUrl: '/images/projects/bathroom-1.jpg' },
  { id: 8, title: 'Área Gourmet', category: 'outdoor', imageUrl: '/images/projects/outdoor-1.jpg' },
];

interface ShowroomGridProps {
  language: string;
}

const ShowroomGrid: React.FC<ShowroomGridProps> = ({ language }) => {
  const t = translations[language as 'pt' | 'es'];
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [titleRef, titleInView] = useInView({ threshold: 0.3, triggerOnce: true });
  
  // Filter categories
  const categories = [
    { id: 'all', label: language === 'pt' ? 'Todos' : 'Todos' },
    { id: 'living', label: language === 'pt' ? 'Sala' : 'Sala' },
    { id: 'kitchen', label: language === 'pt' ? 'Cozinha' : 'Cocina' },
    { id: 'closet', label: language === 'pt' ? 'Closet' : 'Vestidor' },
    { id: 'bedroom', label: language === 'pt' ? 'Quarto' : 'Dormitorio' },
  ];
  
  // Filter projects based on selected category
  const filteredProjects = activeFilter === 'all' 
    ? projects
    : projects.filter(project => project.category === activeFilter);
  
  return (
    <section className="py-24 md:py-32 bg-white relative">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Title */}
        <motion.div 
          ref={titleRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0, 0.9] }}
        >
          <span className="text-bronze-light uppercase tracking-widest text-sm font-medium mb-3 block">
            {language === 'pt' ? 'Nossa Coleção' : 'Nuestra Colección'}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-5 text-carbon">
            {language === 'pt' ? 'Projetos Exclusivos' : 'Proyectos Exclusivos'}
          </h2>
          <div className="w-16 h-0.5 bg-bronze mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-carbon/70">
            {language === 'pt' 
              ? "Explore nossa coleção de móveis sob medida, onde cada peça é cuidadosamente projetada para se harmonizar com seu espaço."
              : "Explore nuestra colección de muebles a medida, donde cada pieza está cuidadosamente diseñada para armonizar con su espacio."}
          </p>
        </motion.div>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm relative ${
                activeFilter === category.id
                  ? 'text-white'
                  : 'text-carbon hover:text-bronze'
              }`}
              onClick={() => setActiveFilter(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background for active filter */}
              {activeFilter === category.id && (
                <motion.div 
                  className="absolute inset-0 bg-bronze rounded-full -z-10"
                  layoutId="filterBackground"
                  transition={{ duration: 0.3, ease: [0.6, 0.05, 0, 0.9] }}
                />
              )}
              {category.label}
            </motion.button>
          ))}
        </div>
        
        {/* Masonry Grid */}
        <div 
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
          style={{ columnFill: 'balance' }}
        >
          {filteredProjects.map((project, index) => {
            const [ref, inView] = useInView({
              triggerOnce: true,
              threshold: 0.1,
            });
            
            return (
              <motion.div
                key={project.id}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ 
                  duration: 0.7, 
                  ease: [0.6, 0.05, 0, 0.9], 
                  delay: index * 0.09 // 90ms stagger
                }}
                className="break-inside-avoid"
              >
                <div 
                  className="group relative overflow-hidden rounded-sm cursor-pointer h-[350px] md:h-auto"
                  onClick={() => navigate(`/portfolio/${project.id}`)}
                >
                  {/* Project Image */}
                  <div className="w-full h-full overflow-hidden">
                    <motion.img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.7, ease: [0.6, 0.05, 0, 0.9] }}
                    />
                  </div>
                  
                  {/* Caption Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-carbon/30 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-6 transition-opacity duration-300"
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.h3 
                      className="text-white text-xl font-serif"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {project.title}
                    </motion.h3>
                    
                    <motion.div 
                      className="w-10 h-0.5 bg-bronze my-2"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                    
                    <motion.span 
                      className="text-white/80 text-sm"
                      initial={{ y: 10, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      {language === 'pt' ? 'Ver Projeto' : 'Ver Proyecto'}
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-16">
          <motion.button
            className="px-8 py-3 border border-bronze text-bronze hover:bg-bronze hover:text-white transition-colors duration-300"
            onClick={() => navigate('/portfolio')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language === 'pt' ? 'Ver Todos os Projetos' : 'Ver Todos los Proyectos'}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ShowroomGrid;