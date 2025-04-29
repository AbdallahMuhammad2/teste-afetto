import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags?: string[];
  srcSet?: {
    small: string;
    medium: string;
    large: string;
  };
}

interface MasonryGalleryProps {
  items: GalleryItem[];
  columns?: number;
  gap?: number;
  className?: string;
  personalizeOrder?: boolean;
  favoriteTag?: string;
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  items,
  columns = 3,
  gap = 16,
  className = '',
  personalizeOrder = false,
  favoriteTag
}) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [orderedItems, setOrderedItems] = useState<GalleryItem[]>(items);
  
  // Reorder items based on favorite tag if personalizeOrder is enabled
  useEffect(() => {
    if (personalizeOrder && favoriteTag) {
      const reorderedItems = [...items].sort((a, b) => {
        const aHasTag = a.tags?.includes(favoriteTag) || false;
        const bHasTag = b.tags?.includes(favoriteTag) || false;
        
        if (aHasTag && !bHasTag) return -1;
        if (!aHasTag && bHasTag) return 1;
        return 0;
      });
      
      setOrderedItems(reorderedItems);
    } else {
      setOrderedItems(items);
    }
  }, [items, personalizeOrder, favoriteTag]);
  
  // Set up intersection observer for fade-in animations
  useEffect(() => {
    if (!galleryRef.current) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all gallery items
    const galleryItems = galleryRef.current.querySelectorAll('.masonry-item');
    galleryItems.forEach(item => {
      observer.observe(item);
    });
    
    return () => {
      if (galleryItems) {
        galleryItems.forEach(item => {
          observer.unobserve(item);
        });
      }
    };
  }, [orderedItems]);
  
  // Responsive columns based on screen size
  const responsiveColumnStyle = {
    columnCount: columns,
    columnGap: `${gap}px`,
    margin: 0,
    padding: 0
  };
  
  return (
    <div 
      ref={galleryRef}
      className={`masonry-container ${className}`}
      style={responsiveColumnStyle}
    >
      {orderedItems.map((item) => (
        <motion.div
          key={item.id}
          className="masonry-item fade-up"
          style={{ marginBottom: `${gap}px`, breakInside: 'avoid' }}
        >
          <picture>
            {item.srcSet && (
              <>
                <source media="(min-width: 1280px)" srcSet={item.srcSet.large} />
                <source media="(min-width: 768px)" srcSet={item.srcSet.medium} />
                <source media="(max-width: 767px)" srcSet={item.srcSet.small} />
              </>
            )}
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="w-full h-auto rounded"
              style={{ display: 'block' }}
            />
          </picture>
        </motion.div>
      ))}
    </div>
  );
};

export default MasonryGallery;