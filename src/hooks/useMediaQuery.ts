import { useState, useEffect } from 'react';

/**
 * Custom React hook that returns whether a media query matches.
 * Updates when the match state changes.
 * 
 * @param query The media query to check (e.g., '(min-width: 768px)')
 * @returns A boolean indicating whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the current match state
  const [matches, setMatches] = useState<boolean>(() => {
    // Check for SSR - window might not be available
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined') return undefined;

    // Create media query list
    const mediaQueryList = window.matchMedia(query);
    
    // Update the state initially
    setMatches(mediaQueryList.matches);

    // Define the change handler
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
      return () => {
        mediaQueryList.removeEventListener('change', handleChange);
      };
    } 
    // Legacy browsers (Safari < 14, IE)
    else {
      // @ts-ignore - addListener is deprecated but needed for older browsers
      mediaQueryList.addListener(handleChange);
      return () => {
        // @ts-ignore - removeListener is deprecated but needed for older browsers
        mediaQueryList.removeListener(handleChange);
      };
    }
  }, [query]);

  return matches;
}