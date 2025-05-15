import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  AnimatePresence, motion, useScroll, useTransform, useMotionValue, 
  useSpring, useMotionTemplate, useInView 
} from 'framer-motion';
import { 
  ArrowUpRight, ChevronRight, Plus, X, ChevronsRight, ArrowLeft,
  Eye, ArrowRight, Star, Check, Clock, Maximize2, Heart, Home, Building, Car, Lamp, Grid, Layout
} from 'lucide-react';
import LanguageContext from '../../context/LanguageContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Project as ProjectType, projects as projectData } from '../../data/projects';

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
    title: { pt: project.title, es: project.title },
    description: { pt: project.description.pt, es: project.description.es },
  }));
  const [projects, setProjects] = useState<ProjectDetails[]>(allProjects);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [viewOptions] = useState({
    depthEffect: true,
    highlightFocus: true
  });
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hoverStates, setHoverStates] = useState<Record<number, boolean>>({});
  
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
    { id: 'all', name: language === 'pt' ? 'Todos' : 'Todos', icon: <Eye size={14} /> },
    { id: 'residential', name: language === 'pt' ? 'Residencial' : 'Residencial', icon: <Home size={14} /> },
    { id: 'commercial', name: language === 'pt' ? 'Comercial' : 'Comercial', icon: <Building size={14} /> },
    { id: 'furniture', name: language === 'pt' ? 'Mobiliário' : 'Mobiliario', icon: <Car size={14} /> },
    { id: 'lighting', name: language === 'pt' ? 'Iluminação' : 'Iluminación', icon: <Lamp size={14} /> },
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
    // setActiveProject(3); // Removed or commented out as it is undefined
    
    if (activeFilter === 'all') {
      setProjects(allProjects);
    } else {
      setProjects(allProjects.filter((project: ProjectDetails) => project.category === activeFilter));
    }
  }, [activeFilter, allProjects]);

  // Toggle favorite status
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(projectId => projectId !== id)
        : [...prev, id]
    );
  };

  // Handle project hover
  const handleProjectHover = (id: number | null, isHovering: boolean) => {
    setHoveredProject(id);
    setCursorVariant(isHovering ? 'project' : 'default');
    
    if (id !== null) {
      setHoverStates(prev => ({
        ...prev,
        [id]: isHovering
      }));
    }
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

  // New premium hover animations
  const cardHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  };
  
  const imageHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.15,
      transition: {
        duration: 1.2,
        ease: [0.19, 1, 0.22, 1]
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
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[url('/images/texture-pattern.png')] bg-repeat opacity-5 pointer-events-none" />
      
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
      
      {/* Animated accent lines */}
      <motion.div 
        className="absolute top-[20%] right-0 h-[1px] w-[30%] bg-gradient-to-l from-transparent via-accent/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
      />
      
      <motion.div 
        className="absolute bottom-[30%] left-0 h-[1px] w-[25%] bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
      />
      
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative">
        {/* Enhanced Section Header with Premium Typography */}
        <div className="mb-20" ref={ref}>
          <motion.div 
            className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.32, 0.75, 0.36, 1] }}
          >
            <span className="relative">
              {language === 'pt' ? '02 — Nossos Projetos' : '02 — Nuestros Proyectos'}
              <motion.span
                className="absolute -left-4 top-1/2 w-2 h-2 rounded-full bg-accent/50"
                animate={{ 
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-12 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.32, 0.75, 0.36, 1] }}
          >
            <span className="block bg-gradient-to-r from-white via-white/90 to-white/80 text-transparent bg-clip-text">
              {language === 'pt' ? 'Portfólio' : 'Portafolio'}
            </span>
            <div className="relative flex items-center">
              <span className="block bg-gradient-to-r from-white via-white/90 to-white/70 text-transparent bg-clip-text">
                {language === 'pt' ? 'Selecionado' : 'Seleccionado'}
              </span>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="ml-6 relative hidden md:flex items-center"
              >
                <span className="h-[1px] w-8 bg-accent/60"></span>
                <span className="h-1 w-1 rounded-full bg-accent mx-2"></span>
                <span className="h-[1px] w-4 bg-accent/30"></span>
              </motion.div>
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

        {/* Enhanced Controls Area */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Premium Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`px-6 py-3 rounded-full text-sm transition-all duration-300 ease-out flex items-center gap-2 overflow-hidden relative ${
                  activeFilter === category.id
                    ? 'bg-gradient-to-r from-accent to-accent/80 text-black font-medium shadow-xl shadow-accent/20'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                }`}
                onClick={() => setActiveFilter(category.id)}
                variants={filterVariants}
                custom={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeFilter === category.id && (
                  <motion.div 
                    className="absolute inset-0 bg-accent opacity-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    layoutId="activeCategoryBackground"
                  />
                )}
                
                {/* Category Icon */}
                <span className={`${
                  activeFilter === category.id ? 'text-black' : 'text-accent/80'
                }`}>
                  {category.icon}
                </span>
                
                {/* Category Name + Count */}
                <span className="flex items-center">
                  {category.name}
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    activeFilter === category.id ? 'bg-black/30 text-white' : 'bg-white/10'
                  }`}>
                    {getCategoryCount(category.id)}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
          
          {/* View Mode Toggles */}
          <motion.div
            className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-sm rounded-full"
            variants={filterVariants}
          >
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-accent text-black' : 'text-white/60'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-full ${viewMode === 'masonry' ? 'bg-accent text-black' : 'text-white/60'}`}
            >
              <Layout size={18} />
            </button>
          </motion.div>
        </motion.div>
        
        {/* Enhanced Project Grid with Premium Card Design */}
        <motion.div
          className={`grid ${viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 [&>*:nth-child(3n+2)]:translate-y-16 [&>*:nth-child(3n+3)]:translate-y-8'
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.slice(0, 6).map((project, index) => (
            <motion.div
              key={project.id}
              ref={el => projectRefs.current[index] = el}
              className={`group cursor-pointer ${
                viewOptions.highlightFocus && hoveredProject !== null && hoveredProject !== project.id 
                  ? 'opacity-60 scale-95' 
                  : ''
              }`}
              variants={itemVariants}
              layout
              initial="rest"
              whileHover="hover"
              animate={hoverStates[project.id] ? "hover" : "rest"}
              onHoverStart={() => !isTabletOrMobile && handleProjectHover(project.id, true)}
              onHoverEnd={() => !isTabletOrMobile && handleProjectHover(project.id, false)}
              onClick={() => handleProjectClick(project.id)}
              style={{
                transition: 'opacity 0.5s ease, transform 0.5s ease, scale 0.5s ease'
              }}
            >
              {/* Premium Card Container */}
              <motion.div 
                className="relative overflow-hidden rounded-lg bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border-[1.5px] border-white/10 shadow-xl shadow-black/30 aspect-[5/6]"
                variants={cardHoverVariants}
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

                {/* Enhanced image container with subtle border */}
                <div className="relative w-full h-full overflow-hidden">
                  {/* Premium hover gradient overlay */}
                  <motion.div 
                    className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ 
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)'
                    }}
                  />
                  
                  {/* Project image with premium hover effect */}
                  <motion.div className="w-full h-full">
                    <motion.img
                      src={project.image}
                      alt={project.title[language]}
                      className="w-full h-full object-cover"
                      variants={imageHoverVariants}
                      onLoad={() => handleImageLoad(project.id)}
                    />
                  </motion.div>

                  {/* Premium status ribbon for exclusive projects */}
                  {project.id % 3 === 0 && (
                    <div className="absolute top-4 left-0">
                      <div className="bg-accent/90 text-black text-xs font-medium px-4 py-1.5 shadow-lg flex items-center">
                        <Star size={12} className="mr-1.5" />
                        <span>Premium</span>
                      </div>
                    </div>
                  )}

                  {/* Favorite button */}
                  <motion.button
                    className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                      favorites.includes(project.id)
                        ? 'bg-accent/90 text-black'
                        : 'bg-black/30 text-white/70 hover:text-white'
                    }`}
                    onClick={(e) => toggleFavorite(project.id, e)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={16} fill={favorites.includes(project.id) ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>

                {/* Premium Info Layout */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 z-20 p-6 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                >
                  {/* Category Chip */}
                  <div className="mb-3">
                    <motion.span 
                      className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-accent/80 text-black backdrop-blur-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                    >
                      {project.category}
                    </motion.span>
                  </div>
                  
                  {/* Project Title */}
                  <h3 className="text-white font-serif text-xl mb-2 leading-tight tracking-wide">
                    {project.title[language]}
                  </h3>

                  {/* Project Description */}
                  <p className="text-white/80 text-sm line-clamp-2 mb-4">
                    {project.description[language]}
                  </p>

                  {/* Action Row */}
                  <div className="flex justify-between items-center">
                    {/* View Details Button */}
                    <motion.div 
                      className="group/btn flex items-center text-sm text-accent font-medium"
                      whileHover={{ x: 3 }}
                    >
                      {language === 'pt' ? 'Ver detalhes' : 'Ver detalles'}
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          repeat: Infinity, 
                          repeatType: "loop", 
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                      >
                        <ArrowRight size={14} />
                      </motion.div>
                    </motion.div>
                    
                    {/* Expand Indicator */}
                    <motion.button 
                      className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      whileHover={{ rotate: 45, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Maximize2 size={14} />
                    </motion.button>
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
              
              {/* Project Meta Info (outside card for clean design) */}
              <motion.div 
                className="mt-5 flex justify-between items-center px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-white/50">
                    {project.year || '2023'}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/20"></div>
                  <div className="text-xs text-white/50">
                    {project.location?.[language] || 'São Paulo'}
                  </div>
                </div>
                
                <div className="text-xs flex items-center text-white/50">
                  <Clock size={12} className="mr-1 text-accent/70" />
                  <span>
                    {language === 'pt' ? 'Atualizado recentemente' : 'Actualizado recientemente'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Immersive Project Preview Modal */}
        <AnimatePresence>
          {isPreviewOpen && selectedProjectData && (
            <motion.div
              ref={previewRef}
              className="mt-16 mb-20 overflow-hidden"
              variants={previewVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
            >
              {/* Premium Glass Card Container */}
              <motion.div 
                className="bg-gradient-to-br from-[#12100F]/80 to-[#1a1713]/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                  {/* Left image column with accent border */}
                  <motion.div 
                    className="col-span-1 lg:col-span-6 h-full min-h-[400px] lg:min-h-[600px] relative overflow-hidden border-r border-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.32, 0.75, 0.36, 1] }}
                  >
                    {/* Premium image container with accent border */}
                    <div className="absolute inset-0 overflow-hidden">
                      {/* Full-bleed image with parallax effect */}
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
                          rotate: useTransform(smoothMouseX, [-1, 1], [-2, 2]),
                          scale: useTransform(smoothMouseY, [-1, 1], [1.05, 0.95]),
                        }}
                      />
                    </div>
                    
                    {/* Enhanced lighting effect overlay */}
                    <motion.div 
                      className="absolute inset-0"
                      style={{
                        background: useMotionTemplate`radial-gradient(circle at ${smoothMouseX.get() * 50 + 50}% ${smoothMouseY.get() * 50 + 50}%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)`
                      }}
                    />

                    {/* Premium left border accent */}
                    <motion.div
                      className="absolute left-0 top-0 w-1 h-full bg-accent/40"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ originY: 0 }}
                    />
                    
                    {/* Premium indicator badge */}
                    <div className="absolute top-6 left-6">
                      <motion.div 
                        className="bg-black/50 backdrop-blur-md px-4 py-2 flex items-center space-x-2 rounded-md"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-white/90 text-xs font-medium">
                          {language === 'pt' ? 'Projeto Destacado' : 'Proyecto Destacado'}
                        </span>
                      </motion.div>
                    </div>

                    {/* Premium close button */}
                    <motion.button
                      className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                      onClick={() => setIsPreviewOpen(false)}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(211, 161, 126, 0.3)" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={18} />
                    </motion.button>
                  </motion.div>
                  
                  {/* Right content column with premium styling */}
                  <motion.div 
                    className="col-span-1 lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.75, 0.36, 1] }}
                  >
                    {/* Premium background elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] bg-accent/5 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    
                    {/* Project info with enhanced typography */}
                    <div>
                      <div className="mb-8 flex items-center">
                        <motion.div
                          className="w-1 h-12 bg-accent mr-6"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.6, ease: [0.32, 0.75, 0.36, 1] }}
                          style={{ transformOrigin: 'top' }}
                        />
                        <div>
                          <motion.div 
                            className="text-accent text-sm uppercase tracking-wider mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            {selectedProjectData.category} 
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent/50 ml-2 relative top-[-2px]"></span>
                          </motion.div>
                          
                          <motion.h3 
                            className="text-3xl lg:text-4xl font-serif font-light text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                          >
                            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                              {selectedProjectData.title[language]}
                            </span>
                          </motion.h3>
                        </div>
                      </div>
                      
                      <motion.p 
                        className="text-white/80 leading-relaxed mb-10 font-sans pl-7"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {selectedProjectData.description[language]}
                      </motion.p>
                      
                      {/* Premium details cards with immersive hover effects */}
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 pl-7"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        {/* Location Card */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.7, delay: 0.7 }}
                          className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent rounded-lg p-5 backdrop-blur-sm border border-white/5 hover:border-accent/30 transition-all duration-300"
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
                          className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent rounded-lg p-5 backdrop-blur-sm border border-white/5 hover:border-accent/30 transition-all duration-300"
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
                      </motion.div>

                      {/* Materials with enhanced visual presentation */}
                      {selectedProjectData.materials && selectedProjectData.materials.length > 0 && (
                        <motion.div
                          className="mb-10 pl-7"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 1.5, ease: "easeOut" }}
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
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {selectedProjectData.materials.slice(0, 4).map((material, idx) => {
                              // Safe handling of material data
                              const materialName = material && typeof material === 'object' 
                                ? (material[language] || material.pt || material.es || "Material")
                                : (typeof material === 'string' ? material : "Material");
                                
                              return (
                                <motion.div 
                                  key={idx}
                                  className="group relative bg-gradient-to-br from-white/8 to-white/3 rounded-lg p-4 border border-white/10 hover:border-accent/30 transition-all duration-300"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 1.6 + (idx * 0.1), duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                  whileHover={{ 
                                    y: -5, 
                                    backgroundColor: "rgba(211, 161, 126, 0.1)",
                                    boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.3)"
                                  }}
                                >
                                  <div className="flex flex-col space-y-3">
                                    {/* Material texture preview with premium styling */}
                                    <motion.div 
                                      className="w-full h-20 rounded-md bg-white/10 overflow-hidden"
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ duration: 0.3 }}
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
                                      
                                      {/* Premium hover overlay */}
                                      <motion.div
                                        className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                      />
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
                                  
                                  {/* Material selection indicator */}
                                  <motion.div 
                                    className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-accent/0 group-hover:bg-accent/20 flex items-center justify-center transition-colors duration-300"
                                    whileHover={{ scale: 1.2, backgroundColor: "rgba(211, 161, 126, 0.4)" }}
                                  >
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      whileHover={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                      className="w-2 h-2 rounded-full bg-accent"
                                    />
                                  </motion.div>
                                </motion.div>
                              );
                            })}
                          </div>
                          
                          {/* Interactive material exploration hint */}
                          <motion.div 
                            className="mt-6 rounded-md bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/10 p-4 flex items-center justify-between"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2, duration: 0.5 }}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                              </div>
                              <p className="text-white/70 text-sm">
                                {language === 'pt' 
                                  ? 'Pesquise mais sobre materiais em nossa biblioteca técnica' 
                                  : 'Investigue más sobre materiales en nuestra biblioteca técnica'}
                              </p>
                            </div>
                            
                            <motion.button
                              className="text-accent text-sm flex items-center font-medium"
                              whileHover={{ x: 3 }}
                            >
                              {language === 'pt' ? 'Explorar' : 'Explorar'}
                              <ArrowRight size={16} className="ml-1.5" />
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      )}
                      
                      {/* Premium project action buttons */}
                      <motion.div 
                        className="flex flex-col sm:flex-row gap-4 mt-6 pl-7"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                      >
                        <motion.a 
                          href={`/projetos/${selectedProjectData.id}`}
                          className="group relative overflow-hidden inline-flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className="relative z-10 bg-gradient-to-r from-accent to-accent/90 px-8 py-4 text-black font-medium tracking-wide overflow-hidden"
                          >
                            <motion.span className="relative z-10 flex items-center">
                              {language === 'pt' ? 'Ver projeto completo' : 'Ver proyecto completo'}
                              
                              <motion.div
                                className="ml-2 opacity-70"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                              >
                                <ArrowUpRight size={16} />
                              </motion.div>
                            </motion.span>
                            
                            {/* Enhanced fill effect with subtle shimmer */}
                            <motion.div
                              className="absolute inset-0 bg-white z-0"
                              initial={{ scaleX: 0 }}
                              whileHover={{ scaleX: 1 }}
                              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                              style={{ transformOrigin: 'left' }}
                            />
                          </motion.div>
                        </motion.a>
                        
                        <button
                          className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/30 transition-colors duration-300 text-sm tracking-wide flex items-center justify-center"
                          onClick={() => setIsPreviewOpen(false)}
                        >
                          {language === 'pt' ? 'Fechar detalhes' : 'Cerrar detalles'}
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium View All Projects CTA */}
        <motion.div 
          className="mt-24 md:mt-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block">
            {/* Decorative Elements */}
            <motion.div 
              className="absolute -top-8 -left-8 w-16 h-16 opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full text-accent">
                <circle cx="50" cy="50" r="40" />
                <circle cx="50" cy="50" r="30" />
                <circle cx="50" cy="50" r="20" />
                <line x1="10" y1="50" x2="90" y2="50" />
                <line x1="50" y1="10" x2="50" y2="90" />
              </svg>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-8 -right-8 w-16 h-16 opacity-20"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full text-accent">
                <rect x="20" y="20" width="60" height="60" />
                <rect x="30" y="30" width="40" height="40" />
                <rect x="40" y="40" width="20" height="20" />
              </svg>
            </motion.div>
            
            {/* Premium Button */}
            <a
              href="/projetos"
              className="group inline-flex items-center overflow-hidden relative"
            >
              <motion.div
                className="relative z-10 bg-transparent border-2 border-accent px-12 py-5 text-white font-sans font-light tracking-wider overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              >
                {/* Animated background light effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(211, 161, 126, 0.2) 0%, rgba(211, 161, 126, 0) 70%)',
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                  {language === 'pt' ? 'Ver todos os projetos' : 'Ver todos los proyectos'}
                </span>

                {/* Enhanced fill effect with easing */}
                <motion.div
                  className="absolute inset-0 bg-accent z-0"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  style={{ transformOrigin: 'left' }}
                  />
                </motion.div>
                
                {/* Animated arrow indicator */}
                <motion.div 
                  className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-24 h-24 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100"
                  initial={{ x: -10, rotate: -45 }}
                  animate={{ x: 0, rotate: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  >
                    <ArrowUpRight size={20} className="text-accent" />
                  </motion.div>
                </motion.div>
              </a>
            </div>
            
            {/* Premium category links */}
            <motion.div
              className="mt-12 flex flex-wrap justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {categories.map((category, index) => (
                category.id !== 'all' && (
                  <a 
                    key={category.id}
                    href={`/categorias/${category.id}`}
                    className="text-white/50 hover:text-accent transition-colors duration-300 text-sm tracking-wide flex items-center group"
                  >
                    <span className="group-hover:underline underline-offset-4 decoration-accent/30">
                      {category.name}
                    </span>
                    <ChevronRight size={16} className="ml-1 opacity-50 group-hover:opacity-100" />
                  </a>
                )
              ))}
            </motion.div>
            
            {/* Decorative dots pattern */}
            <div className="mt-20 opacity-20">
              <div className="flex justify-center gap-3">
                {[...Array(7)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-1 w-1 rounded-full bg-accent"
                    animate={{ 
                      opacity: i === 3 ? [0.5, 1, 0.5] : [0.3, 0.7, 0.3]
                    }}
                    transition={{ 
                      duration: 1.5 + i * 0.2,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    );
  };
  
  export default FeaturedProjects;