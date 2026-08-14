import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import DropsLogo, { CADUTA_GOCCE } from './DropsLogo.jsx'
import { riduciMovimento, segnalaCaricato, segnalaPronto } from '../lib/ambiente.js'
import { bloccaScroll, sbloccaScroll } from '../lib/bloccoScroll.js'
import { attendiEta } from '../lib/consensi.js'

// Schermata di caricamento: le sette gocce cadono in formazione come
// nell'apertura della hero, ma in loop, finché pagina e font non sono pronti.
// È la PRIMA cosa che si vede, prima anche dell'age gate: quello sta un piano
// sotto (z-95 contro z-100) sullo stesso fondo antracite, e questa dissolvenza
// non scopre il sito ma lui — le gocce se ne vanno e resta la soglia.
//
// Da qui escono i due segnali dell'apertura, ed è importante che siano due:
// `sf:caricato` a dissolvenza finita (il gate entra in scena) e `sf:ready` solo
// dopo che si è risposto alla domanda (la hero apre). Annunciarli insieme
// farebbe partire la sequenza della hero dietro l'overlay ancora chiuso, e chi
// entra la troverebbe già finita.

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
    // Il blocco passa dal registro condiviso: l'age gate tiene la propria
    // chiave sulla stessa pagina, e scrivendo body.overflow a mano il primo
    // dei due a finire sbloccherebbe anche per l'altro.
    bloccaScroll('preloader')
    let annullato = false
    attendiCaricamento().then(() => {
      if (annullato || !ref.current) return
      gsap.to(ref.current, {
        autoAlpha: 0,
        duration: riduciMovimento() ? 0 : 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          loop.current?.kill()
          sbloccaScroll('preloader')
          setVisibile(false)
          // Caricamento finito: sotto c'è l'age gate, che ora entra in scena.
          // La pagina resta comunque ferma — la chiave 'eta' è ancora presa.
          segnalaCaricato()
          // Il sipario vero si alza solo quando si è entrati. `annunciaPronto`
          // non tocca questo componente, quindi può arrivare a smontaggio
          // avvenuto: qui non si aspetta nessuno.
          attendiEta().then(annunciaPronto)
        },
      })
    })
    return () => {
      annullato = true
      // Smontaggio prima della fine (cambio rotta a sipario ancora alzato):
      // senza questo la chiave resterebbe presa e la pagina bloccata per sempre.
      sbloccaScroll('preloader')
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
