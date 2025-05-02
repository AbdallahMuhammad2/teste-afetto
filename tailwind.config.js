/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        porcelain: '#F8F7F5',
        carbon: '#1E1E1E',
        charcoal: '#3C3C3C',
        bronze: {
          DEFAULT: '#B58145',
          light: '#C9A06C',
          dark: '#8E6435',
        },
        copper: '#B17032',
      },
      accent: {
        DEFAULT: '#D4B798',
        light: '#E5D4C0',
        dark: '#B69678',
      },
      dark: {
        DEFAULT: '#171413',
        light: '#23201C',
        lighter: '#2D2925',
        dark: '#0C0A09',
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        card: '0 8px 24px -6px rgba(0,0,0,0.25)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      height: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
      },
      spacing: {
        '4vw': '4vw',
      },
      gridTemplateColumns: {
        masonry: 'repeat(auto-fit, minmax(300px, 1fr))',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('./src/lib/tailwind-accent-plugin'),
    function({ addBase }) {
      addBase({
        'h1, h2, h3': {
          '@apply font-serif tracking-tight text-white': {},
        },
        'p, li, a': {
          '@apply font-sans text-neutral-300 leading-relaxed': {},
        },
        '@keyframes accentUnderline': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        '.focus-visible:ring-elegant': {
          outline: '2px dashed var(--accent-copper)',
          outlineOffset: '2px',
        },
      });
    },
  ],
};