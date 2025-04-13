/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0e7490', // Teal 700 - more medical
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0e7490',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e'
        },
        secondary: {
          DEFAULT: '#3b82f6', // Blue 500
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        }
      },
      boxShadow: {
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner-xl': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'elevation-1': '0 2px 4px -1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.1)',
        'elevation-2': '0 4px 6px -2px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.1)',
        'elevation-3': '0 10px 15px -3px rgba(0,0,0,0.08), 0 20px 25px -5px rgba(0,0,0,0.12)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
}