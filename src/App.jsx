import { Routes, Route } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

import ScrollToTop from './components/ScrollToTop.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import Home from './pages/Home.jsx'
import ScopriAzienda from './pages/ScopriAzienda.jsx'
import Conoscici from './pages/Conoscici.jsx'
import ScopriTerritorio from './pages/ScopriTerritorio.jsx'

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)

export default function App() {
  return (
    <>
      <SmoothScroll />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scopri-azienda" element={<ScopriAzienda />} />
        <Route path="/conoscici" element={<Conoscici />} />
        <Route path="/scopri-territorio" element={<ScopriTerritorio />} />
      </Routes>
    </>
  )
}
