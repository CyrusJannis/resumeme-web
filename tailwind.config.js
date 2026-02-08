/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f4ff',
          100: '#f0e5ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          900: '#4c0d95',
        },
        secondary: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      animation: {
        gradient: 'gradient 3s ease infinite',
        fadeIn: 'fadeIn 0.6s ease-in',
        slideUp: 'slideUp 0.6s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
