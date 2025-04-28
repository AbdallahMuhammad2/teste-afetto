import React, { useEffect, useRef } from 'react';
import { Project } from '../../data/projects';
import FadeInSection from './FadeInSection';

interface MasonryGridProps {
  items: Project[];
  language: 'pt' | 'es';
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items, language }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeGrid = () => {
      if (!gridRef.current) return;
      
      const items = gridRef.current.querySelectorAll('.masonry-item');
      const grid = gridRef.current;
      
      // Reset previous layout
      items.forEach(item => {
        (item as HTMLElement).style.gridRowEnd = '';
      });
      
      // Apply masonry layout
      items.forEach(item => {
        const el = item as HTMLElement;
        const rowHeight = parseInt(getComputedStyle(grid).gridAutoRows);
        const rowGap = parseInt(getComputedStyle(grid).gridRowGap);
        const rowSpan = Math.ceil((el.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
        el.style.gridRowEnd = `span ${rowSpan}`;
      });
    };
    
    // Initial layout
    resizeGrid();
    
    // Add resize event listener
    window.addEventListener('resize', resizeGrid);
    
    // Create a mutation observer to detect when images load
    const observer = new MutationObserver(resizeGrid);
    
    if (gridRef.current) {
      observer.observe(gridRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['src', 'style'] 
      });
    }
    
    return () => {
      window.removeEventListener('resize', resizeGrid);
      observer.disconnect();
    };
  }, [items]);

  return (
    <div ref={gridRef} className="masonry-grid">
      {items.map((item, index) => (
        <FadeInSection 
          key={item.id} 
          className="masonry-item" 
          delay={index * 100}
        >
          <div className="group relative overflow-hidden rounded-md shadow-lg">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-white text-xl font-serif">{item.title}</h3>
              <p className="text-white/80 mt-2">{item.description[language]}</p>
            </div>
          </div>
        </FadeInSection>
      ))}
    </div>
  );
};

export default MasonryGrid;