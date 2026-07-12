import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import DropsLogo, { CADUTA_GOCCE } from './DropsLogo.jsx'
import { riduciMovimento, segnalaPronto } from '../lib/ambiente.js'

// Schermata di caricamento: le sette gocce cadono in formazione come
// nell'apertura della hero, ma in loop, finché pagina e font non sono pronti.
// Alla fine sfuma, si smonta e annuncia `sf:ready`: la hero aspetta questo
// segnale per far partire la sua sequenza di apertura (altrimenti suonerebbe
// a sipario ancora chiuso).

// Pronto quando il documento è caricato e i font sono disponibili, con un
// tempo minimo perché il loop si legga e un tetto massimo di sicurezza.
const MIN_MOSTRA_MS = 1600
const MAX_ATTESA_MS = 6000

function attendiCaricamento() {
  const caricato =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((res) => window.addEventListener('load', res, { once: true }))
  const font = document.fonts?.ready ?? Promise.resolve()
  const minimo = new Promise((res) => setTimeout(res, MIN_MOSTRA_MS))
  const massimo = new Promise((res) => setTimeout(res, MAX_ATTESA_MS))
  return Promise.race([Promise.all([caricato, font, minimo]), massimo])
}

function annunciaPronto() {
  segnalaPronto()
  // I font appena arrivati possono aver cambiato le altezze: le posizioni
  // degli ScrollTrigger (viticcio compreso) vanno rimisurate.
  ScrollTrigger.refresh()
}

export default function Preloader() {
  const ref = useRef(null)
  const loop = useRef(null)
  const [visibile, setVisibile] = useState(true)

  // Stessa cadenza dell'apertura hero (caduta con stagger), poi le gocce
  // scivolano via e la sequenza riparte.
  useGSAP(
    () => {
      if (riduciMovimento()) return
      loop.current = gsap
        .timeline({ repeat: -1, repeatDelay: 0.35, defaults: { ease: 'power2.out' } })
        .from('.drop', { ...CADUTA_GOCCE })
        .to('.drop', { y: 34, autoAlpha: 0, duration: 0.5, stagger: 0.07, ease: 'power2.in' }, '+=0.55')
    },
    { scope: ref }
  )

  // L'attesa vive in un effect annullabile: sotto StrictMode il primo
  // montaggio viene scartato, ma la sua promise risolverebbe comunque —
  // senza il flag partirebbero due dissolvenze e due sf:ready (con relativo
  // doppio ScrollTrigger.refresh).
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    let annullato = false
    attendiCaricamento().then(() => {
      if (annullato || !ref.current) return
      gsap.to(ref.current, {
        autoAlpha: 0,
        duration: riduciMovimento() ? 0 : 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          loop.current?.kill()
          document.body.style.overflow = ''
          setVisibile(false)
          annunciaPronto()
        },
      })
    })
    return () => {
      annullato = true
    }
  }, [])

  if (!visibile) return null

  return (
    <div
      ref={ref}
      role="status"
      aria-label="Caricamento di Sette Fontane"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-antracite"
    >
      <DropsLogo aria-hidden="true" className="h-[clamp(6rem,14vh,9rem)] w-auto text-tortora" />
    </div>
  )
}
