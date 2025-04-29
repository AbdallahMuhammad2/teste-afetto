import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Type definitions
type Project = {
  id: string;
  title: string;
  description: { [key: string]: string };
  image: string;
  aspectRatio: '4/3' | '1/1' | '3/4';
  category?: string;
};

type ProjectsGridProps = {
  projects: Project[];
  language: 'pt-br' | 'en' | 'es';
  onCursorVariantChange?: (variant: string) => void;
};

const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  language,
  onCursorVariantChange
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Use Framer Motion's useInView for triggering animations
  const isInView = useInView(gridRef, { 
    once: true, 
    amount: 0.2,
    margin: "-10% 0px" 
  });
  
  // Start animations when grid enters viewport
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  // Set up IntersectionObserver for staggered reveal of grid items
  useEffect(() => {
    if (!gridRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible class for CSS animations
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -100px 0px' 
      }
    );
    
    // Add delay attributes to each grid item for staggered animation
    const gridItems = gridRef.current.querySelectorAll('.grid-item');
    gridItems.forEach((item, index) => {
      const delay = 0.05 * index;
      item.setAttribute('style', `--delay: ${delay}s`);
      observer.observe(item);
    });
    
    return () => {
      gridItems.forEach((item) => observer.unobserve(item));
    };
  }, [projects]);
  
  // Custom cursor handling for hover states
  const handleProjectHover = (hovering: boolean) => {
    if (onCursorVariantChange) {
      onCursorVariantChange(hovering ? 'project' : 'default');
    }
  };
  
  // Locale-specific text
  const viewProjectText = {
    'pt-br': 'Ver projeto',
    'en': 'View project',
    'es': 'Ver proyecto'
  };
  
  return (
    <div className="relative overflow-hidden" ref={gridRef}>
      <div className="container mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {projects.map((project, index) => {
            // Calculate grid spans based on aspect ratio and position
            // Create visual rhythm with varied layouts
            let colSpan = 'col-span-12 md:col-span-6 lg:col-span-4';
            let rowSpan = '';
            
            if (project.aspectRatio === '4/3') {
              colSpan = index === 0 ? 'col-span-12 md:col-span-8 lg:col-span-8' : 'col-span-12 md:col-span-6 lg:col-span-4';
            } else if (project.aspectRatio === '1/1') {
              colSpan = 'col-span-12 md:col-span-6';
            } else if (project.aspectRatio === '3/4') {
              colSpan = 'col-span-12 md:col-span-6 lg:col-span-8';
              rowSpan = 'md:row-span-2';
            }
            
            // Apply special styling to featured items
            const isSpecial = index === 0 || index % 7 === 0;
            
            return (
              <motion.div
                key={project.id}
                className={`grid-item ${colSpan} ${rowSpan} opacity-0 translate-y-8 scale-[1.05]`}
                initial={{ opacity: 0, y: 60, scale: 1.05 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 1.2, 
                  delay: index * 0.1,
                  ease: [0.25, 1, 0.5, 1] 
                }}
                onMouseEnter={() => handleProjectHover(true)}
                onMouseLeave={() => handleProjectHover(false)}
                whileHover={{ 
                  scale: 1.06, 
                  transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
                }}
              >
                <div className="relative overflow-hidden group h-full">
                  {/* Progressive image loading container with aspect ratio */}
                  <div className={`relative w-full overflow-hidden ${
                    project.aspectRatio === '4/3' ? 'aspect-[4/3]' : 
                    project.aspectRatio === '1/1' ? 'aspect-square' : 
                    'aspect-[3/4]'
                  }`}>
                    {/* Enhanced image with advanced hover effects */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:contrast-[1.1]"
                        loading="lazy"
                      />
                      
                      {/* Premium top-down gradient mask overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                    </div>
                    
                    {/* Slide-up info panel with elegant animation */}
                    <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 transform translate-y-4 opacity-90 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="relative z-10">
                        {/* Category indicator with premium styling */}
                        {project.category && (
                          <div className="mb-2 inline-block text-xs uppercase tracking-widest text-white/80 font-medium">
                            {project.category}
                          </div>
                        )}
                        
                        {/* Serif heading with luxury typography */}
                        <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-white leading-tight tracking-tight mb-2">
                          {project.title}
                        </h3>
                        
                        {/* Two-line summary with elegant fade-in */}
                        <p className="text-white/80 text-sm md:text-base mb-4 max-w-md opacity-0 transform -translate-y-4 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0 line-clamp-2">
                          {project.description[language]}
                        </p>
                        
                        {/* Premium arrow link with animated hover effect */}
                        <Link 
                          to={`/projects/${project.id}`}
                          className="inline-flex items-center text-white/90 hover:text-white group/link"
                          aria-label={`${viewProjectText[language]} - ${project.title}`}
                        >
                          <span className="text-sm font-medium mr-2 relative">
                            {viewProjectText[language]}
                            <span className="absolute bottom-0 left-0 w-full h-px bg-white/40 transform scale-x-0 origin-left transition-transform duration-300 group-hover/link:scale-x-100" />
                          </span>
                          <span className="transform transition-transform duration-300 group-hover/link:translate-x-1">
                            <ChevronRight size={16} />
                          </span>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Premium corner accent for featured projects */}
                    {isSpecial && (
                      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                        <div className="absolute top-0 right-0 transform rotate-45 translate-y-[-50%] translate-x-[50%] w-24 h-3 bg-accent" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Custom visual accents for premium aesthetic */}
      <div className="hidden lg:block">
        <motion.div 
          className="absolute top-24 left-12 w-40 h-40 border border-neutral-200 rounded-full opacity-20 mix-blend-overlay pointer-events-none"
          initial={{ scale: 0.8, rotate: 45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-12 w-64 h-64 border border-neutral-200 rounded-full opacity-10 mix-blend-overlay pointer-events-none"
          initial={{ scale: 0.8, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Additional premium decorative elements */}
        <motion.div 
          className="absolute top-1/3 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-neutral-200/50 to-transparent opacity-30 mix-blend-overlay pointer-events-none"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'top' }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-32 h-px bg-gradient-to-r from-transparent via-neutral-200/50 to-transparent opacity-30 mix-blend-overlay pointer-events-none"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'left' }}
        />
        
        {/* Subtle floating dots for depth */}
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={`dot-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent/30 mix-blend-overlay pointer-events-none"
            style={{ 
              top: `${15 + (i * 15)}%`,
              left: `${10 + (i * 18) % 80}%` 
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 * i }}
            animate={{
              y: [0, 10, 0],
              transition: {
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        ))}
      </div>
      
      {/* Performance optimization: Preconnect to image CDN */}
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      
      {/* Add subtle grain texture overlay for premium feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-10">
        <div className="absolute inset-0 bg-[url('/textures/noise.png')] bg-repeat" style={{ backgroundSize: '128px 128px' }} />
      </div>
    </div>
  );
};

// Extract animation variants for better code organization and reuse
const decorativeVariants = {
  circle: {
    hidden: (rotate: number) => ({ scale: 0.8, rotate }),
    visible: {
      scale: 1,
      rotate: 0,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
    }
  },
  line: {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] }
    }
  }
};

export default ProjectsGrid;