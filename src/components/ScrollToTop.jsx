import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getLenis } from '../lib/lenis.js'

// Oltre a passare behavior 'instant', sovrascrivo per un istante anche la
// proprietà CSS in linea (massima specificità, vince sempre sullo smooth di
// index.css): alcuni motori applicano scroll-behavior anche all'assegnazione
// diretta di scrollTop, non solo a scrollTo(), quindi il solo `behavior`
// nelle options non basta ovunque a garantire un salto davvero istantaneo.
function salgoAllInizioNativo() {
  const root = document.documentElement
  const precedente = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  root.style.scrollBehavior = precedente
}

function salgoAllInizio() {
  const lenis = getLenis()
  if (lenis) {
    // Con Lenis attivo un window.scrollTo diretto verrebbe corretto (cioè
    // annullato) al frame successivo dal suo stesso ciclo raf, che insegue
    // la propria posizione virtuale precedente: va spostato lui, non il
    // browser, e in modo immediato (niente animazione, è un cambio pagina).
    lenis.scrollTo(0, { immediate: true })
    return
  }
  salgoAllInizioNativo()
}

// Ad ogni cambio rotta la pagina deve ripartire dall'inizio, senza ereditare
// lo scroll lasciato dalla pagina precedente. useLayoutEffect (non useEffect)
// applica lo scroll PRIMA che il browser dipinga il frame: fatto dopo il
// paint si vede lo scatto e, soprattutto, ScrollTrigger calcolerebbe le
// posizioni iniziali delle sezioni con lo scrollY ancora vecchio.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    // behavior 'instant' esplicito: html ha scroll-behavior: smooth (index.css),
    // che si applica anche a window.scrollTo() quando behavior è 'auto' (il
    // default implicito) — senza forzarlo qui il reset si vedrebbe come uno
    // scroll animato dalla vecchia posizione (spesso in fondo, se la pagina di
    // destinazione è più corta) fino a 0, invece di un salto istantaneo.
    salgoAllInizio()

    // Se il click parte mentre la pagina precedente sta ancora scorrendo per
    // inerzia (rotellina/trackpad con momentum, o uno smooth-scroll nativo
    // ancora in volo), quel movimento continua sul thread di compositing e
    // può sovrascrivere il reset di un frame fa — sul nuovo documento, più
    // corto, il risultato è un atterraggio agganciato in fondo. Riaffermo lo
    // 0,0 sul frame successivo per vincere quell'inerzia residua.
    const raf = requestAnimationFrame(salgoAllInizio)
    return () => cancelAnimationFrame(raf)
  }, [pathname])
  return null
}
