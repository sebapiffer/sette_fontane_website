import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { riduciMovimento } from '../lib/ambiente.js'

// Sipario per il cambio pagina: React smonta la vecchia rotta e monta la
// nuova nello stesso commit sincrono in cui gira questo useLayoutEffect —
// PRIMA che il browser dipinga. Coprendo lo schermo qui, a piena opacità e
// senza transizione, quello scambio (e il salto di scroll di ScrollToTop,
// stesso commit) non viene mai dipinto: il sipario poi si dissolve
// rivelando la pagina già pronta e già scrollata sotto di sé.
export default function PageTransition() {
  const ref = useRef(null)
  const { pathname } = useLocation()
  const primoRender = useRef(true)

  useLayoutEffect(() => {
    if (primoRender.current) {
      primoRender.current = false
      return
    }
    if (!ref.current || riduciMovimento()) return
    gsap.set(ref.current, { autoAlpha: 1 })
    gsap.to(ref.current, {
      autoAlpha: 0,
      duration: 0.55,
      delay: 0.05,
      ease: 'power2.out',
    })
  }, [pathname])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] bg-antracite opacity-0"
    />
  )
}
