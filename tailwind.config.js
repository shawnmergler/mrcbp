/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Gotham', '-apple-system', 'SF Pro Text', 'system-ui', 'Inter', 'Arial', 'sans-serif'] },
    },
  },
  plugins: [],
};
