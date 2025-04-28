import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface PremiumButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'filled' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  color?: 'bronze' | 'white' | 'carbon';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isMagnetic?: boolean;
  className?: string;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = 'filled',
  size = 'md',
  color = 'bronze',
  icon,
  iconPosition = 'right',
  isMagnetic = true,
  className = '',
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Magnetic effect
  useEffect(() => {
    if (!isMagnetic || !buttonRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = buttonRef.current!.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      
      // Only apply the effect if the mouse is close enough
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const maxDistance = Math.max(width, height) * 0.5;
      
      if (distance < maxDistance) {
        const strength = 15; // Maximum movement in pixels
        const x = (distanceX / maxDistance) * strength;
        const y = (distanceY / maxDistance) * strength;
        setPosition({ x, y });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };
    
    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    buttonRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isMagnetic]);
  
  // Button style classes
  const getBaseClasses = () => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3',
      lg: 'px-8 py-4 text-lg',
    };
    
    let variantClasses = '';
    
    if (variant === 'filled') {
      if (color === 'bronze') {
        variantClasses = 'bg-bronze text-white hover:bg-bronze-dark';
      } else if (color === 'white') {
        variantClasses = 'bg-white text-carbon hover:bg-neutral-100';
      } else {
        variantClasses = 'bg-carbon text-white hover:bg-neutral-800';
      }
    } else if (variant === 'outline') {
      if (color === 'bronze') {
        variantClasses = 'border-2 border-bronze text-bronze hover:bg-bronze hover:text-white';
      } else if (color === 'white') {
        variantClasses = 'border-2 border-white text-white hover:bg-white hover:text-carbon';
      } else {
        variantClasses = 'border-2 border-carbon text-carbon hover:bg-carbon hover:text-white';
      }
    } else { // text variant
      if (color === 'bronze') {
        variantClasses = 'text-bronze hover:text-bronze-dark';
      } else if (color === 'white') {
        variantClasses = 'text-white hover:text-neutral-200';
      } else {
        variantClasses = 'text-carbon hover:text-neutral-700';
      }
    }
    
    return `${sizeClasses[size]} ${variantClasses} relative inline-flex items-center transition-all duration-500 ease-luxury group overflow-hidden ${className}`;
  };
  
  // Button content wrapper with animation
  const buttonContent = (
    <motion.div
      className="flex items-center justify-center relative z-10 w-full"
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      
      {variant === 'filled' && (
        <motion.div 
          className="absolute inset-0 w-0 bg-opacity-20 bg-white z-0"
          initial={{ width: '0%', x: '-5%' }}
          whileHover={{ width: '110%', x: '0%' }}
          transition={{ duration: 0.5, ease: [0.6, 0.05, -0.01, 0.9] }}
        />
      )}
    </motion.div>
  );
  
  // Button base styles
  const buttonBaseClass = getBaseClasses();
  
  // Render the appropriate element type
  if (to) {
    return (
      <div ref={buttonRef}>
        <Link to={to} className={buttonBaseClass} onClick={onClick}>
          {buttonContent}
        </Link>
      </div>
    );
  } else if (href) {
    return (
      <div ref={buttonRef}>
        <a href={href} className={buttonBaseClass} target="_blank" rel="noopener noreferrer">
          {buttonContent}
        </a>
      </div>
    );
  } else {
    return (
      <div ref={buttonRef}>
        <button className={buttonBaseClass} onClick={onClick}>
          {buttonContent}
        </button>
      </div>
    );
  }
};

export default PremiumButton;