import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { riduciMovimento, quandoPronto } from '../lib/ambiente.js'
import { setLenis } from '../lib/lenis.js'

// Motore di scroll fluido, montato una sola volta per tutta la sessione
// (qui in App.jsx, non per pagina): rende butterose le animazioni
// scrub/pin già esistenti (Hero pinnata, tralcio del Viticcio, reveal di
// Territorio, ScrollTrigger di useReveal) senza toccarne il codice — Lenis
// intercetta la rotellina e guida lo stesso window.scrollTo che
// ScrollTrigger osserva già, restando sullo scroller nativo (nessuna
// scrollerProxy da configurare altrove).
export default function SmoothScroll() {
  useEffect(() => {
    if (riduciMovimento()) return

    let lenis = null
    let onTick = null

    // Parte solo a preloader concluso: prima non c'è nulla da rendere
    // fluido (la pagina è coperta) e si evita qualunque interferenza con
    // la sequenza di apertura della Hero, che aspetta lo stesso segnale.
    const annulla = quandoPronto(() => {
      lenis = new Lenis()
      setLenis(lenis)

      lenis.on('scroll', ScrollTrigger.update)
      onTick = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(onTick)
      // Lenis gestisce già il proprio ritmo: il lag-smoothing di GSAP
      // combatterebbe con lui invece di aiutarlo.
      gsap.ticker.lagSmoothing(0)
    })

    return () => {
      annulla()
      if (lenis) {
        gsap.ticker.remove(onTick)
        lenis.destroy()
        setLenis(null)
      }
    }
  }, [])

  return null
}
