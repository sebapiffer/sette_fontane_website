import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useReveal from '../hooks/useReveal.js'
import DropsLogo, { CADUTA_GOCCE } from './DropsLogo.jsx'
import SplitHeading from './SplitHeading.jsx'
import { vini } from '../data/content.js'

// Frontespizio del capitolo dei vini: una fascia a tutta larghezza, lunga e
// bassa, in antracite — è l'APERTURA del capitolo scuro, non una striscia a
// sé: taglia netto contro l'offwhite del territorio sopra, mentre sotto il
// fondo prosegue in San Florian, quindi la fine della fascia la segna il filo
// tortora di .vini-chiusura, non il colore. Niente foto, niente velo, niente
// colonne: solo il titolo, steso in orizzontale da un tracking largo e da due
// fili che corrono fino ai bordi dello schermo.
//
// Il logo a gocce sta DENTRO il titolo, tra "La nostra" e "cantina": è l'unico
// elemento verticale della fascia e ne fissa l'altezza. Le gocce cadono in
// formazione con la stessa cadenza di preloader e hero (CADUTA_GOCCE).
//
// Sotto md il corpo, il tracking e il gap si stringono: a 360px il titolo per
// intero non ci sta, e a farne le spese sarebbero i fili — che si azzererebbero
// portandosi dietro il canale del Viticcio (vedi sotto). Misurato, non a occhio.
export default function IntroVini() {
  const ref = useReveal()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trigger = { trigger: ref.current, start: 'top 80%' }
        // I fili si allungano verso i bordi dalle estremità del titolo:
        // origin opposte, così il gesto si apre dal centro.
        gsap.from('.vini-filo', {
          scaleX: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: trigger,
        })
        // Il filo di chiusura parte dal centro come i due laterali, ma dopo:
        // prima si apre il titolo, poi si chiude la fascia.
        gsap.from('.vini-chiusura', {
          scaleX: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.35,
          scrollTrigger: trigger,
        })
        gsap.from('.vini-logo .drop', {
          ...CADUTA_GOCCE,
          ease: 'power2.out',
          delay: 0.25,
          scrollTrigger: trigger,
        })
      })
    },
    { scope: ref }
  )

  return (
    <section
      id={vini.id}
      ref={ref}
      data-nav-theme="dark"
      className="relative overflow-hidden bg-antracite py-[clamp(2.5rem,4.5vw,3.5rem)]"
    >
      {/* Il titolo vero per gli screen reader: a schermo è spezzato in due
          tronconi attorno al logo, che da solo non si legge. */}
      <h2 className="sr-only">{vini.title}</h2>

      <div
        aria-hidden="true"
        className="relative mx-auto flex max-w-[100rem] items-center gap-[clamp(0.75rem,2.5vw,2.25rem)] px-5 sm:px-8"
      >
        {/* Le due metà sono `flex-1 basis-0`: larghezza identica comunque siano
            lunghi i due tronconi ("LA NOSTRA" è più largo di "CANTINA"), quindi
            il logo resta esattamente al centro dello schermo. Il testo si
            appoggia al logo e il filo prende quel che avanza fino al bordo —
            così il rect di .vini-filo continua a essere il canale libero
            accanto al titolo, che è quello a cui si aggancia il Viticcio. */}
        <div className="flex min-w-0 flex-1 basis-0 items-center gap-[clamp(0.75rem,2.5vw,2.25rem)]">
          <span className="vini-filo h-px flex-1 origin-right bg-tortora/60" />
          {/* -mr: il tracking lascia uno spazio anche DOPO l'ultima lettera,
              che sbilancerebbe la distanza dal logo. */}
          <SplitHeading
            as="p"
            data-reveal-words
            className="-mr-[0.16em] md:-mr-[0.28em] whitespace-nowrap font-display font-bold text-[clamp(1rem,3.8vw,2.9rem)] uppercase leading-none tracking-[0.16em] md:tracking-[0.28em] text-offwhite"
          >
            {vini.titleParts[0]}
          </SplitHeading>
        </div>

        <DropsLogo className="vini-logo h-[clamp(2.75rem,6.5vw,4.75rem)] w-auto shrink-0 text-tortora" />

        <div className="flex min-w-0 flex-1 basis-0 items-center gap-[clamp(0.75rem,2.5vw,2.25rem)]">
          <SplitHeading
            as="p"
            data-reveal-words
            className="-mr-[0.16em] md:-mr-[0.28em] whitespace-nowrap font-display font-bold text-[clamp(1rem,3.8vw,2.9rem)] uppercase leading-none tracking-[0.16em] md:tracking-[0.28em] text-offwhite"
          >
            {vini.titleParts[1]}
          </SplitHeading>
          <span className="vini-filo h-px flex-1 origin-left bg-tortora/60" />
        </div>
      </div>

      {/* La cesura in basso. Il fondo antracite prosegue in San Florian, quindi
          il colore da solo non stacca più: a segnare la fine della fascia è
          questo filo, in tortora come la riga sotto il titolo dell'hero. NON
          può avere la classe .vini-filo: il Viticcio aggancia i suoi nodi di
          attraversamento a quegli elementi per indice. */}
      <span
        aria-hidden="true"
        className="vini-chiusura absolute inset-x-0 bottom-0 h-px bg-tortora/60"
      />
    </section>
  )
}
