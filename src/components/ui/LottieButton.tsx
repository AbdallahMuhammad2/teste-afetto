import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

interface LottieButtonProps {
  jsonUrl: string;
  label: string;
  className?: string;
  variant?: 'outline' | 'filled';
  onClick?: () => void;
}

const LottieButton: React.FC<LottieButtonProps> = ({
  jsonUrl,
  label,
  className = '',
  variant = 'outline',
  onClick
}) => {
  const animationRef = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize Lottie animation
  useEffect(() => {
    if (!animationRef.current) return;
    
    // Load the animation
    animationInstance.current = lottie.loadAnimation({
      container: animationRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: jsonUrl,
    });
    
    // Set animation speed
    if (animationInstance.current) {
      animationInstance.current.setSpeed(1.2);
    }
    
    // Handle animation load complete
    const handleComplete = () => {
      setIsLoaded(true);
      // Go to first frame
      if (animationInstance.current) {
        animationInstance.current.goToAndStop(0, true);
      }
    };
    
    animationInstance.current.addEventListener('DOMLoaded', handleComplete);
    
    // Cleanup
    return () => {
      if (animationInstance.current) {
        animationInstance.current.removeEventListener('DOMLoaded', handleComplete);
        animationInstance.current.destroy();
        animationInstance.current = null;
      }
    };
  }, [jsonUrl]);
  
  // Handle hover state to control animation
  useEffect(() => {
    if (!animationInstance.current || !isLoaded) return;
    
    if (isHovered) {
      // Play forward when hovering
      animationInstance.current.setDirection(1);
      animationInstance.current.play();
    } else {
      // Play in reverse when not hovering
      animationInstance.current.setDirection(-1);
      animationInstance.current.play();
    }
  }, [isHovered, isLoaded]);
  
  // Base button styles
  const baseStyles = "relative isolate flex items-center gap-3 px-6 py-3 bg-transparent border transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";
  
  // Variant-specific styles
  const variantStyles = variant === 'filled' 
    ? "border-accent bg-accent/10 hover:bg-accent/20" 
    : "border-accent hover:bg-accent/5";
    
  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      aria-label={label}
      data-magnetic
    >
      {/* Animation container */}
      <div 
        ref={animationRef}
        className="w-6 h-6 flex-shrink-0"
        aria-hidden="true"
      />
      
      {/* Button text */}
      <span className="font-medium text-sm">{label}</span>
      
      {/* Accent overlay for filled variant */}
      {variant === 'filled' && (
        <div 
          className="absolute inset-0 -z-10 opacity-10 bg-accent" 
          aria-hidden="true"
        />
      )}
      
      {/* Button shine effect */}
      <div 
        className={`absolute inset-0 -z-10 transform ${isHovered ? 'animate-accent-shimmer' : ''}`}
        aria-hidden="true"
      />
    </button>
  );
};

export default LottieButton;