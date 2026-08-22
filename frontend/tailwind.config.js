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
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        energy: {
          amber: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#06b6d4',
          indigo: '#6366f1',
          emerald: '#10b981',
          violet: '#8b5cf6'
        }
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.25)'
      }
    },
  },
  plugins: [],
}
