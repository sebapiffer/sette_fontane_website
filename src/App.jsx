import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

import Preloader from './components/Preloader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Azienda from './components/Azienda.jsx'
import ChiSiamo from './components/ChiSiamo.jsx'
import Territorio from './components/Territorio.jsx'
import SanFlorian from './components/SanFlorian.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import Viticcio from './components/Viticcio.jsx'
import Footer from './components/Footer.jsx'

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)

export default function App() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        {/* Il contenitore relativo fa da tela al viticcio, che cresce
            in scrub lungo tutte le sezioni dopo la hero. */}
        <div className="relative">
          <Azienda />
          <ChiSiamo />
          <Territorio />
          <SanFlorian />
          <ComingSoon />
          <Viticcio />
        </div>
      </main>
      <Footer />
    </>
  )
}
