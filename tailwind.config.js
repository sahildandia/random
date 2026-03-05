/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': '#1a237e', // Deep Royal Blue
        'electric-purple': '#7c4dff', // Electric Purple
        'dark-bg': '#0f172a',    // Dark background
        'card-bg': '#1e293b',    // Card background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'], // For headers
      }
    },
  },
  plugins: [],
}
