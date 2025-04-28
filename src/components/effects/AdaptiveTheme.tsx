import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const getColorFromImage = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('#9B7E56'); // Fallback color
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let r = 0, g = 0, b = 0;
      
      // Sample pixels
      for (let i = 0; i < imageData.length; i += 40) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }
      
      const pixels = imageData.length / 4;
      const avgR = r / pixels;
      const avgG = g / pixels;
      const avgB = b / pixels;
      
      resolve(`rgb(${avgR}, ${avgG}, ${avgB})`);
    };
    
    img.onerror = () => {
      resolve('#9B7E56'); // Fallback color
    };
    
    img.src = imageUrl;
  });
};

const AdaptiveTheme: React.FC = () => {
  const [accentColor, setAccentColor] = useState('#9B7E56');
  const location = useLocation();
  
  useEffect(() => {
    // Update theme based on time of day
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    document.documentElement.classList.toggle('dark', !isDaytime);
    
    // Find the first image in the current view
    const firstImage = document.querySelector('img');
    if (firstImage && firstImage.src) {
      getColorFromImage(firstImage.src).then(color => {
        setAccentColor(color);
        document.documentElement.style.setProperty('--color-accent', color);
      });
    }
  }, [location.pathname]);
  
  return null;
};

export default AdaptiveTheme;