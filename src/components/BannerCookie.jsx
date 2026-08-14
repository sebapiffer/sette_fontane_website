import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { riduciMovimento, quandoPronto } from '../lib/ambiente.js'
import { CHIAVE_COOKIE, letto, segna } from '../lib/consensi.js'
import { cookie } from '../data/content.js'

// Informativa cookie: una presa d'atto, non una scelta. Il sito non installa
// cookie di nessun tipo — niente analytics, niente pixel, niente embed di terzi
// (la mappa è un'immagine servita in locale, il video sta in public/) — quindi
// non c'è nulla da acconsentire e nulla da rifiutare: un toggle "rifiuta i
// cookie" che non spegne niente sarebbe teatro. Un solo pulsante, e la nota su
// cosa resta davvero sul dispositivo (vedi `consensi.js`).
//
// In basso e stretto, non un velo sulla pagina: si può leggere il sito con il
// banner ancora aperto — è coerente col fatto che non ci sia niente da bloccare
// in attesa di un consenso.
const RITARDO_ENTRATA = 0.9

export default function BannerCookie() {
  const ref = useRef(null)
  const [visibile, setVisibile] = useState(false)

  // Aspetta `sf:ready`: prima c'è ancora il sipario (preloader sulla Home) e,
  // alla prima visita, l'age gate che lo tiene alzato — il banner comparirebbe
  // sotto un overlay opaco, cioè non comparirebbe affatto. Dopo il segnale
  // l'ordine è naturale: si entra, parte la hero, il banner sale dal fondo.
  useEffect(() => {
    if (letto(CHIAVE_COOKIE)) return
    return quandoPronto(() => setVisibile(true))
  }, [])

  useGSAP(
    () => {
      if (!visibile || riduciMovimento()) return
      gsap.from(ref.current, {
        autoAlpha: 0,
        y: 28,
        duration: 0.7,
        delay: RITARDO_ENTRATA,
        ease: 'power2.out',
      })
    },
    { dependencies: [visibile] }
  )

  const chiudi = () => {
    segna(CHIAVE_COOKIE)
    const via = () => setVisibile(false)
    if (riduciMovimento() || !ref.current) return via()
    gsap.to(ref.current, { autoAlpha: 0, y: 18, duration: 0.45, ease: 'power2.in', onComplete: via })
  }

  if (!visibile) return null

  return (
    <aside
      ref={ref}
      role="region"
      aria-label={cookie.etichetta}
      // z-[55]: sopra la navbar (z-50) e il suo menu, sotto lo zoom della
      // bottiglia San Florian (z-[60]) e il sipario dei cambi pagina (z-[90]),
      // che devono restare pieni.
      className="fixed inset-x-4 bottom-4 z-[55] max-w-sm rounded-2xl border border-sabbia/20 bg-antracite/95 p-5 text-left shadow-2xl shadow-antracite/40 backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:left-6"
    >
      <p className="font-prose text-sm font-light leading-relaxed text-offwhite/75">
        {cookie.testo}
      </p>
      <p className="mt-2 font-prose text-xs font-light leading-relaxed text-offwhite/45">
        {cookie.nota}
      </p>
      <button
        type="button"
        onClick={chiudi}
        className="btn btn-light mt-4 justify-center px-6 py-2.5 text-[0.65rem]"
      >
        {cookie.bottone}
      </button>
    </aside>
  )
}
