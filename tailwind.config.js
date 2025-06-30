/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <-- enable class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#6366f1',  // indigo-500
          dark: '#818cf8',   // indigo-400 (for dark mode)
        }
      }
    },
  },
  plugins: [],
}