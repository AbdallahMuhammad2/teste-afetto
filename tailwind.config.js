/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        serif: ['Playfair Display Variable', 'serif'],
      },
      colors: {
        porcelain: '#F8F7F5',
        carbon: '#1B1A19',
        bronze: {
          DEFAULT: '#B58145',
          light: '#C9A06C',
          dark: '#8E6435',
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(.6,.05,-0.01,.9)',
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
        'masonry': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};