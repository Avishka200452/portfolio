/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#000000',
        bg: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        gued: ['Gued', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        brogetta: ['Gued', 'BROGETTA', 'sans-serif'],
        selcouth: ['Gued', 'Selcouth', 'sans-serif'],
        clash: ['Gued', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
