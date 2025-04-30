import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: {
    pt: string;
    es: string;
  };
  featured: boolean;
}

interface ProjectsSectionProps {
  projects: Project[];
  language: 'pt' | 'es';
  title: string;
  subtitle: string;
  viewAllLink: string;
  viewAllText: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  language,
  title,
  subtitle,
  viewAllLink,
  viewAllText
}) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const smoothYProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100
  });
  
  const opacity = useTransform(smoothYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.98]);
  
  // Parallax effects
  const titleY = useTransform(smoothYProgress, [0, 1], [100, -50]);
  const projectsX = useTransform(smoothYProgress, [0, 1], [0, -50]);
  
  // Track mouse position for parallax hover effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasInteracted) setHasInteracted(true);
      
      // Calculate mouse position relative to window center
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasInteracted]);
  
  // Handle scroll carousel functionality
  const scrollProjects = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <motion.section
      ref={sectionRef}
      className="relative py-40 md:py-56 bg-stone-50 overflow-hidden"
      style={{ 
        opacity,
        scale
      }}
    >
      {/* Premium architectural grid */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="h-full w-full grid grid-cols-6 md:grid-cols-12">
          {Array(12).fill(0).map((_, i) => (
            <div key={`grid-col-${i}`} className="h-full border-l border-black/70 last:border-r"></div>
          ))}
        </div>
      </div>
      
      {/* Elegant accents */}
      <motion.div 
        className="absolute top-0 left-0 w-screen h-[1px] bg-gradient-to-r from-black/10 via-black/5 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      />
      
      <motion.div 
        className="absolute bottom-0 right-0 w-screen h-[1px] bg-gradient-to-l from-black/10 via-black/5 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'right' }}
      />
      
      {/* Section content */}
      <div className="container mx-auto px-8 md:px-16">
        <div className="grid grid-cols-12 gap-y-16 mb-32">
          {/* Premium section header with parallax */}
          <motion.div 
            className="col-span-12 md:col-span-5"
            style={{ y: titleY }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-accent tracking-[0.25em] uppercase text-xs font-medium mb-6">
                {language === 'pt' ? '02 — Portfólio' : '02 — Portafolio'}
              </div>
              
              <h2 className="font-serif text-4xl md:text-5xl xl:text-6xl leading-[1.05] tracking-[-0.02em] text-neutral-900 mb-8">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: 80 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {title}
                  </motion.div>
                </div>
              </h2>
              
              <motion.div 
                className="h-px w-20 bg-accent mb-10"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="col-span-12 md:col-span-6 md:col-start-7"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-neutral-600 text-lg max-w-xl leading-relaxed font-light">
              {subtitle}
            </p>
            
            <div className="hidden md:flex items-center justify-between mt-12">
              <Link 
                to={viewAllLink}
                className="group inline-flex items-center gap-x-3"
                data-cursor="link"
              >
                <span className="relative text-neutral-900 transition-all duration-500 group-hover:text-accent">
                  {viewAllText}
                  <motion.span
                    className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-accent/40"
                    initial={{ scaleX: 0, transformOrigin: 'right' }}
                    whileHover={{ scaleX: 1, transformOrigin: 'left' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className="w-8 h-8 rounded-full border border-accent/30 flex items-center justify-center group-hover:bg-accent/5 transition-colors duration-300">
                  <ArrowUpRight size={14} className="text-accent" />
                </span>
              </Link>
              
              {/* Elegant navigation controls */}
              <div className="flex items-center gap-x-4">
                <button 
                  onClick={() => scrollProjects('left')}
                  className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                  data-cursor="link"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => scrollProjects('right')}
                  className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                  data-cursor="link"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Premium projects carousel */}
        <div className="relative">
          <div 
            ref={carouselRef}
            className="overflow-x-auto hide-scrollbar pb-16"
            style={{ 
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth' 
            }}
            data-cursor="drag"
          >
            <motion.div 
              className="flex space-x-8"
              style={{ 
                width: 'max-content', 
                paddingLeft: '8vw', 
                paddingRight: '8vw',
                x: projectsX
              }}
            >
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="w-[min(560px,80vw)] flex-shrink-0 scroll-snap-align-start"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.1 * index,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ y: -15, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                  onHoverStart={() => setActiveProject(index)}
                  onHoverEnd={() => setActiveProject(null)}
                  data-cursor="project"
                  data-project-name={project.title}
                >
                  <Link to={`/projects/${project.id}`} className="block">
                    <div className="group relative overflow-hidden rounded-sm">
                      {/* Premium image treatment with parallax on hover */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700 z-10"
                        />
                        
                        <motion.img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                          initial={{ scale: 1.05 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          whileHover={{ 
                            scale: 1.05,
                            x: mousePosition.x * -15,
                            y: mousePosition.y * -15,
                          }}
                          transition={{ 
                            scale: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
                            x: { duration: 0.5, ease: "linear" },
                            y: { duration: 0.5, ease: "linear" }
                          }}
                        />
                      </div>
                      
                      {/* Sophisticated content reveal */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-20 transform translate-y-[calc(100%-80px)] group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1] pointer-events-none"
                      >
                        <div className="text-white/70 text-xs tracking-widest uppercase mb-3">
                          {project.category}
                        </div>
                        
                        <h3 className="text-white text-2xl font-serif mb-4">{project.title}</h3>
                        
                        <div className="h-px w-16 bg-accent/70 mb-6 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100 ease-[0.22,1,0.36,1]"></div>
                        
                        <p className="text-white/80 text-sm max-w-md transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200 ease-[0.22,1,0.36,1]">
                          {project.description[language]}
                        </p>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Premium interactive scrollbar */}
          <div className="flex justify-center mt-12 space-x-3">
            {projects.map((_, index) => (
              <motion.button
                key={index}
                className="relative w-16 h-[2px] bg-neutral-300 rounded-full overflow-hidden"
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  if (carouselRef.current) {
                    const itemWidth = 560 + 32; // width + gap
                    const scrollPosition = index * itemWidth;
                    carouselRef.current.scrollTo({
                      left: scrollPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                data-cursor="link"
              >
                {index === activeProject && (
                  <motion.div
                    className="absolute inset-0 bg-accent rounded-full"
                    layoutId="projectIndicator"
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          
          {/* Mobile CTA */}
          <div className="flex justify-center mt-16 md:hidden">
            <Link 
              to={viewAllLink}
              className="inline-flex items-center px-8 py-4 border border-accent/60 text-neutral-900 hover:bg-accent/5 transition-all duration-500"
            >
              {viewAllText}
              <ArrowUpRight className="ml-3" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProjectsSection;