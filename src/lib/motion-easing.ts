// Easing functions for animation throughout the site
// Keeping these centralized ensures consistency

export const EASING_STANDARD = [0.6, 0.05, -0.01, 0.9]; // Default cubic-bezier
export const EASING_SMOOTH = [0.43, 0.13, 0.23, 0.96]; // Smoother for text animations
export const EASING_BOUNCE = [0.175, 0.885, 0.32, 1.275]; // Slight bounce at the end
export const EASING_ELASTIC = [0.68, -0.6, 0.32, 1.6]; // More pronounced elastic effect

// Transition presets for common animations
export const TRANSITION_FAST = { duration: 0.3, ease: EASING_STANDARD };
export const TRANSITION_MEDIUM = { duration: 0.5, ease: EASING_STANDARD };
export const TRANSITION_SLOW = { duration: 0.8, ease: EASING_STANDARD };