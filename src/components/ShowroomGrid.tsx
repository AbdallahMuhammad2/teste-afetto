'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { EASING_STANDARD } from '../lib/motion-easing';
import Link from 'next/link';

// Gallery item type
type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  category: 'cozinha' | 'closet' | 'sala' | 'outro';
  aspectRatio: number;
};

// Sample gallery items (would come from CMS in production)
const galleryItems: GalleryItem[] = [
  { id: 1, src: '/gallery/kitchen-1.webp', alt: 'Cozinha planejada moderna', category: 'cozinha', aspectRatio: 3/4 },
  { id: 2, src: '/gallery/closet-1.webp', alt: 'Closet espaçoso com iluminação embutida', category: 'closet', aspectRatio: 1 },
  { id: 3, src: '/gallery/living-1.webp', alt: 'Sala de estar com móveis sob medida', category: 'sala', aspectRatio: 16/9 },
  { id: 4, src: '/gallery/kitchen-2.webp', alt: 'Detalhes de armários de cozinha', category: 'cozinha', aspectRatio: 4/5 },
  { id: 5, src: '/gallery/closet-2.webp', alt: 'Closet minimalista', category: 'closet', aspectRatio: 3/4 },
  { id: 6, src: '/gallery/living-2.webp', alt: 'Estante personalizada para sala', category: 'sala', aspectRatio: 1 },
  // Add more items as needed
];

type Category = 'todos' | 'cozinha' | 'closet' | 'sala' | 'outro';

export default function ShowroomGrid() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('todos');
  const [visibleItems, setVisibleItems] = useState<GalleryItem[]>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Filter items based on selected category
  useEffect(() => {
    const filtered = selectedCategory === 'todos' 
      ? galleryItems 
      : galleryItems.filter(item => item.category === selectedCategory);
    setVisibleItems(filtered);
  }, [selectedCategory]);

  return (
    <section className="py-20 px-4 md:px-8 bg-white" id="portfolio">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASING_STANDARD }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Projetos Exclusivos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra criações sob medida que transformam espaços em experiências únicas.
          </p>
        </motion.div>

        {/* Category filter chips */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {(['todos', 'cozinha', 'closet', 'sala'] as const).map(category => (
            <motion.button
              key={category}
              className={`relative px-6 py-2 rounded-full ${
                selectedCategory === category 
                ? 'text-white font-medium' 
                : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedCategory === category && (
                <motion.div 
                  className="absolute inset-0 bg-amber-700 rounded-full -z-10"
                  layoutId="categoryBackground"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Masonry grid with GSAP-inspired animations */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {visibleItems.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: EASING_STANDARD 
                }}
                className="relative group"
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link href={`/projeto/${item.id}`} className="block overflow-hidden rounded-md">
                  <div className="relative" style={{ aspectRatio: item.aspectRatio }}>
                    <Image 
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Double border effect */}
                    <motion.div 
                      className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 z-10"
                      style={{ 
                        scale: hoveredItem === item.id ? 0.95 : 1,
                        opacity: hoveredItem === item.id ? 1 : 0
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  {/* Caption with reveal animation */}
                  <div className="absolute bottom-0 inset-x-0 p-4 z-10">
                    <div className="overflow-hidden">
                      <motion.h3 
                        className="text-xl text-white font-medium transform group-hover:translate-y-0 translate-y-8 transition-transform duration-300 ease-out"
                      >
                        {item.alt}
                      </motion.h3>
                    </div>
                    <div className="overflow-hidden">
                      <motion.div 
                        className="text-amber-300 mt-1 flex items-center text-sm font-light transform group-hover:translate-y-0 translate-y-8 transition-transform duration-300 ease-out delay-75"
                      >
                        <span>Ver Projeto</span>
                        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* "View all" button */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/portfolio">
            <motion.button
              className="px-8 py-3 border border-amber-700 text-amber-700 rounded-full hover:bg-amber-700 hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Todos os Projetos
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}