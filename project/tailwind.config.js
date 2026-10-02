/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        base: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#b0b8c8',
          400: '#8492a8',
          500: '#647190',
          600: '#4d5970',
          700: '#3f485a',
          800: '#363d4d',
          900: '#0f1218',
          950: '#080a0e',
        },
        primary: {
          50: '#ecfdf8',
          100: '#d0f7ed',
          200: '#a6eedb',
          300: '#6dddc3',
          400: '#34c3a6',
          500: '#14a88c',
          600: '#0b8770',
          700: '#0c6b5a',
          800: '#0e5548',
          900: '#0d463d',
          950: '#042922',
        },
        accent: {
          50: '#fff8eb',
          100: '#feeac7',
          200: '#fdd28a',
          300: '#fcb74d',
          400: '#fb9b24',
          500: '#f57c0b',
          600: '#d95c06',
          700: '#b43f09',
          800: '#92310e',
          900: '#782910',
          950: '#451505',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-up': 'fade-up 0.4s ease-out',
        'slide-in-left': 'slide-in-left 0.25s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
