import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base`: il sito è pubblicato come project page di GitHub Pages, quindi vive
// nella sottocartella /sette_fontane_website/ (nome del repo). Vite antepone
// questo prefisso a tutti gli asset che processa (HTML, CSS, JS); i percorsi
// assoluti nelle stringhe dati (content.js) sono prefissati a mano con
// import.meta.env.BASE_URL. In dev BASE_URL resta '/'.
export default defineConfig({
  base: '/sette_fontane_website/',
  plugins: [react()],
})
