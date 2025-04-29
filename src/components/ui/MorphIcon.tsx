import React, { useEffect, useRef, useState } from 'react';
import * as anime from 'animejs'; // Corrected import statement
import { motion, AnimatePresence } from 'framer-motion';

interface MorphIconProps {
  paths: [string, string];
  size?: number;
  duration?: number;
  color?: string;
  hoverColor?: string;
  className?: string;
  label: string;
  interactive?: boolean;
  onClick?: () => void;
}

const MorphIcon: React.FC<MorphIconProps> = ({
  paths,
  size = 24,
  duration = 4000,
  color = 'currentColor',
  hoverColor,
  className = '',
  label,
  interactive = false,
  onClick
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle morphing animation with anime.js
  useEffect(() => {
    if (!pathRef.current) return;
    
    const [pathA, pathB] = paths;
    
    // Create morphing animation
    animationRef.current = anime.default({
      targets: pathRef.current,
      d: [
        { value: pathA },
        { value: pathB },
        { value: pathA }
      ],
      easing: 'easeInOutSine',
      duration,
      loop: true
    });
    
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [paths, duration]);
  
  // Handle interactions
  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
      // Speed up animation on hover for enhanced feedback
      if (animationRef.current) {
        animationRef.current.pause();
        animationRef.current = anime.default({
          targets: pathRef.current,
          d: [
            { value: paths[1] },
            { value: paths[0] }
          ],
          easing: 'easeOutElastic(1, .8)',
          duration: duration / 2,
          loop: false
        });
      }
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
      // Reset original animation after hover
      if (animationRef.current) {
        animationRef.current.pause();
        animationRef.current = anime.default({
          targets: pathRef.current,
          d: paths[0],
          easing: 'easeOutElastic(1, .8)',
          duration: duration / 2,
          complete: () => {
            animationRef.current = anime.default({
              targets: pathRef.current,
              d: [
                { value: paths[0] },
                { value: paths[1] },
                { value: paths[0] }
              ],
              easing: 'easeInOutSine',
              duration,
              loop: true
            });
          }
        });
      }
    }
  };
  
  // Determine final color based on hover state
  const fillColor = isHovered && hoverColor ? hoverColor : color;
  
  return (
    <motion.div
      className={`inline-flex items-center justify-center ${interactive ? 'cursor-pointer' : ''} ${className}`}
      whileHover={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? label : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={!interactive ? label : undefined}
        role={!interactive ? "img" : undefined}
        focusable={interactive ? "true" : "false"}
      >
        <path
          ref={pathRef}
          d={paths[0]}
          fill={fillColor}
          className="transition-colors duration-300"
        />
        
        <AnimatePresence>
          {isHovered && (
            <motion.circle
              cx="12"
              cy="12"
              r="11"
              fill="none"
              stroke={hoverColor || fillColor}
              strokeWidth="0.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
};

// Icon paths file - will be imported from './iconPaths'
const ICON_PATHS = {
  heart: "M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z",
  diamond: "M12 2L22 12L12 22L2 12L12 2Z",
  star: "M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z",
  sparkle: "M12 2L14.39 8.25L21 10L14.39 11.75L12 18L9.61 11.75L3 10L9.61 8.25L12 2Z",
  circle: "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z",
  square: "M3 3H21V21H3V3Z",
  leaf: "M17.5,12C17.5,13.91 16.08,15.56 14.21,15.92C13.82,16 13.4,16 12.96,15.96C12.16,15.88 11.35,15.64 10.61,15.25C8.34,14.14 6.64,12 6.24,9.5C6.13,8.77 6.08,8.04 6.08,7.31C6.08,7.29 6.08,7.27 6.08,7.25C6.08,5.01 7.84,3.25 10.08,3.25C12.32,3.25 14.08,5.01 14.08,7.25C14.08,7.27 14.08,7.29 14.08,7.31C14.08,8.04 14.03,8.77 13.92,9.5C13.88,9.67 13.82,9.83 13.76,10C13.54,10.68 13.04,11.27 12.38,11.58C11.7,11.9 10.9,11.89 10.23,11.53C9.56,11.17 9.08,10.54 8.91,9.78C8.3,7.09 8.9,4.25 10.62,2.01C10.12,2 9.63,2.07 9.17,2.21C7.86,2.6 6.81,3.57 6.29,4.83C5.7,6.28 5.44,7.85 5.44,9.42C5.44,9.53 5.44,9.63 5.44,9.74C5.46,12.03 6.34,14.17 7.88,15.82C8.58,16.57 9.44,17.15 10.39,17.53C12.04,18.29 13.91,18.41 15.64,17.89C17.27,17.39 18.67,16.27 19.49,14.78C19.82,14.18 20.05,13.53 20.16,12.86C20.16,12.85 20.16,12.85 20.16,12.84C20.21,12.56 20.24,12.28 20.24,12C20.24,9.66 19.22,7.5 17.58,6C18.32,7.6 17.63,9.39 16.11,10.28C15.96,10.37 15.8,10.44 15.63,10.49C15.53,10.52 15.42,10.54 15.31,10.55C15.24,10.56 15.17,10.56 15.1,10.56C14.29,10.56 13.39,10.3 12.69,9.8C12.11,9.38 11.67,8.81 11.4,8.16C10.93,7.04 10.81,5.8 11.06,4.62C11.347,3.3 12.056,2.109 13.09,1.23C13.23,1.11 13.38,1 13.54,0.9C12.96,0.5 12.28,0.25 11.57,0.11C11.21,0.04 10.84,0 10.46,0C9.03,0 7.72,0.5 6.68,1.29C4.66,2.82 3.44,5.25 3.43,7.76C3.43,7.77 3.43,7.78 3.43,7.79C3.43,7.91 3.43,8.02 3.43,8.14C3.43,10.51 4.04,12.81 5.2,14.86C5.28,15 5.37,15.14 5.46,15.27C5.76,15.72 6.1,16.14 6.47,16.53C7.71,17.84 9.3,18.78 11.05,19.25C12.24,19.58 13.51,19.67 14.75,19.55C14.9,19.53 15.05,19.51 15.2,19.48C16.69,19.26 18.05,18.65 19.2,17.78C20.52,16.77 21.62,15.46 22.42,14C23.03,12.86 23.51,11.65 23.86,10.41C23.92,10.2 23.97,9.98 24.01,9.76C24.15,9.08 24.22,8.39 24.22,7.69C24.24,5.43 23.37,3.3 21.8,1.73C21.66,1.59 21.52,1.46 21.37,1.33C20.82,0.88 20.21,0.49 19.55,0.21C18.67,-0.17 17.71,-0.14 16.93,0.31C15.97,0.86 15.23,1.77 14.8,2.85C14.72,3.06 14.65,3.27 14.59,3.48C14.27,4.46 14.11,5.49 14.11,6.51C14.11,7.36 14.22,8.21 14.45,9.03C14.54,9.36 14.64,9.69 14.77,10.01C14.96,10.47 15.27,10.87 15.64,11.18C16.07,11.54 16.61,11.75 17.16,11.77C18.31,11.81 19.09,10.89 19.09,9.76C19.09,8.25 18.59,6.76 17.68,5.52C18.78,7.35 19.42,9.47 19.42,11.72C19.42,11.81 19.42,11.91 19.41,12C19.4,12.32 19.36,12.63 19.31,12.95C18.96,15.29 17.55,17.28 15.58,18.43C14.08,19.28 12.35,19.67 10.61,19.56C8.87,19.45 7.2,18.85 5.83,17.91C4.82,17.2 3.96,16.28 3.32,15.23C2.26,13.53 1.68,11.58 1.62,9.59C1.62,9.53 1.62,9.46 1.62,9.39C1.62,9.21 1.63,9.03 1.63,8.85C1.73,6.64 2.42,4.55 3.59,2.73C4.4,1.47 5.49,0.43 6.74,-0.28C7.83,-0.89 9.07,-1.17 10.31,-1.09C11.56,-1.01 12.77,-0.58 13.82,0.15C14.87,0.89 15.76,1.89 16.39,3.08C16.84,3.93 17.15,4.86 17.3,5.81C17.33,6.02 17.36,6.22 17.38,6.43C17.48,7.69 17.17,8.95 16.47,10C16.1,10.54 15.63,11 15.09,11.34C14.56,11.68 13.95,11.89 13.32,11.96C12.7,12.03 12.06,11.96 11.47,11.75C10.88,11.55 10.34,11.23 9.9,10.79C9.45,10.35 9.1,9.81 8.89,9.21C8.67,8.61 8.59,7.97 8.65,7.33C8.87,5.01 9.8,2.83 11.26,1.09C12.4,8.28 18.88,13.02 17.52,11.98Z",
  waves: "M2 12C2 12 5 4 12 4C19 4 22 12 22 12",
  flame: "M12 23C16.4183 23 20 19.4183 20 15C20 12 19 10.5 17.5 8C16.7855 6.75906 17 5 17 3C13 8.5 13.5 10 12 13C10.5 10 11 8.5 7 3C7 5 7.2145 6.75906 6.5 8C5 10.5 4 12 4 15C4 19.4183 7.58172 23 12 23Z"
};

// Create predefined icon morphs
export const createMorphIcon = (pathA: string, pathB: string) => {
  return (props: Omit<MorphIconProps, 'paths'>) => (
    <MorphIcon {...props} paths={[pathA, pathB]} />
  );
};

// Export predefined icon morphs
export const HeartToDiamond = createMorphIcon(ICON_PATHS.heart, ICON_PATHS.diamond);
export const StarToSparkle = createMorphIcon(ICON_PATHS.star, ICON_PATHS.sparkle);
export const CircleToSquare = createMorphIcon(ICON_PATHS.circle, ICON_PATHS.square);
export const LeafToWaves = createMorphIcon(ICON_PATHS.leaf, ICON_PATHS.waves);
export const HeartToStar = createMorphIcon(ICON_PATHS.heart, ICON_PATHS.star);
export const FlameToHeart = createMorphIcon(ICON_PATHS.flame, ICON_PATHS.heart);

export { ICON_PATHS };
export default MorphIcon;