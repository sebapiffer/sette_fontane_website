import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

import ScrollToTop from './components/ScrollToTop.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import Cursore from './components/Cursore.jsx'
import Navbar from './components/Navbar.jsx'
import PageTransition from './components/PageTransition.jsx'
import Home from './pages/Home.jsx'
import ScopriAzienda from './pages/ScopriAzienda.jsx'
// Alias: il nome ChiSiamo è già preso dalla sezione della Home
// (components/ChiSiamo.jsx), questa è la pagina dedicata.
import ChiSiamoPage from './pages/ChiSiamo.jsx'
import ScopriTerritorio from './pages/ScopriTerritorio.jsx'
import { segnalaPronto } from './lib/ambiente.js'

gsap.registerPlugin(ScrollTrigger, Flip, SplitText, useGSAP)

export default function App() {
  // Il segnale `sf:ready` lo emette il Preloader, che però vive solo sulla
  // Home: atterrando direttamente su una sottopagina nessuno lo emetterebbe e
  // chi lo aspetta (SmoothScroll, il viticcio, l'apertura dei reveal)
  // resterebbe fermo per sempre. Qui la pagina si dichiara pronta da sé
  // appena i font sono arrivati — solo per l'atterraggio iniziale fuori dalla
  // Home: segnalaPronto è idempotente, i cambi rotta successivi non lo
  // riemettono.
  const rottaIniziale = useRef(useLocation().pathname)
  useEffect(() => {
    if (rottaIniziale.current === '/') return
    const font = document.fonts?.ready ?? Promise.resolve()
    font.then(segnalaPronto)
  }, [])

  return (
    <>
      <SmoothScroll />
      {/* Cursore custom: sostituisce la freccia di sistema su puntatore fine,
          si smarca da solo su touch e con movimento ridotto. */}
      <Cursore />
      {/* Montata qui, fuori dalle Routes, così resta la stessa intestazione
          fissa e reattiva al tema su Home e su ogni sottopagina, invece di
          smontarsi/rimontarsi (e perdere lo stato) ad ogni cambio rotta. */}
      <Navbar />
      <PageTransition />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scopri-azienda" element={<ScopriAzienda />} />
        <Route path="/chi-siamo" element={<ChiSiamoPage />} />
        <Route path="/scopri-territorio" element={<ScopriTerritorio />} />
      </Routes>
    </>
  )
}
