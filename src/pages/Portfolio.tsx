import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LanguageContext from '../context/LanguageContext';
import { translations } from '../data/translations';
import { projects } from '../data/projects';
import MasonryGrid from '../components/ui/MasonryGrid';
import FadeInSection from '../components/ui/FadeInSection';

const Portfolio: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const location = useLocation();
  
  // Get category from URL if exists
  const urlParams = new URLSearchParams(location.search);
  const categoryParam = urlParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  
  // Filter projects when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  // Update filter when URL changes
  useEffect(() => {
    const category = urlParams.get('category');
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('all');
    }
  }, [location.search]);
  
  // Generate categories for filter
  const categories = [
    { id: 'all', name: t.portfolio.all },
    { id: 'living', name: t.categories.living },
    { id: 'dining', name: t.categories.dining },
    { id: 'bedroom', name: t.categories.bedroom },
    { id: 'office', name: t.categories.office },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <section className="h-96 bg-neutral-900 relative flex items-center">
        <div className="absolute inset-0 opacity-50">
          <img 
            src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Portfolio" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative text-white text-center">
          <FadeInSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">{t.portfolio.title}</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">{t.portfolio.subtitle}</p>
          </FadeInSection>
        </div>
      </section>
      
      {/* Portfolio */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 md:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-neutral-500 mr-2">{t.portfolio.filter}</span>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-accent text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Projects Grid */}
          <MasonryGrid items={filteredProjects} language={language} />
        </div>
      </section>
    </motion.div>
  );
};

export default Portfolio;