/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#0F2A23',
          800: '#173F35', // Primary forest green
          700: '#235345',
          600: '#2F6B4F', // Secondary agricultural green
          500: '#3D8562',
          400: '#5BA37E',
          300: '#82A96B', // Fresh leaf green
          200: '#B6D1A7',
          100: '#E1EED9',
          50: '#F2F7EF',
        },
        agri: {
          green: '#2F6B4F',
          leaf: '#82A96B',
          cream: '#F7F6F0',
          charcoal: '#202923',
          muted: '#6B756D',
          amber: '#D99A35',
          red: '#C94C4C',
          border: '#E5E9E2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

