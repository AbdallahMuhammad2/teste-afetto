import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Plus, Eye, Clock, MapPin, Award, ArrowUpRight, ChevronDown, X, Filter, Maximize, ArrowDownWideNarrow } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import { translations } from '../data/translations';
import { projects } from '../data/projects';

const Portfolio: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredProjectRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  
  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const { scrollYProgress: featuredScrollProgress } = useScroll({
    target: featuredProjectRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: projectsScrollProgress } = useScroll({
    target: projectsSectionRef,
  });
  
  // Transform values for animations
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const featuredImageScale = useTransform(featuredScrollProgress, [0, 0.5], [1.1, 1]);
  const featuredTextOpacity = useTransform(featuredScrollProgress, [0, 0.3], [0, 1]);
  const featuredTextY = useTransform(featuredScrollProgress, [0, 0.3], [30, 0]);
  
  // Progress indicator
  const scaleX = useTransform(projectsScrollProgress, [0, 1], [0, 1]);
  const progress = useMotionTemplate`${scaleX.get() * 100}%`;
  
  // Get category from URL if exists
  const urlParams = new URLSearchParams(location.search);
  const categoryParam = urlParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isGridView, setIsGridView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [previewProject, setPreviewProject] = useState<typeof projects[0] | null>(null);
  
  // Filter and sort projects when category or sort order changes
  useEffect(() => {
    let result = [...projects];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(project => project.category === selectedCategory);
    }
    
    // Sort projects
    if (sortOrder === 'newest') {
      result.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    } else if (sortOrder === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    setFilteredProjects(result);
  }, [selectedCategory, sortOrder]);
  
  // Update filter when URL changes
  useEffect(() => {
    const category = urlParams.get('category');
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('all');
    }
  }, [location.search]);
  
  // Generate categories for filter with counts
  const categoryCounts = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categories = [
    { id: 'all', name: t.portfolio.all, count: projects.length },
    { id: 'living', name: t.categories.living, count: categoryCounts['living'] || 0 },
    { id: 'dining', name: t.categories.dining, count: categoryCounts['dining'] || 0 },
    { id: 'bedroom', name: t.categories.bedroom, count: categoryCounts['bedroom'] || 0 },
    { id: 'office', name: t.categories.office, count: categoryCounts['office'] || 0 },
  ];
  
  // Find the featured project
  const featuredProject = projects.find(p => p.featured) || projects[0];

  // Handle project preview
  const openPreview = (project: typeof projects[0]) => {
    setPreviewProject(project);
    document.body.style.overflow = 'hidden';
  };
  
  const closePreview = () => {
    setPreviewProject(null);
    document.body.style.overflow = '';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-b from-[#181617] via-[#23201C] to-[#1a1713] min-h-screen"
      >
        {/* Progress indicator */}
        <motion.div 
          className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-accent/50 origin-left"
          style={{ scaleX }}
        />

        {/* Premium Hero Section with Parallax Effect */}
        <motion.div
          ref={heroRef}
          className="relative h-[80vh] flex items-center justify-center overflow-hidden"
        >
          {/* Parallax background */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              scale: heroScale,
              opacity: heroOpacity
            }}
          >
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img
              src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Portfolio" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute top-20 right-[10%] w-96 h-96 rounded-full border border-accent/10 opacity-20 hidden lg:block"
            initial={{ scale: 0.8, rotate: 45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 0.2 }}
            transition={{ duration: 3, ease: [0.32, 0.75, 0.36, 1] }}
          />

          <motion.div
            className="absolute bottom-40 left-[5%] w-64 h-64 rounded-full border border-accent/10 opacity-10 hidden lg:block"
            initial={{ scale: 0.8, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 0.1 }}
            transition={{ duration: 3, delay: 0.5, ease: [0.32, 0.75, 0.36, 1] }}
          />

          {/* Content */}
          <div className="container mx-auto px-6 md:px-20 relative z-10 text-white">
            <motion.div
              className="max-w-3xl text-center mx-auto"
              style={{ y: heroTextY }}
            >
              <motion.div 
                className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {language === 'pt' ? 'Nossa Coleção' : 'Nuestra Colección'}
              </motion.div>
              
              <div className="overflow-hidden mb-4">
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-serif font-light"
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                >
                  {t.portfolio.title}
                </motion.h1>
              </div>
              
              <motion.div
                className="h-[2px] w-32 bg-accent mx-auto my-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'center' }}
              />
              
              <motion.p 
                className="text-xl md:text-2xl font-light max-w-xl mx-auto text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                {t.portfolio.subtitle}
              </motion.p>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <motion.div
              className="w-[1px] h-10 bg-accent/70 mx-auto"
              animate={{ 
                scaleY: [0.3, 1, 0.3], 
                opacity: [0.2, 1, 0.2], 
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut", 
                repeat: Infinity,
              }}
              style={{ transformOrigin: "top" }}
            />
          </motion.div>
        </motion.div>

        {/* Featured Project Section */}
        <motion.section 
          ref={featuredProjectRef}
          className="relative overflow-hidden py-24 md:py-32 bg-[#1a1713]"
        >
          <div className="container mx-auto px-6 md:px-20 relative z-10">
            <motion.div 
              className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {language === 'pt' ? 'Projeto em Destaque' : 'Proyecto Destacado'}
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
              {/* Featured project image */}
              <motion.div 
                className="relative rounded-lg overflow-hidden h-[500px] lg:h-[600px]"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="h-full w-full"
                  style={{ scale: featuredImageScale }}
                >
                  <img 
                    src={featuredProject.images[0]} 
                    alt={featuredProject.title[language]} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Hover overlay with zoom button */}
                <motion.div
                  className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  whileHover={{ opacity: 1 }}
                >
                  <motion.button
                    className="bg-accent rounded-full w-14 h-14 flex items-center justify-center"
                    onClick={() => openPreview(featuredProject)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Maximize size={20} className="text-black" />
                  </motion.button>
                </motion.div>
                
                {/* Award badge */}
                <div className="absolute top-6 left-6 bg-accent text-black text-xs px-4 py-2 rounded-full flex items-center">
                  <Award size={14} className="mr-2" />
                  {language === 'pt' ? 'Projeto Premiado' : 'Proyecto Premiado'}
                </div>
              </motion.div>
              
              {/* Featured project content */}
              <motion.div 
                className="flex flex-col justify-center"
                style={{ opacity: featuredTextOpacity, y: featuredTextY }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-accent text-xs uppercase tracking-wider">
                    {t.categories[featuredProject.category as keyof typeof t.categories]}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-white/60 text-xs">{featuredProject.year}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-6">
                  {featuredProject.title[language]}
                </h2>
                
                <motion.div
                  className="h-[2px] w-24 bg-accent mb-6"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left' }}
                />
                
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  {featuredProject.description[language]}
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="space-y-1">
                    <div className="text-white/50 text-xs uppercase tracking-wider">
                      {language === 'pt' ? 'Localização' : 'Ubicación'}
                    </div>
                    <div className="text-white text-sm flex items-center">
                      <MapPin size={14} className="mr-2 text-accent" />
                      {featuredProject.location}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-white/50 text-xs uppercase tracking-wider">
                      {language === 'pt' ? 'Tamanho' : 'Tamaño'}
                    </div>
                    <div className="text-white text-sm">
                      {featuredProject.size} m²
                    </div>
                  </div>
                </div>
                
                <Link 
                  to={`/projeto/${featuredProject.slug}`} 
                  className="group inline-flex items-center self-start relative overflow-hidden"
                >
                  <motion.div 
                    className="relative py-3 px-6 border border-accent text-white flex items-center space-x-2 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                      {language === 'pt' ? 'Ver Projeto Completo' : 'Ver Proyecto Completo'}
                    </span>
                    <ArrowUpRight 
                      size={16} 
                      className="relative z-10 group-hover:text-black transition-colors duration-300" 
                    />
                    
                    <motion.div 
                      className="absolute inset-0 bg-accent"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full border border-accent/5 hidden lg:block"
            animate={{ 
              rotate: [0, 360],
              transition: { duration: 50, repeat: Infinity, ease: "linear" }
            }}
          />
        </motion.section>

        {/* Portfolio Section */}
        <section 
          ref={projectsSectionRef}
          className="py-32 relative overflow-hidden"
        >
          {/* Background accent elements */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="h-full w-full grid grid-cols-6 md:grid-cols-12">
              {Array(12).fill(0).map((_, i) => (
                <div key={`grid-col-${i}`} className="h-full border-l border-white/30 last:border-r"></div>
              ))}
            </div>
          </div>

          <div className="container mx-auto px-6 md:px-20 relative z-10">
            {/* Filters section with toggle */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-white group mb-4"
              >
                <Filter size={16} className="text-accent" />
                <span>{language === 'pt' ? 'Filtros & Ordenação' : 'Filtros & Ordenación'}</span>
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} className="text-accent" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mt-2 border border-white/10"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Categories filter */}
                      <div>
                        <h4 className="text-white font-serif text-lg mb-4">
                          {language === 'pt' ? 'Categorias' : 'Categorías'}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              className={`px-4 py-2 rounded-full text-sm flex items-center ${
                                selectedCategory === category.id
                                  ? 'bg-accent text-black'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              } transition-all duration-300`}
                              onClick={() => setSelectedCategory(category.id)}
                            >
                              <span>{category.name}</span>
                              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-black/20">
                                {category.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Sort order */}
                      <div>
                        <h4 className="text-white font-serif text-lg mb-4">
                          {language === 'pt' ? 'Ordenar por' : 'Ordenar por'}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          <button
                            className={`px-4 py-2 rounded-full text-sm ${
                              sortOrder === 'newest'
                                ? 'bg-accent text-black'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            } transition-all duration-300`}
                            onClick={() => setSortOrder('newest')}
                          >
                            {language === 'pt' ? 'Mais recentes' : 'Más recientes'}
                          </button>
                          <button
                            className={`px-4 py-2 rounded-full text-sm ${
                              sortOrder === 'oldest'
                                ? 'bg-accent text-black'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            } transition-all duration-300`}
                            onClick={() => setSortOrder('oldest')}
                          >
                            {language === 'pt' ? 'Mais antigos' : 'Más antiguos'}
                          </button>
                          <button
                            className={`px-4 py-2 rounded-full text-sm ${
                              sortOrder === 'featured'
                                ? 'bg-accent text-black'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            } transition-all duration-300`}
                            onClick={() => setSortOrder('featured')}
                          >
                            {language === 'pt' ? 'Destaques' : 'Destacados'}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/10 flex justify-between">
                      {/* View toggle */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-full p-1 flex">
                        <button 
                          className={`px-4 py-1.5 rounded-full text-sm transition ${isGridView ? 'bg-accent text-black' : 'text-white/70'}`}
                          onClick={() => setIsGridView(true)}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="7" height="7" />
                              <rect x="14" y="3" width="7" height="7" />
                              <rect x="3" y="14" width="7" height="7" />
                              <rect x="14" y="14" width="7" height="7" />
                            </svg>
                            {language === 'pt' ? 'Grade' : 'Cuadrícula'}
                          </span>
                        </button>
                        <button 
                          className={`px-4 py-1.5 rounded-full text-sm transition ${!isGridView ? 'bg-accent text-black' : 'text-white/70'}`}
                          onClick={() => setIsGridView(false)}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="21" y1="6" x2="3" y2="6" />
                              <line x1="21" y1="12" x2="3" y2="12" />
                              <line x1="21" y1="18" x2="3" y2="18" />
                            </svg>
                            {language === 'pt' ? 'Lista' : 'Lista'}
                          </span>
                        </button>
                      </div>
                      
                      <div className="text-white/60 text-sm flex items-center">
                        <ArrowDownWideNarrow size={16} className="mr-2" />
                        <span>
                          {language === 'pt'
                            ? `${filteredProjects.length} projeto${filteredProjects.length !== 1 ? 's' : ''}`
                            : `${filteredProjects.length} proyecto${filteredProjects.length !== 1 ? 's' : ''}`
                          }
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Projects header with count */}
            <motion.div 
              className="flex justify-between items-center mb-12 border-b border-white/10 pb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl md:text-2xl font-serif text-white font-light">
                {language === 'pt' ? 'Projetos' : 'Proyectos'} 
                <span className="text-accent ml-2">({filteredProjects.length})</span>
              </h3>
              
              <div className="text-white/50 text-sm">
                {language === 'pt' 
                  ? selectedCategory === 'all' ? 'Todas as categorias' : `Categoria: ${categories.find(cat => cat.id === selectedCategory)?.name}`
                  : selectedCategory === 'all' ? 'Todas las categorías' : `Categoría: ${categories.find(cat => cat.id === selectedCategory)?.name}`
                }
              </div>
            </motion.div>
            
            {/* Projects Grid with Masonry Layout */}
            <AnimatePresence mode="wait">
              {isGridView ? (
                <motion.div
                  key="grid-view"
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 auto-rows-min"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredProjects.map((project, index) => {
                    // Determine if the project should span 2 columns (for visual interest)
                    const isWide = index % 5 === 0 || index % 5 === 3;
                    // Determine if the project should be taller (for masonry effect)
                    const isTall = index % 4 === 0 || index % 4 === 2;
                    
                    return (
                      <motion.div
                        key={project.id}
                        className={`group ${isWide ? 'md:col-span-2' : 'md:col-span-1'}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7, delay: Math.min(0.1 * (index % 5), 0.5) }}
                        onMouseEnter={() => handleProjectHover(index)}
                        onMouseLeave={() => handleProjectHover(null)}
                      >
                        <div className="relative rounded-lg overflow-hidden cursor-pointer">
                          <motion.div
                            className={`relative ${isTall ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6 }}
                            onClick={() => openPreview(project)}
                          >
                            <img 
                              src={project.images[0]} 
                              alt={project.title[language]} 
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </motion.div>
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                          
                          {/* Hover elements */}
                          <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div className="flex justify-between">
                              <div className="bg-black/60 backdrop-blur-md py-2 px-4 rounded-full text-xs text-white/90">
                                {t.categories[project.category as keyof typeof t.categories]}
                              </div>
                              
                              <motion.div
                                className="bg-accent rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100"
                                initial={{ scale: 0.8, rotate: -45 }}
                                whileHover={{ 
                                  scale: 1,
                                  rotate: 0,
                                  transition: { duration: 0.2 }
                                }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPreview(project);
                                }}
                              >
                                <Eye size={16} className="text-black" />
                              </motion.div>
                            </div>
                            
                            <div>
                              <motion.div 
                                className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                              >
                                <div className="flex items-center space-x-1.5 text-xs text-white/80 mb-2">
                                  <Clock size={12} />
                                  <span>{project.year}</span>
                                  <span className="w-1 h-1 rounded-full bg-white/40" />
                                  <MapPin size={12} />
                                  <span>{project.location}</span>
                                  
                                  {project.featured && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-white/40" />
                                      <Award size={12} className="text-accent" />
                                      <span className="text-accent">
                                        {language === 'pt' ? 'Destaque' : 'Destacado'}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </motion.div>
                              
                              <Link to={`/projeto/${project.slug}`}>
                                <h3 className="text-xl font-serif font-light text-white mb-2">
                                  {project.title[language]}
                                </h3>
                              </Link>
                              
                              <motion.div className="flex justify-between items-center">
                                <Link 
                                  to={`/projeto/${project.slug}`}
                                  className="flex items-center text-accent text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                >
                                  <span className="mr-2">
                                    {language === 'pt' ? 'Ver detalhes' : 'Ver detalles'}
                                  </span>
                                  <ArrowRight size={14} />
                                </Link>
                                
                                <div className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                  {project.size} m²
                                </div>
                              </motion.div>
                            </div>
                          </div>
                          
                          {/* Tag indicator */}
                          <motion.div 
                            className={`absolute top-0 left-8 w-1 h-8 ${project.category === 'living' ? 'bg-blue-400' : project.category === 'dining' ? 'bg-amber-400' : project.category === 'bedroom' ? 'bg-rose-400' : 'bg-emerald-400'}`}
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 + (index * 0.05) }}
                            style={{ transformOrigin: 'top' }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="list-view"
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div 
                      key={project.id}
                      className="group bg-white/5 rounded-lg overflow-hidden border border-white/5 hover:border-accent/30 transition-colors duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: Math.min(0.05 * index, 0.3) }}
                    >
                      <Link to={`/projeto/${project.slug}`} className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
                          {/* Category color indicator */}
                          <div 
                            className={`absolute top-0 left-0 w-full h-1 md:w-1 md:h-full ${
                              project.category === 'living' ? 'bg-blue-400' : 
                              project.category === 'dining' ? 'bg-amber-400' : 
                              project.category === 'bedroom' ? 'bg-rose-400' : 
                              'bg-emerald-400'
                            }`} 
                          />
                          
                          <motion.div
                            className="h-full w-full"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                          >
                            <img 
                              src={project.images[0]} 
                              alt={project.title[language]} 
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </motion.div>
                          
                          <motion.div
                            className="absolute inset-0 bg-black/20 opacity-0 md:group-hover:opacity-100 flex items-center justify-center"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.button
                              className="bg-accent rounded-full w-9 h-9 flex items-center justify-center"
                              onClick={(e) => {
                                e.preventDefault();
                                openPreview(project);
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Maximize size={16} className="text-black" />
                            </motion.button>
                          </motion.div>
                          
                          {project.featured && (
                            <div className="absolute top-3 right-3 bg-accent/90 text-black text-xs px-3 py-1 rounded-full flex items-center">
                              <Award size={12} className="mr-1" />
                              {language === 'pt' ? 'Destaque' : 'Destacado'}
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col justify-between relative">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-accent text-xs uppercase tracking-wider">
                                {t.categories[project.category as keyof typeof t.categories]}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-white/40" />
                              <span className="text-white/70 text-xs">{project.year}</span>
                            </div>
                            
                            <h3 className="text-xl font-serif font-light text-white mb-3 group-hover:text-accent transition-colors duration-300">
                              {project.title[language]}
                            </h3>
                            
                            <p className="text-white/70 text-sm line-clamp-2 mb-4">
                              {project.description[language]}
                            </p>
                            
                            <div className="flex items-center space-x-6 text-xs text-white/50">
                              <div className="flex items-center">
                                <MapPin size={12} className="mr-1.5" />
                                {project.location}
                              </div>
                              <div className="flex items-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
                                  <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" />
                                  <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" />
                                  <path d="M12 22.08V12" />
                                </svg>
                                {project.size} m²
                              </div>
                            </div>
                          </div>
                          
                          <motion.div 
                            className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 group"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="text-xs text-white/60 flex items-center">
                              <Clock size={12} className="mr-1.5" />
                              {language === 'pt' ? 'Concluído em' : 'Completado en'} {project.year}
                            </div>
                            
                            <div className="flex items-center text-accent text-sm group">
                              <span className="mr-2">
                                {language === 'pt' ? 'Ver detalhes' : 'Ver detalles'}
                              </span>
                              <ArrowRight size={14} />
                            </div>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            {filteredProjects.length === 0 && (
              <motion.div 
                className="text-center py-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-white/20 text-6xl mb-6">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h4 className="text-2xl font-serif font-light text-white mb-2">
                  {language === 'pt' ? 'Nenhum projeto encontrado' : 'Ningún proyecto encontrado'}
                </h4>
                <p className="text-white/60 mb-10">
                  {language === 'pt' 
                    ? 'Tente selecionar uma categoria diferente' 
                    : 'Intenta seleccionar una categoría diferente'}
                </p>
                <button 
                  className="px-6 py-3 border border-accent/50 text-accent hover:bg-accent hover:text-black transition-all duration-300 rounded-full"
                  onClick={() => setSelectedCategory('all')}
                >
                  {language === 'pt' ? 'Ver todos os projetos' : 'Ver todos los proyectos'}
                </button>
              </motion.div>
            )}
            
            {filteredProjects.length > 0 && (
              <motion.div 
                className="mt-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link 
                  to="/contato" 
                  className="group inline-flex items-center justify-center overflow-hidden relative"
                >
                  <motion.div 
                    className="relative z-10 border-2 border-accent px-10 py-4 text-white font-sans font-light tracking-wider overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                      {language === 'pt' ? 'Consulte sobre um projeto' : 'Consulte sobre un proyecto'}
                    </span>
                    
                    {/* Fill effect */}
                    <motion.div 
                      className="absolute inset-0 bg-accent z-0"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </motion.div>
                  
                  <div className="absolute right-6 opacity-0 group-hover:opacity-100 z-20 transition-opacity duration-300">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight size={16} className="text-black" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </section>
      </motion.div>

      {/* Project Preview Modal */}
      <AnimatePresence>
        {previewProject && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closePreview}
          >
            <motion.div
              className="relative bg-[#23201C] max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md rounded-full p-2 text-white/80 hover:text-white transition-colors"
                onClick={closePreview}
              >
                <X size={20} />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                <div className="relative flex-1 min-h-[300px] md:h-auto">
                  <img 
                    src={previewProject.images[0]} 
                    alt={previewProject.title[language]} 
                    className="w-full h-full object-cover"
                    style={{ maxHeight: '90vh' }}
                  />
                  
                  {previewProject.featured && (
                    <div className="absolute top-4 left-4 bg-accent/90 text-black text-xs px-3 py-1 rounded-full flex items-center">
                      <Award size={12} className="mr-1" />
                      {language === 'pt' ? 'Destaque' : 'Destacado'}
                    </div>
                  )}
                </div>

                <div className="w-full md:w-72 p-6 flex flex-col justify-between bg-[#181617] border-l border-white/10">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`w-2 h-2 rounded-full ${
                        previewProject.category === 'living' ? 'bg-blue-400' : 
                        previewProject.category === 'dining' ? 'bg-amber-400' : 
                        previewProject.category === 'bedroom' ? 'bg-rose-400' : 
                        'bg-emerald-400'
                      }`} />
                      <span className="text-accent text-xs uppercase tracking-wider">
                        {t.categories[previewProject.category as keyof typeof t.categories]}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-serif font-light text-white mb-4">
                      {previewProject.title[language]}
                    </h3>
                    
                    <p className="text-white/70 text-sm mb-6 line-clamp-6">
                      {previewProject.description[language]}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-white/60 text-xs">
                        <MapPin size={14} className="mr-2 text-accent" />
                        <span>{previewProject.location}</span>
                      </div>
                      <div className="flex items-center text-white/60 text-xs">
                        <Clock size={14} className="mr-2 text-accent" />
                        <span>{previewProject.year}</span>
                      </div>
                      <div className="flex items-center text-white/60 text-xs">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 text-accent">
                          <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" />
                          <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" />
                          <path d="M12 22.08V12" />
                        </svg>
                        <span>{previewProject.size} m²</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/projeto/${previewProject.slug}`} 
                    className="w-full bg-accent text-black font-medium py-3 text-center flex items-center justify-center space-x-2 rounded hover:bg-accent/90 transition-colors"
                    onClick={closePreview}
                  >
                    <span>{language === 'pt' ? 'Ver projeto completo' : 'Ver proyecto completo'}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Portfolio;