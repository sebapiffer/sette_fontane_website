import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { vaiAllaSezione, vaiInCima } from '../lib/scorri.js'

// La sezione è raggiungibile solo quando il Preloader della Home ha finito:
// finché è a schermo tiene body overflow:hidden e ogni tentativo di scroll
// fallisce in silenzio. Non basta ascoltare `sf:ready`: quel segnale è
// idempotente e alla seconda visita della Home risulta già emesso, mentre il
// Preloader si rimonta e ri-blocca comunque lo scroll. E non si può nemmeno
// dare una scadenza fissa (il Preloader può restare fino a MAX_ATTESA_MS +
// dissolvenza): si aspetta la CONDIZIONE, cioè lo scroll di nuovo libero.
function pronto(hash) {
  return document.body.style.overflow !== 'hidden' && document.querySelector(hash)
}

// Ad ogni cambio rotta la pagina deve ripartire dall'inizio, senza ereditare
// lo scroll lasciato dalla pagina precedente; se la rotta porta un'ancora
// (una voce del menu cliccata da una sottopagina, es. "/#territorio") la
// pagina parte comunque dalla hero e POI ci scende in scroll animato.
// useLayoutEffect (non useEffect) applica lo scroll PRIMA che il browser
// dipinga il frame: fatto dopo il paint si vede lo scatto e, soprattutto,
// ScrollTrigger calcolerebbe le posizioni iniziali delle sezioni con lo
// scrollY ancora vecchio.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    // In ogni caso si atterra in cima: senza ancora è la destinazione finale,
    // con l'ancora è il punto di partenza della discesa. Immediato — è un
    // cambio pagina, non deve vedersi.
    vaiInCima({ immediato: true })

    if (!hash) {
      // Se il click parte mentre la pagina precedente sta ancora scorrendo per
      // inerzia (rotellina/trackpad con momentum, o uno smooth-scroll nativo
      // ancora in volo), quel movimento continua sul thread di compositing e
      // può sovrascrivere il reset di un frame fa. Riaffermo lo 0,0 sul frame
      // successivo per vincere quell'inerzia residua.
      const raf = requestAnimationFrame(() => vaiInCima({ immediato: true }))
      return () => cancelAnimationFrame(raf)
    }

    let annullato = false
    const timers = []
    const attendi = (fn, ms) => timers.push(setTimeout(fn, ms))

    const scendi = () => {
      if (annullato) return
      // Si parte solo ora, a preloader sparito e sipario alzato: la discesa
      // dalla hero alla sezione è il movimento che l'utente deve VEDERE, non
      // qualcosa da consumare dietro una schermata di caricamento.
      //
      // Il ritardo non è cosmetico: sparendo, il Preloader lancia un
      // ScrollTrigger.refresh(), e la Hero è pinnata — il refresh rimisura gli
      // spaziatori del pin e sposta le sezioni. Lenis calcola la destinazione
      // UNA VOLTA, all'avvio del tween: partire prima del refresh significa
      // animare verso una coordinata che un istante dopo non è più quella
      // giusta, e atterrare fuori bersaglio. Si lascia assestare il layout,
      // poi si misura e si parte.
      attendi(() => !annullato && vaiAllaSezione(hash), 260)
    }

    const riprova = () => {
      if (annullato) return
      if (pronto(hash)) scendi()
      else attendi(riprova, 16)
    }

    // Il primo controllo è posticipato di un tick: il Preloader (se sta per
    // montarsi con la Home) applica il proprio overflow:hidden in un effect
    // normale, che gira DOPO questo effect layout — controllando subito lo
    // troveremmo ancora sbloccato e partiremmo a vuoto.
    attendi(riprova, 16)
    return () => {
      annullato = true
      timers.forEach(clearTimeout)
    }
  }, [pathname, hash])

  return null
}
