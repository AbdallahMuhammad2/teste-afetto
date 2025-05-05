import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  AnimatePresence, motion, useScroll, useTransform, useMotionValue, 
  useSpring, useMotionTemplate, useInView 
} from 'framer-motion';
import { 
  ArrowUpRight, ChevronRight, Plus, X, ChevronsRight, ArrowLeft
} from 'lucide-react';
import LanguageContext from '../../context/LanguageContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Project as ProjectType, projects as projectData } from '../../data/projects'; // Import both type and data

// Project type definition to match your data structure
interface ProjectDetails {
  id: number;
  title: {
    pt: string;
    es: string;
  };
  description: {
    pt: string;
    es: string;
  };
  category: string;
  image: string;
  largeImage?: string;
  location?: {
    pt: string;
    es: string;
  };
  year?: string;
  area?: string;
  client?: string;
  clientLogo?: string;
  materials?: Array<{
    pt?: string;
    es?: string;
    texture?: string;
    source?: string;
  } | string>;
}

interface FeaturedProjectsProps {
  galleryRef: React.RefObject<HTMLDivElement>;
  setCursorVariant: (variant: string) => void;
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ galleryRef, setCursorVariant }) => {
  // State
  const { language } = useContext(LanguageContext) as { language: 'pt' | 'es' };
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const allProjects: ProjectDetails[] = projectData.map(project => ({
    ...project,
    title: { pt: project.title, es: project.title }, // Transform title to match ProjectDetails type
    description: { pt: project.description.pt, es: project.description.es }, // Transform description correctly
  })); // Use the imported project data
  const [projects, setProjects] = useState<ProjectDetails[]>(allProjects); // Initialize with all projects
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [viewOptions] = useState({
    depthEffect: true,
    highlightFocus: true
  });
  
  // Refs
  const previewRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Media queries
  const isTabletOrMobile = useMediaQuery('(max-width: 1023px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });
  
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.1,
    once: false,
  });
  
  // Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });
  
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const sectionY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  // Filter categories with count
  const categories = [
    { id: 'all', name: language === 'pt' ? 'Todos' : 'Todos' },
    { id: 'residential', name: language === 'pt' ? 'Residencial' : 'Residencial' },
    { id: 'commercial', name: language === 'pt' ? 'Comercial' : 'Comercial' },
    { id: 'furniture', name: language === 'pt' ? 'Mobiliário' : 'Mobiliario' },
    { id: 'lighting', name: language === 'pt' ? 'Iluminação' : 'Iluminación' },
  ];
  // Get count for each category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return allProjects.length;
    return allProjects.filter((project: ProjectDetails) => project.category === categoryId).length;
  };

  // Filter projects by category
  useEffect(() => {
    setSelectedProject(null);
    setIsPreviewOpen(false);
    
    if (activeFilter === 'all') {
      setProjects(allProjects);
    } else {
      setProjects(allProjects.filter((project: ProjectDetails) => project.category === activeFilter));
    }
  }, [activeFilter, allProjects]); // Add allProjects to dependency array

  // Handle project hover for cursor effect
  // Handle project hover for cursor effect
  const handleProjectHover = (id: number | null, isHovering: boolean) => {
    setHoveredProject(id);
    setCursorVariant(isHovering ? 'project' : 'default');
  };

  // Handle project selection with preview
  const handleProjectClick = (id: number) => {
    if (selectedProject === id) {
      setIsPreviewOpen(!isPreviewOpen);
    } else {
      setSelectedProject(id);
      setIsPreviewOpen(true);
    }
  };

  // Close preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        setIsPreviewOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track image loading status for smooth transitions
  const handleImageLoad = (id: number) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };
  
  // Mouse move handler for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = galleryRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      mouseX.set(x * 2 - 1);
      mouseY.set(y * 2 - 1);
    }
  };

  // Get the selected project data for the preview
  const selectedProjectData = selectedProject 
    ? projects.find(project => project.id === selectedProject) 
    : null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.32, 0.75, 0.36, 1]
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.32, 0.75, 0.36, 1]
      }
    }
  };

  // Preview animation variants
  const previewVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.5,
        ease: [0.32, 0.75, 0.36, 1]
      }
    },
    visible: { 
      opacity: 1,
      height: 'auto',
      transition: { 
        duration: 0.5,
        ease: [0.32, 0.75, 0.36, 1]
      }
    }
  };

  return (
    <motion.section
      ref={galleryRef}
      className="py-32 md:py-48 overflow-hidden bg-gradient-to-b from-[#181617] via-[#23201C] to-[#1a1713] relative"
      style={{ 
        opacity: sectionOpacity,
        y: sectionY 
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('/images/texture-pattern.png')] bg-repeat opacity-5 pointer-events-none" />
      
      {/* Dynamic accent lighting */}
      <motion.div 
        className="absolute top-0 right-0 w-3/4 h-[500px] rounded-full blur-[180px] bg-accent/5 -translate-x-1/4 -translate-y-1/2 pointer-events-none"
        style={{
          opacity: useTransform(smoothMouseX, [-1, 1], [0.3, 0.7]),
          x: useTransform(smoothMouseX, [-1, 1], ["-30%", "-20%"]),
          y: useTransform(smoothMouseY, [-1, 1], ["-60%", "-40%"]),
        }}
      />
      
      <motion.div 
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] bg-[#23201C]/70 translate-y-1/4 -translate-x-1/4 pointer-events-none"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative">
        {/* Section header */}
        <div className="mb-20" ref={ref}>
          <motion.div 
            className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.32, 0.75, 0.36, 1] }}
          >
            {language === 'pt' ? '02 — Nossos Projetos' : '02 — Nuestros Proyectos'}
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-12 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.32, 0.75, 0.36, 1] }}
          >
            <span className="block">{language === 'pt' ? 'Portfólio' : 'Portafolio'}</span>
            <div className="relative">
              <span className="block">{language === 'pt' ? 'Selecionado' : 'Seleccionado'}</span>
              <motion.div 
                className="h-px w-36 bg-gradient-to-r from-accent via-accent/50 to-transparent absolute -bottom-4"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.4, delay: 0.4, ease: [0.32, 0.75, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </motion.h2>
          
          <div className="max-w-3xl">
            <motion.p 
              className="text-lg md:text-xl text-white/70 font-sans font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.32, 0.75, 0.36, 1] }}
            >
              {language === 'pt'
                ? 'Uma seleção de projetos que refletem nossa paixão por design atemporal e artesanato excepcional. Cada peça conta uma história única, criada com propósito e atenção meticulosa aos detalhes.'
                : 'Una selección de proyectos que reflejan nuestra pasión por el diseño atemporal y la artesanía excepcional. Cada pieza cuenta una historia única, creada con propósito y atención meticulosa a los detalles.'}
            </motion.p>
          </div>
        </div>

        {/* Premium filter system */}
        <motion.div 
          className="flex flex-wrap gap-3 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              className={`px-6 py-3 rounded-full text-sm transition-all duration-300 ease-out ${
                activeFilter === category.id
                  ? 'bg-accent text-black font-medium shadow-xl shadow-accent/20'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
              }`}
              onClick={() => setActiveFilter(category.id)}
              variants={filterVariants}
              custom={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex items-center justify-between">
                <span className="mr-2">{category.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeFilter === category.id ? 'bg-black/30' : 'bg-white/10'
                }`}>
                  {getCategoryCount(category.id)}
                </span>
              </span>
            </motion.button>
          ))}
        </motion.div>
        
        {/* Project grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.slice(0, 6).map((project, index) => (
            <motion.div
              key={project.id}
              ref={el => projectRefs.current[index] = el}
              className={`aspect-[4/5] overflow-hidden relative group ${
                viewOptions.highlightFocus && hoveredProject !== null && hoveredProject !== project.id 
                  ? 'opacity-60 scale-95' 
                  : ''
              } ${
                viewOptions.depthEffect 
                  ? 'transform perspective-1200 hover:rotate-y-3 hover:rotate-x-3'
                  : ''
              }`}
              variants={itemVariants}
              layout
              onHoverStart={() => !isTabletOrMobile && handleProjectHover(project.id, true)}
              onHoverEnd={() => !isTabletOrMobile && handleProjectHover(project.id, false)}
              onClick={() => handleProjectClick(project.id)}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.4, ease: [0.32, 0.75, 0.36, 1] }
              }}
              style={{
                transition: 'opacity 0.5s ease, transform 0.5s ease, scale 0.5s ease'
              }}
            >
              {/* Image loading effect */}
              <motion.div
                className="absolute inset-0 bg-neutral-900 z-10"
                initial={{ scaleY: 1 }}
                animate={{ 
                  scaleY: imageLoaded[project.id] ? 0 : 1,
                  transition: { 
                    duration: 0.7, 
                    ease: [0.32, 0.75, 0.36, 1],
                    delay: 0.2 
                  }
                }}
                style={{ transformOrigin: 'top' }}
              />

              {/* Project image */}
              <div className="w-full h-full bg-neutral-800 overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={project.title[language]}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  animate={{ 
                    scale: hoveredProject === project.id ? 1.15 : 1,
                    transition: { duration: 1.4, ease: [0.32, 0.75, 0.36, 1] }
                  }}
                  onLoad={() => handleImageLoad(project.id)}
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Info overlay */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
              >
                <div className="mb-2 overflow-hidden">
                  <motion.div
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={`text-xs uppercase tracking-wider ${hoveredProject === project.id ? 'text-accent' : 'text-white/70'}`}>
                      {project.category}
                    </span>
                  </motion.div>
                </div>
                
                <h3 className="text-white font-serif text-xl md:text-2xl mb-2">
                  {project.title[language]}
                </h3>

                <div className="flex justify-between items-end">
                  <p className="text-white/70 max-w-[80%] line-clamp-2">
                    {project.description[language]}
                  </p>
                  
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus size={18} className="text-black" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Selection indicator */}
              {selectedProject === project.id && (
                <motion.div
                  className="absolute inset-0 border-2 border-accent z-20 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layoutId="selectedProject"
                >
                  <motion.div 
                    className="absolute top-4 right-4 w-3 h-3 rounded-full bg-accent"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity 
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Project details preview */}
        <AnimatePresence>
          {isPreviewOpen && selectedProjectData && (
            <motion.div
              ref={previewRef}
              className="mt-12 mb-16 bg-[#12100F] border border-white/10 rounded-xl overflow-hidden"
              variants={previewVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                {/* Left image column */}
                <motion.div 
                  className="col-span-1 lg:col-span-6 h-full min-h-[400px] relative overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: [0.32, 0.75, 0.36, 1] }}
                >
                  {/* Main project image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.img
                      src={selectedProjectData.largeImage || selectedProjectData.image}
                      alt={selectedProjectData.title[language]}
                      className="w-full h-full object-cover object-center"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.5, ease: [0.32, 0.75, 0.36, 1] }}
                      style={{
                        transformStyle: "preserve-3d",
                        perspective: "1200px",
                        rotate: useTransform(smoothMouseX, [-1, 1], [-5, 5]),
                      }}
                    />
                  </div>
                  
                  {/* Dynamic lighting overlay */}
                  <motion.div 
                    className="absolute inset-0"
                    style={{
                      background: useMotionTemplate`radial-gradient(circle at ${smoothMouseX.get() * 50 + 50}% ${smoothMouseY.get() * 50 + 50}%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)`
                    }}
                  />
                  
                  {/* Close button */}
                  <motion.button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white"
                    onClick={() => setIsPreviewOpen(false)}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(211, 161, 126, 0.3)" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={18} />
                  </motion.button>
                </motion.div>
                
                {/* Right content column */}
                <motion.div 
                  className="col-span-1 lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.75, 0.36, 1] }}
                >
                  {/* Project info */}
                  <div>
                    <div className="mb-6 flex items-center">
                      <motion.div
                        className="w-1 h-12 bg-accent mr-4"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, ease: [0.32, 0.75, 0.36, 1] }}
                        style={{ transformOrigin: 'top' }}
                      />
                      <div>
                        <motion.div 
                          className="text-accent text-sm uppercase tracking-wider mb-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          {selectedProjectData.category}
                        </motion.div>
                        
                        <motion.h3 
                          className="text-3xl lg:text-4xl font-serif font-light text-white"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          {selectedProjectData.title[language]}
                        </motion.h3>
                      </div>
                    </div>
                    
                    <motion.p 
                      className="text-white/80 leading-relaxed mb-10 font-sans"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      {selectedProjectData.description[language]}
                    </motion.p>
                    
                    {/* Project details with immersive premium reveal animations */}
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      {/* Location with interactive map preview */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                        className="group relative overflow-hidden bg-black/20 rounded-lg p-5 backdrop-blur-sm border border-white/5 hover:border-accent/30 transition-all duration-300"
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(211, 161, 126, 0.3)" }}
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-colors duration-300"></div>
                        <h4 className="text-accent/80 text-xs uppercase tracking-wider mb-2 flex items-center">
                          <svg className="w-3 h-3 mr-2 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {language === 'pt' ? 'Localização' : 'Ubicación'}
                        </h4>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium text-lg">
                            {selectedProjectData.location?.[language] || 'São Paulo, Brasil'}
                          </p>
                          
                          <motion.div 
                            className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.2, backgroundColor: "rgba(211, 161, 126, 0.4)" }}
                          >
                            <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="15 3 21 3 21 9" />
                              <polyline points="9 21 3 21 3 15" />
                              <line x1="21" y1="3" x2="14" y2="10" />
                              <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                          </motion.div>
                        </div>

                        <motion.div 
                          className="absolute -right-[100px] -bottom-[100px] w-[180px] h-[180px] opacity-0 group-hover:opacity-40 transition-all duration-700 pointer-events-none"
                          initial={{ rotate: 45 }}
                          animate={{ rotate: 0 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full text-accent/30">
                            <circle cx="50" cy="50" r="40" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="35" strokeWidth="0.2" />
                            <circle cx="50" cy="50" r="30" strokeWidth="0.2" />
                            <path d="M50,10 L50,90 M10,50 L90,50" strokeWidth="0.2" />
                            <path d="M30,30 L70,70 M30,70 L70,30" strokeWidth="0.2" />
                          </svg>
                        </motion.div>
                      </motion.div>

                      {/* Year with dynamic timeline visualization */}
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.9 }}
                        className="group relative overflow-hidden bg-black/20 rounded-lg p-5 backdrop-blur-sm border border-white/5 hover:border-accent/30 transition-all duration-300"
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(211, 161, 126, 0.3)" }}
                      >
                        <div className="absolute top-0 right-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-colors duration-300"></div>
                        <h4 className="text-accent/80 text-xs uppercase tracking-wider mb-2 flex items-center">
                          <svg className="w-3 h-3 mr-2 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {language === 'pt' ? 'Ano do Projeto' : 'Año del Proyecto'}
                        </h4>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium text-lg">
                            {selectedProjectData.year || '2023'}
                          </p>
                          
                          <div className="relative">
                            <motion.div 
                              className="hidden lg:flex items-center space-x-1"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.2, duration: 0.5 }}
                            >
                              {[0, 1, 2, 3, 4].map((_, i) => (
                                <motion.div 
                                  key={i}
                                  className={`h-4 w-1.5 rounded-full ${i === 2 ? 'bg-accent' : 'bg-white/30'}`}
                                  animate={i === 2 ? {
                                    height: ["16px", "20px", "16px"],
                                  } : {}}
                                  transition={{
                                    duration: 1.4,
                                    repeat: Infinity,
                                    delay: i * 0.15
                                  }}
                                />
                              ))}
                            </motion.div>
                          </div>
                        </div>
                        
                        <motion.div 
                          className="absolute -right-4 -top-4 w-24 h-24 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full text-accent">
                            <defs>
                              <path id="circle" d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10" />
                            </defs>
                            <text className="text-xs">
                              <textPath href="#circle" startOffset="0%" className="tracking-widest">
                                {`${selectedProjectData.year || '2023'} • ${selectedProjectData.year || '2023'} • `}
                              </textPath>
                            </text>
                          </svg>
                        </motion.div>
                      </motion.div>

                      {/* Area with dynamic visualization */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 1.1 }}
                        className="group relative overflow-hidden bg-black/20 rounded-lg p-5 backdrop-blur-sm border border-white/5 hover:border-accent/30 transition-all duration-300"
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(211, 161, 126, 0.3)" }}
                      >
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-accent/20 group-hover:bg-accent transition-colors duration-300"></div>
                        <h4 className="text-accent/80 text-xs uppercase tracking-wider mb-2 flex items-center">
                          <svg className="w-3 h-3 mr-2 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M9 21V9" />
                          </svg>
                          {language === 'pt' ? 'Dimensões' : 'Dimensiones'}
                        </h4>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium text-lg">
                            {selectedProjectData.area || '180 m²'}
                          </p>
                          
                          <div className="flex items-end space-x-1">
                            <motion.div 
                              className="relative w-3 bg-accent/40 group-hover:bg-accent transition-colors duration-300"
                              style={{ height: '10px' }}
                            />
                            <motion.div 
                              className="relative w-3 bg-accent/40 group-hover:bg-accent transition-colors duration-300"
                              style={{ height: '18px' }}
                            />
                            <motion.div 
                              className="relative w-3 bg-accent/40 group-hover:bg-accent transition-colors duration-300"
                              style={{ height: '14px' }}
                            />
                            <motion.div 
                              className="relative w-3 bg-accent/40 group-hover:bg-accent transition-colors duration-300"
                              style={{ height: '22px' }}
                            />
                          </div>
                        </div>
                        
                        {/* Dynamic area visualization */}
                        <motion.div 
                          className="w-full h-1.5 bg-white/10 mt-2 overflow-hidden rounded-full"
                          whileHover={{ height: '8px' }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div 
                            className="h-full bg-gradient-to-r from-accent/40 to-accent"
                            initial={{ width: 0 }}
                            animate={{ width: '60%' }}
                            transition={{ duration: 0.8, delay: 1.4 }}
                          />
                        </motion.div>
                      </motion.div>

                      {/* Client with premium animation */}
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 1.3 }}
                        className="group relative overflow-hidden bg-black/20 rounded-lg p-5 backdrop-blur-sm border border-white/5 hover:border-accent/30 transition-all duration-300"
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(211, 161, 126, 0.3)" }}
                      >
                        <div className="absolute bottom-0 right-0 w-full h-1 bg-accent/20 group-hover:bg-accent transition-colors duration-300"></div>
                        <h4 className="text-accent/80 text-xs uppercase tracking-wider mb-2 flex items-center">
                          <svg className="w-3 h-3 mr-2 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {language === 'pt' ? 'Cliente' : 'Cliente'}
                        </h4>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium text-lg">
                            {selectedProjectData.client || 'Confidencial'}
                          </p>
                          
                          <motion.div 
                            className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden"
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.3 }}
                          >
                            {selectedProjectData.clientLogo ? (
                              <img 
                                src={selectedProjectData.clientLogo} 
                                alt={selectedProjectData.client || 'Cliente'} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                              </svg>
                            )}
                          </motion.div>
                        </div>
                        
                        {/* Status indicator */}
                        <div className="mt-2 flex items-center">
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-green-400 mr-2"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                          <span className="text-xs text-white/60">
                            {language === 'pt' ? 'Projeto Concluído' : 'Proyecto Completado'}
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Materials with safe handling */}
                    {selectedProjectData.materials && selectedProjectData.materials.length > 0 && (
                      <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 1.5 }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-1 h-8 bg-accent/40 mr-3"></div>
                          <h4 className="text-accent/80 text-sm uppercase tracking-wider flex items-center">
                            <svg className="w-4 h-4 mr-2 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                            {language === 'pt' ? 'Materiais & Texturas' : 'Materiales & Texturas'}
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {selectedProjectData.materials.map((material, idx) => {
                            // Safe handling of material data
                            const materialName = material && typeof material === 'object' 
                              ? (material[language] || material.pt || material.es || "Material")
                              : (typeof material === 'string' ? material : "Material");
                              
                            return (
                              <motion.div 
                                key={idx}
                                className="group relative bg-white/5 rounded-lg p-3 border border-white/10 hover:border-accent/30 transition-all duration-300"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.6 + (idx * 0.1), duration: 0.5 }}
                                whileHover={{ 
                                  y: -5, 
                                  backgroundColor: "rgba(211, 161, 126, 0.1)",
                                  boxShadow: "0 10px 30px -15px rgba(211, 161, 126, 0.2)"
                                }}
                              >
                                <div className="flex items-start space-x-3">
                                  {/* Material texture or pattern preview */}
                                  <motion.div 
                                    className="w-10 h-10 rounded bg-white/10 overflow-hidden flex-shrink-0"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    {typeof material === 'object' && material.texture ? (
                                      <img 
                                        src={material.texture} 
                                        alt={materialName} 
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className={`w-full h-full ${
                                        idx % 5 === 0 ? "bg-gradient-to-br from-amber-700/40 to-amber-900/40" :
                                        idx % 5 === 1 ? "bg-gradient-to-br from-slate-700/40 to-slate-900/40" :
                                        idx % 5 === 2 ? "bg-gradient-to-br from-emerald-700/40 to-emerald-900/40" :
                                        idx % 5 === 3 ? "bg-gradient-to-br from-rose-700/40 to-rose-900/40" :
                                        "bg-gradient-to-br from-indigo-700/40 to-indigo-900/40"
                                      }`} />
                                    )}
                                  </motion.div>
                                  
                                  <div>
                                    <p className="text-white/90 font-medium text-sm leading-tight">
                                      {materialName}
                                    </p>
                                    {typeof material === 'object' && material.source && (
                                      <p className="text-white/40 text-xs mt-1">
                                        {language === 'pt' ? 'Origem: ' : 'Origen: '}
                                        {material.source}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Interactive hover detail */}
                                <motion.div 
                                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  initial={{ opacity: 0 }}
                                  whileHover={{ opacity: 1 }}
                                >
                                  <motion.div 
                                    className="bg-accent/90 text-black text-xs font-medium px-2 py-1 rounded"
                                    initial={{ scale: 0.5 }}
                                    whileHover={{ scale: 1 }}
                                  >
                                    {language === 'pt' ? 'Ver detalhe' : 'Ver detalle'}
                                  </motion.div>
                                </motion.div>
                              </motion.div>
                            );
                          })}
                        </div>
                        
                        {/* Interactive material exploration hint */}
                        <motion.div 
                          className="mt-4 rounded-md bg-accent/5 border border-accent/10 p-3 flex items-center justify-between"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2, duration: 0.5 }}
                        >
                          <p className="text-white/60 text-sm">
                            {language === 'pt' 
                              ? 'Pesquise mais sobre materiais utilizados em nossos projetos' 
                              : 'Investigue más sobre los materiales utilizados en nuestros proyectos'}
                          </p>
                          
                          <motion.button
                            className="text-accent text-sm flex items-center"
                            whileHover={{ x: 3 }}
                          >
                            {language === 'pt' ? 'Biblioteca de materiais' : 'Biblioteca de materiales'}
                            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {/* Project action buttons */}
                    <motion.div 
                      className="flex flex-col sm:flex-row gap-4 mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.7 }}
                    >
                      <motion.button 
                        className="group relative overflow-hidden inline-flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="relative z-10 bg-accent px-6 py-3 text-black font-medium tracking-wide overflow-hidden"
                        >
                          <span className="relative z-10">
                            {language === 'pt' ? 'Ver projeto completo' : 'Ver proyecto completo'}
                          </span>
                          
                          {/* Fill effect */}
                          <motion.div
                            className="absolute inset-0 bg-white z-0"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.4, ease: [0.32, 0.75, 0.36, 1] }}
                            style={{ transformOrigin: 'left' }}
                          />
                        </motion.div>
                        
                        {/* Arrow icon */}
                        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ArrowUpRight size={16} className="text-black" />
                          </motion.div>
                        </div>
                      </motion.button>
                      
                      <button
                        className="px-6 py-3 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors duration-300 text-sm tracking-wide flex items-center justify-center"
                        onClick={() => setIsPreviewOpen(false)}
                      >
                        {language === 'pt' ? 'Fechar detalhes' : 'Cerrar detalles'}
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View all projects CTA */}
        <motion.div 
          className="mt-24 md:mt-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <button
            className="group inline-flex items-center overflow-hidden relative"
          >
            <motion.div
              className="relative z-10 bg-transparent border-2 border-accent px-10 py-4 text-white font-sans font-light tracking-wider overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.32, 0.75, 0.36, 1] }}
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                {language === 'pt' ? 'Ver todos os projetos' : 'Ver todos los proyectos'}
              </span>

              {/* Fill effect */}
              <motion.div
                className="absolute inset-0 bg-accent z-0"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.32, 0.75, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>

            {/* Arrow icon */}
            <div className="absolute right-6 opacity-0 group-hover:opacity-100 z-20 transition-opacity duration-300">
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: [0.32, 0.75, 0.36, 1] 
                }}
              >
                <ArrowUpRight size={16} className="text-black" />
              </motion.div>
            </div>
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedProjects;