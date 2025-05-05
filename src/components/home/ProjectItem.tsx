import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageContext from '../../context/LanguageContext';

interface ProjectItemProps {
  project: any;
  onHover: (id: string | null, isHovering: boolean) => void;
  onClick: (id: string) => void;
  isSelected: boolean;
  index: number;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ 
  project, 
  onHover, 
  onClick, 
  isSelected,
  index
}) => {
  const { language } = useContext(LanguageContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className="aspect-[4/5] overflow-hidden relative group"
      layoutId={`project-${project.id}`}
      onHoverStart={() => onHover(project.id, true)}
      onHoverEnd={() => onHover(project.id, false)}
      onClick={() => onClick(project.id)}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.4, ease: [0.32, 0.75, 0.36, 1] }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.7, 
          delay: index * 0.05,
          ease: [0.32, 0.75, 0.36, 1] 
        }
      }}
    >
      {/* Elegant image loading animation */}
      <motion.div
        className="absolute inset-0 bg-neutral-900 z-10"
        initial={{ scaleY: 1 }}
        animate={{ 
          scaleY: imageLoaded ? 0 : 1,
          transition: { 
            duration: 0.7, 
            ease: [0.32, 0.75, 0.36, 1],
            delay: 0.1 
          }
        }}
        style={{ transformOrigin: 'top' }}
      />

      {/* Project image with subtle hover animation */}
      <div className="w-full h-full bg-neutral-800 overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title[language]}
          className="w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 1.4, ease: [0.32, 0.75, 0.36, 1] }}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Elegant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Premium info reveal animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6 z-20"
        initial={{ y: 20, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-xs uppercase tracking-wider text-accent/90 mb-1 block">
          {language === 'pt' ? project.categoryName.pt : project.categoryName.es}
        </span>
        
        <h3 className="text-white font-serif text-xl md:text-2xl mb-3">
          {project.title[language]}
        </h3>
        
        <div className="flex justify-between items-end">
          <p className="text-white/70 text-sm max-w-[80%] line-clamp-2">
            {project.description[language]}
          </p>
          
          <motion.div 
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onTap={(e) => e.stopPropagation()}
          >
            <Plus size={18} className="text-black" />
          </motion.div>
        </div>
      </motion.div>

      {/* Selection indicator with pulse animation */}
      {isSelected && (
        <>
          <motion.div
            className="absolute inset-0 border-2 border-accent z-20 pointer-events-none"
            layoutId="selectedProjectBorder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div 
            className="absolute top-4 right-4 w-3 h-3 rounded-full bg-accent"
            layoutId="selectedProjectIndicator"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity 
            }}
          />
        </>
      )}
    </motion.div>
  );
};

export default ProjectItem;