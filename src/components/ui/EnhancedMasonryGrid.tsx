import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../data/projects';
import FadeInSection from './FadeInSection';

interface EnhancedMasonryGridProps {
  items: Project[];
  language: 'pt' | 'es';
}

const EnhancedMasonryGrid: React.FC<EnhancedMasonryGridProps> = ({ items, language }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);
  
  // Determine column count based on viewport width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else if (width < 1536) setColumns(3);
      else setColumns(4);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Create masonry layout
  const getColumnItems = () => {
    const columnItems: Project[][] = Array.from({ length: columns }, () => []);
    
    items.forEach((item, i) => {
      // Distribute items across columns in a way that balances height
      const columnIndex = i % columns;
      columnItems[columnIndex].push(item);
    });
    
    return columnItems;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.6, 0.05, -0.01, 0.9]
      }
    }
  };
  
  return (
    <motion.div 
      ref={gridRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full grid gap-4vw"
      style={{ 
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: '10px'
      }}
    >
      {getColumnItems().map((columnItems, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-4vw">
          {columnItems.map((item) => (
            <motion.div
              key={item.id}
              className="group relative overflow-hidden rounded-sm shadow-lg"
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3, ease: [0.6, 0.05, -0.01, 0.9] }
              }}
            >
              {/* Aspect ratio container - different for each item */}
              <div className={`relative ${
                item.id % 3 === 0 ? 'aspect-[4/5]' : 
                item.id % 3 === 1 ? 'aspect-[1/1]' : 
                'aspect-[3/4]'
              }`}>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-800 ease-luxury group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover overlay with gradient and content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <motion.div
                    className="relative z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-luxury"
                  >
                    <h3 className="text-white text-2xl font-serif mb-2">{item.title}</h3>
                    <div className="w-10 h-0.5 bg-bronze mb-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-luxury"></div>
                    <p className="text-white/90 transform">{item.description[language]}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

export default EnhancedMasonryGrid;