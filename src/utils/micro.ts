import { MotionProps } from 'framer-motion';

/**
 * Premium micro-interactions library for consistent animations across components
 */

// Standard easing presets
export const EASING = {
  standard: [0.6, 0.05, -0.01, 0.9],
  emphasized: [0.16, 1, 0.3, 1],
  decelerated: [0.0, 0.0, 0.2, 1],
  accelerated: [0.4, 0.0, 1, 1]
};

/**
 * Hover lift effect - elegant elevation on hover
 * @param depth Elevation depth in pixels
 * @param blur Shadow blur amount
 * @returns MotionProps for framer-motion
 */
export const hoverLift = (depth: number = 8, blur: number = 25): MotionProps => ({
  whileHover: {
    y: -depth,
    boxShadow: `0 ${depth}px ${blur}px rgba(0, 0, 0, 0.1)`,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 15 
    }
  },
  whileTap: {
    y: -depth/2,
    scale: 0.98,
    transition: { duration: 0.2 }
  }
});

/**
 * Glass shine effect - subtle reflective highlight 
 * @param angle Angle of the highlight in degrees
 * @param duration Duration of the animation
 * @returns MotionProps for framer-motion
 */
export const glassShine = (angle: number = 135, duration: number = 1.8): MotionProps => {
  const variants = {
    initial: {
      background: `linear-gradient(${angle}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)`,
    },
    hover: {
      background: [
        `linear-gradient(${angle}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 10%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)`,
        `linear-gradient(${angle}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 95%, rgba(255,255,255,0) 100%)`
      ],
      transition: {
        background: {
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      }
    }
  };
  
  return {
    variants,
    initial: "initial",
    whileHover: "hover"
  };
};

/**
 * Parallax effect - subtle movement based on scroll or mouse position
 * @param axis Direction of movement ('x', 'y', or 'both')
 * @param intensity Strength of the effect (0-1)
 * @returns MotionProps for framer-motion
 */
export const parallax = (axis: 'x' | 'y' | 'both' = 'y', intensity: number = 0.2): MotionProps => {
  const getProps = (containerRef: React.RefObject<HTMLElement>) => {
    // Mouse parallax
    if (axis === 'both') {
      return {
        initial: { x: 0, y: 0 },
        animate: (mousePosition: { x: number, y: number }) => ({
          x: mousePosition.x * intensity * 100,
          y: mousePosition.y * intensity * 100,
          transition: { type: 'spring', damping: 50, stiffness: 300 }
        })
      };
    } else {
      // Scroll parallax
      return {
        initial: { [axis]: 0 },
        animate: { 
          [axis]: intensity * 100,
          transition: { 
            type: 'spring',
            damping: 30, 
            stiffness: 200
          }
        }
      };
    }
  };
  
  return getProps as unknown as MotionProps;
};

/**
 * Text reveal animation with staggered children
 * @param direction Direction of reveal ('up', 'down', 'left', 'right')
 * @param staggerChildren Delay between each child animation
 * @returns MotionProps for framer-motion
 */
export const textReveal = (direction: 'up' | 'down' | 'left' | 'right' = 'up', staggerChildren: number = 0.06): MotionProps => {
  const getTransform = () => {
    switch (direction) {
      case 'up': return { y: 40 };
      case 'down': return { y: -40 };
      case 'left': return { x: 40 };
      case 'right': return { x: -40 };
    }
  };
  
  return {
    initial: "hidden",
    animate: "visible",
    variants: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          staggerChildren,
          delayChildren: 0.1,
          ease: EASING.emphasized
        }
      }
    },
    children: {
      variants: {
        hidden: { 
          opacity: 0,
          ...getTransform(),
        },
        visible: { 
          opacity: 1,
          x: 0,
          y: 0,
          transition: { 
            duration: 0.8,
            ease: EASING.emphasized 
          }
        }
      }
    }
  };
};

/**
 * Focus ring for improved accessibility
 * @param color Ring color (defaults to accent color)
 * @param offset Offset from the element edge
 * @returns CSS properties for focus states
 */
export const focusRing = (color?: string, offset: number = 2) => ({
  outline: 'none',
  boxShadow: color 
    ? `0 0 0 ${offset}px ${color}`
    : `0 0 0 ${offset}px var(--color-accent, rgba(var(--color-accent-rgb), 1))`,
});

/**
 * Advanced pulse animation for drawing attention
 * @param scale Maximum scale during pulse
 * @param duration Duration of one pulse cycle
 * @returns MotionProps for framer-motion
 */
export const pulse = (scale: number = 1.05, duration: number = 2): MotionProps => ({
  animate: {
    scale: [1, scale, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    }
  }
});

export default {
  EASING,
  hoverLift,
  glassShine,
  parallax,
  textReveal,
  focusRing,
  pulse
};