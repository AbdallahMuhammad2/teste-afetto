import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSectionsOptions {
  titleSelector?: string;
  subtitleSelector?: string;
  lineSelector?: string;
  sectionSelector?: string;
  refreshDelay?: number;
}

const useScrollSections = (options: ScrollSectionsOptions = {}) => {
  const {
    titleSelector = '[data-animate="title"]',
    subtitleSelector = '[data-animate="subtitle"]',
    lineSelector = '[data-animate="line"]',
    sectionSelector = '.section',
    refreshDelay = 250
  } = options;
  
  const timelineRefs = useRef<gsap.core.Timeline[]>([]);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Clear any existing animations
    const clearTimelines = () => {
      timelineRefs.current.forEach(timeline => {
        if (timeline.scrollTrigger) {
          timeline.scrollTrigger.kill();
        }
        timeline.kill();
      });
      timelineRefs.current = [];
    };
    
    // Initialize animations for all sections
    const initAnimations = () => {
      clearTimelines();
      
      // Select all sections with data-animate attribute
      const sections = document.querySelectorAll(`${sectionSelector}[data-animate]`);
      
      sections.forEach(section => {
        // Create a timeline for this section
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        });
        
        // Animate titles with clip-path
        const titles = section.querySelectorAll(titleSelector);
        if (titles.length) {
          tl.fromTo(
            titles,
            {
              clipPath: "inset(100% 0% 0% 0%)",
              opacity: 0,
              y: 40
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              y: 0,
              duration: 1.2,
              stagger: 0.1,
              ease: "power4.out"
            },
            0
          );
        }
        
        // Animate subtitles with opacity
        const subtitles = section.querySelectorAll(subtitleSelector);
        if (subtitles.length) {
          tl.fromTo(
            subtitles,
            {
              opacity: 0,
              y: 20
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out"
            },
            0.2
          );
        }
        
        // Animate lines with scaleX
        const lines = section.querySelectorAll(lineSelector);
        if (lines.length) {
          tl.fromTo(
            lines,
            {
              scaleX: 0,
              transformOrigin: "left center"
            },
            {
              scaleX: 1,
              duration: 1.4,
              ease: "power2.inOut"
            },
            0.3
          );
        }
        
        // Store the timeline reference
        timelineRefs.current.push(tl);
      });
    };
    
    // Initialize animations
    initAnimations();
    
    // Handle resize with debounce
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        // Refresh ScrollTrigger and reinitialize animations
        ScrollTrigger.refresh();
        initAnimations();
      }, refreshDelay);
    });
    
    // Observe body for layout shifts
    resizeObserver.observe(document.body);
    
    // Cleanup
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
      clearTimelines();
    };
  }, [sectionSelector, titleSelector, subtitleSelector, lineSelector, refreshDelay]);
  
  return {
    refresh: () => ScrollTrigger.refresh()
  };
};

export default useScrollSections;