/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#E58E26',
          'orange-dark': '#C77519',
          'orange-light': '#FEF3E7',
          wine: '#8E3B46',
          'wine-dark': '#722E37',
          'wine-light': '#FDF2F3',
          green: '#688B35',
          'green-dark': '#526E2A',
          'green-light': '#F2F7EB',
          charcoal: '#37322F',
          taupe: '#605751',
          cream: '#FBF9F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

