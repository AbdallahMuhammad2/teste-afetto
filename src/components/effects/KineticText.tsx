import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface KineticTextProps {
  children: string;
  className?: string;
  delay?: number;
}

const KineticText: React.FC<KineticTextProps> = ({ 
  children, 
  className = '',
  delay = 0 
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!textRef.current) return;
    
    const split = new SplitText(textRef.current, { 
      type: 'chars,words',
      charsClass: 'char',
      wordsClass: 'word'
    });
    
    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.02,
      duration: 0.8,
      ease: 'power3.out',
      delay
    });
    
    return () => {
      split.revert();
    };
  }, [delay]);
  
  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
};

export default KineticText;