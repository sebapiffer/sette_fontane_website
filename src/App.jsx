import { Routes, Route } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

import ScrollToTop from './components/ScrollToTop.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import Navbar from './components/Navbar.jsx'
import PageTransition from './components/PageTransition.jsx'
import Home from './pages/Home.jsx'
import ScopriAzienda from './pages/ScopriAzienda.jsx'
// Alias: il nome ChiSiamo è già preso dalla sezione della Home
// (components/ChiSiamo.jsx), questa è la pagina dedicata.
import ChiSiamoPage from './pages/ChiSiamo.jsx'
import ScopriTerritorio from './pages/ScopriTerritorio.jsx'

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)

export default function App() {
  return (
    <>
      <SmoothScroll />
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
