/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900
          light: '#334155',   // Slate 700
          50: '#f8fafc',
        },
        secondary: {
          DEFAULT: '#10b981', // Emerald 500
          dark: '#059669',    // Emerald 600
          light: '#d1fae5',   // Emerald 100
        },
        accent: {
          DEFAULT: '#f59e0b', // Amber 500
          hover: '#d97706',   // Amber 600
          pop: '#f43f5e',     // Rose 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};
