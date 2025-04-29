const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities, theme, e }) {
  // Create utilities for the accent color
  const accentUtilities = {
    '.bg-accent': {
      backgroundColor: 'var(--color-accent)',
    },
    '.text-accent': {
      color: 'var(--color-accent)',
    },
    '.border-accent': {
      borderColor: 'var(--color-accent)',
    },
    '.outline-accent': {
      outline: '2px solid var(--color-accent)',
      outlineOffset: '2px',
    },
    '.ring-accent': {
      '--tw-ring-color': 'var(--color-accent)',
    },
    '.shadow-accent': {
      '--tw-shadow-color': 'var(--color-accent)',
      boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
    },
    '.divide-accent': {
      '--tw-divide-opacity': '1',
      borderColor: 'var(--color-accent)',
    },
  };
  
  // Create opacity variants for accent background
  const opacityValues = {
    '5': '0.05',
    '10': '0.1',
    '20': '0.2',
    '25': '0.25',
    '30': '0.3',
    '40': '0.4',
    '50': '0.5',
    '60': '0.6',
    '70': '0.7',
    '75': '0.75',
    '80': '0.8',
    '90': '0.9',
    '95': '0.95',
  };
  
  Object.entries(opacityValues).forEach(([key, value]) => {
    accentUtilities[`.bg-accent-${key}`] = {
      backgroundColor: `rgba(var(--color-accent-rgb), ${value})`,
    };
    accentUtilities[`.text-accent-${key}`] = {
      color: `rgba(var(--color-accent-rgb), ${value})`,
    };
    accentUtilities[`.border-accent-${key}`] = {
      borderColor: `rgba(var(--color-accent-rgb), ${value})`,
    };
  });
  
  // Keyframes for accent animations
  const accentKeyframes = {
    '@keyframes accentPulse': {
      '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
      '50%': { opacity: 1, transform: 'scale(1.1)' },
    },
    '@keyframes accentShimmer': {
      '0%': { backgroundPosition: '-100% 0' },
      '100%': { backgroundPosition: '200% 0' },
    },
    '@keyframes accentFadeIn': {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  };
  
  // Animation utilities
  const animationUtilities = {
    '.animate-accent-pulse': {
      animation: 'accentPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    '.animate-accent-shimmer': {
      backgroundImage: 'linear-gradient(90deg, transparent, rgba(var(--color-accent-rgb), 0.2), transparent)',
      backgroundSize: '200% 100%',
      animation: 'accentShimmer 2s infinite',
    },
    '.animate-accent-fade-in': {
      animation: 'accentFadeIn 0.8s ease-out forwards',
    },
  };
  
  addUtilities(accentUtilities);
  addUtilities(accentKeyframes);
  addUtilities(animationUtilities);
});