import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Azienda from './components/Azienda.jsx'
import ChiSiamo from './components/ChiSiamo.jsx'
import Territorio from './components/Territorio.jsx'
import SanFlorian from './components/SanFlorian.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import Footer from './components/Footer.jsx'

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Azienda />
        <ChiSiamo />
        <Territorio />
        <SanFlorian />
        <ComingSoon />
      </main>
      <Footer />
    </>
  )
}
