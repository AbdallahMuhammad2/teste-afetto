import { useCallback } from 'react';

interface ColumnBaselineResult {
  gridClasses: {
    container: string;
    col: (span: number) => string;
    offset: (span: number) => string;
  };
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  containerWidth: number;
}

/**
 * A hook that provides utility classes for working with a column-based grid
 * @param columns Total number of columns in the grid
 * @param gutter Width of the gutter in pixels
 * @returns Object with grid-related utility functions and values
 */
export const useColumnBaseline = (
  columns: number = 12,
  gutter: number = 72
): ColumnBaselineResult => {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536
  };
  
  const containerWidth = 1280;
  
  // Generate a Tailwind class for a column span
  const colClass = useCallback((span: number): string => {
    if (span <= 0 || span > columns) {
      console.warn(`Column span must be between 1 and ${columns}`);
      return '';
    }
    
    return `
      col-span-${span} 
      sm:col-span-${Math.min(span, 6)}
      md:col-span-${Math.min(span, 8)}
      lg:col-span-${span}
    `.trim();
  }, [columns]);
  
  // Generate a Tailwind class for a column offset
  const offsetClass = useCallback((span: number): string => {
    if (span <= 0 || span >= columns) {
      console.warn(`Offset span must be between 1 and ${columns - 1}`);
      return '';
    }
    
    return `
      col-start-${span + 1}
      sm:col-start-${Math.min(span + 1, 6)}
      md:col-start-${Math.min(span + 1, 8)}
      lg:col-start-${span + 1}
    `.trim();
  }, [columns]);
  
  return {
    gridClasses: {
      container: `max-w-[${containerWidth}px] mx-auto`,
      col: colClass,
      offset: offsetClass
    },
    breakpoints,
    containerWidth
  };
};