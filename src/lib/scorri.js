import { getLenis } from './lenis.js'
import { riduciMovimento } from './ambiente.js'

// Movimenti di scroll "d'autore" (le voci del menu), in un punto solo: li
// usano sia la Navbar (click a pagina già aperta) sia ScrollToTop (arrivo su
// una sezione dopo un cambio rotta), che devono muoversi allo stesso modo.
//
// Con Lenis attivo si guida lui, mai window.scrollTo: il suo ciclo raf
// insegue una propria posizione virtuale e al frame successivo annullerebbe
// qualunque scroll fatto alle sue spalle. Senza Lenis (prefers-reduced-motion:
// SmoothScroll non lo monta nemmeno) si ricade sulle API native.

// Abbastanza lento da leggersi come un viaggio attraverso la pagina — è il
// punto della richiesta: dalla hero si deve *vedere* scendere fino alla
// sezione — senza diventare un'attesa.
const DURATA = 1.6

export function vaiAllaSezione(hash, { immediato = false } = {}) {
  const target = document.querySelector(hash)
  if (!target) return false

  const secco = immediato || riduciMovimento()
  const lenis = getLenis()

  if (lenis) lenis.scrollTo(target, secco ? { immediate: true } : { duration: DURATA })
  else target.scrollIntoView({ behavior: secco ? 'auto' : 'smooth', block: 'start' })

  return true
}

export function vaiInCima({ immediato = false } = {}) {
  const secco = immediato || riduciMovimento()
  const lenis = getLenis()

  if (lenis) {
    lenis.scrollTo(0, secco ? { immediate: true } : { duration: DURATA })
    return
  }
  // scroll-behavior: smooth è dichiarato su html (index.css) e si applica
  // anche a scrollTo() quando behavior è il default: per un salto davvero
  // istantaneo va forzato 'instant', non lasciato 'auto'.
  const root = document.documentElement
  const precedente = root.style.scrollBehavior
  if (secco) root.style.scrollBehavior = 'auto'
  window.scrollTo({ top: 0, left: 0, behavior: secco ? 'instant' : 'smooth' })
  root.style.scrollBehavior = precedente
}
