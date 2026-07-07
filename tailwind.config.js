/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        antracite: '#1D1D1B',
        moro: '#634E42',
        tortora: '#A48A7B',
        creta: '#F5F1EC',
        sabbia: '#C9B4A4',
        offwhite: '#FDFDFD',
      },
      fontFamily: {
        display: ['Marcellus', 'serif'],
        sans: ['Jost', 'sans-serif'],
        prose: ['Newsreader', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
