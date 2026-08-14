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
      // Larghezza del contenitore di pagina: `max-w-7xl` è il contenitore
      // condiviso da tutte le sezioni e dalla navbar, quindi ritoccarlo qui
      // stringe il margine laterale ovunque in un colpo solo, senza sfasare
      // l'allineamento fra navbar e contenuto. 80rem → 84rem: a 1440 px il
      // margine passa da 80 a 48 px per lato (più il padding di sezione), e
      // sotto i 1344 px non cambia nulla — è un ritocco solo desktop.
      maxWidth: {
        '7xl': '84rem',
      },
      fontFamily: {
        display: ["'Mason Sans'", 'sans-serif'],
        sans: ["'LT Wave'", 'sans-serif'],
        prose: ["'LT Wave'", 'sans-serif'],
        // Nessuno dei due font di brand è un serif e nessuno ha un corsivo
        // reale: per la citazione del nonno (pagina Chi siamo) serve un serif
        // in italic, quindi uno stack di sistema — niente webfont da caricare,
        // niente Google Fonts, coerente col resto delle scelte tipografiche.
        quote: ['Georgia', "'Times New Roman'", 'serif'],
      },
    },
  },
  plugins: [],
}
