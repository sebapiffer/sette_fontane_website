import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import DropsLogo, { CADUTA_GOCCE } from './DropsLogo.jsx'
import Wordmark from './Wordmark.jsx'
import { riduciMovimento, quandoCaricato } from '../lib/ambiente.js'
import { bloccaScroll, sbloccaScroll } from '../lib/bloccoScroll.js'
import { etaConfermata, confermaEta } from '../lib/consensi.js'
import { site, verificaEta } from '../data/content.js'

// Age gate: la soglia di casa. Copre il sito e la pagina non si muove finché
// non si risponde — si vende vino, e la verifica va PRIMA del contenuto, non
// accanto.
//
// Sta UN PIANO SOTTO al preloader (z-95 contro z-100), non sopra, e questo è il
// punto: l'overlay è opaco già dal primo fotogramma, quindi del sito non si
// vede mai niente, ma sopra ci sono le gocce che caricano. Quando il preloader
// ha finito, sfuma — e siccome i due condividono lo stesso fondo antracite non
// scopre la pagina, scopre questa schermata: si vede solo il logo che se ne va
// e la soglia che si compone al suo posto. Il contenuto qui sotto aspetta
// apposta `sf:caricato`, o si comporrebbe dietro le gocce mentre girano.
//
// Il fuoco resta dentro finché la domanda non ha risposta: niente ESC, niente
// click fuori, nessuna via di fuga con Tab. È l'unico modale del sito in cui
// questo è voluto — chiuderlo senza rispondere significherebbe entrare.
export default function VerificaEta() {
  const ref = useRef(null)
  const primo = useRef(null)
  // Lo stato iniziale si legge una volta sola: se la conferma c'è già, il
  // componente non monta nulla e nessuno se ne accorge.
  const [visibile, setVisibile] = useState(() => !etaConfermata())
  const [caricato, setCaricato] = useState(false)
  const [rifiutato, setRifiutato] = useState(false)

  // L'attesa del preloader. Sulle sottopagine, dove il preloader non c'è, il
  // segnale lo dà App al montaggio: la soglia compare subito, senza schermata
  // di caricamento da aspettare.
  useEffect(() => {
    if (!visibile) return
    return quandoCaricato(() => setCaricato(true))
  }, [visibile])

  // Pagina ferma per tutta la durata del gate, con la chiave 'eta': il
  // preloader tiene la sua, e chi finisce per primo non sblocca per l'altro.
  useEffect(() => {
    if (!visibile) return
    bloccaScroll('eta')
    return () => sbloccaScroll('eta')
  }, [visibile])

  // Il fuoco va sul primo pulsante — ma solo a entrata finita, ed è per questo
  // che non è un semplice effect al montaggio: durante l'animazione le righe
  // sono in autoAlpha 0, cioè `visibility: hidden`, e focus() su un elemento
  // invisibile non fa assolutamente nulla (il fuoco resta sul <body>). Da qui
  // le due chiamate a `entrata.current.progress(1)` più sotto: chi arriva da
  // tastiera salta l'animazione invece di aspettarla al buio.
  const entrata = useRef(null)
  const prendiFuoco = () => primo.current?.focus()

  // Trappola del fuoco. In cattura sul document e non sull'overlay: se il
  // fuoco è ancora fuori (sul <body>, appunto) un handler locale non vedrebbe
  // mai il Tab per riprenderselo. ESC non è gestito di proposito: rispondere è
  // l'unico modo di chiudere.
  useEffect(() => {
    if (!visibile) return
    const suTab = (e) => {
      if (e.key !== 'Tab' || !ref.current) return
      const fuochi = ref.current.querySelectorAll('button')
      if (!fuochi.length) return
      const inizio = fuochi[0]
      const fine = fuochi[fuochi.length - 1]
      const attivo = document.activeElement
      if (!ref.current.contains(attivo)) {
        e.preventDefault()
        entrata.current?.progress(1)
        inizio.focus()
      } else if (e.shiftKey && attivo === inizio) {
        e.preventDefault()
        fine.focus()
      } else if (!e.shiftKey && attivo === fine) {
        e.preventDefault()
        inizio.focus()
      }
    }
    document.addEventListener('keydown', suTab, true)
    return () => document.removeEventListener('keydown', suTab, true)
  }, [visibile])

  // Entrata: le gocce cadono con la stessa cadenza del preloader e della hero
  // (CADUTA_GOCCE), poi il resto sale. Un solo gesto per tutta l'apertura del
  // sito, dalla prima schermata in poi.
  useGSAP(
    () => {
      if (!caricato) return
      if (riduciMovimento()) return prendiFuoco()
      entrata.current = gsap
        .timeline({ defaults: { ease: 'power2.out' }, onComplete: prendiFuoco })
        .from('.drop', { ...CADUTA_GOCCE })
        // Le righe salgono MENTRE le gocce cadono, non dopo: in coda alla
        // caduta l'attesa complessiva (loop del preloader + dissolvenza + qui)
        // arrivava a 4,3 s prima che i pulsanti fossero utilizzabili — troppo,
        // per una domanda che è l'unica cosa da fare in quel momento. La
        // cadenza delle gocce resta CADUTA_GOCCE, quella condivisa: cambia solo
        // dove attacca il resto.
        .from('.eta-riga', { autoAlpha: 0, y: 22, duration: 0.7, stagger: 0.09 }, '-=1.2')
    },
    { dependencies: [caricato], scope: ref }
  )

  // Il cambio di schermata (domanda ⇄ cortesia) ha la sua entrata, breve:
  // senza, il testo comparirebbe di scatto al posto dell'altro. Si anima solo
  // il CAMBIO, non il montaggio — lì la timeline d'apertura qui sopra fa già
  // il lavoro e le due si scriverebbero addosso sugli stessi elementi. Il
  // confronto col valore precedente, invece di un flag "primo giro", regge
  // anche il doppio montaggio di StrictMode.
  const schermataPrecedente = useRef(rifiutato)
  useGSAP(
    () => {
      if (schermataPrecedente.current === rifiutato) return
      schermataPrecedente.current = rifiutato
      // Il fuoco segue la schermata: il pulsante che aveva è appena stato
      // smontato, e senza questo resterebbe orfano sul <body>.
      if (riduciMovimento()) return prendiFuoco()
      entrata.current = gsap.from('.eta-riga', {
        autoAlpha: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.09,
        ease: 'power2.out',
        onComplete: prendiFuoco,
      })
    },
    { dependencies: [rifiutato], scope: ref }
  )

  const entra = () => {
    // Prima la conferma — sblocca `attendiEta`, cioè fa annunciare `sf:ready` e
    // partire la sequenza della hero — poi la dissolvenza di questa schermata:
    // la hero apre mentre la soglia se ne va, non dopo.
    confermaEta()
    const chiudi = () => setVisibile(false)
    if (riduciMovimento() || !ref.current) return chiudi()
    gsap.to(ref.current, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut', onComplete: chiudi })
  }

  if (!visibile) return null

  // La centratura verticale è affidata a `my-auto` sul contenuto e non a
  // `justify-center` sul contenitore: su una finestra bassa (portatile con
  // molta chrome, telefono in orizzontale) il contenuto supera l'altezza
  // disponibile, e un flex centrato in quel caso ne taglia la CIMA senza
  // lasciarla raggiungere — il logo sparisce oltre il bordo e non c'è scroll
  // che lo riporti indietro. Coi margini automatici resta centrato quando c'è
  // spazio e scorre quando non ce n'è.
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="eta-titolo"
      aria-describedby="eta-testo"
      className="fixed inset-0 z-[95] flex flex-col items-center overflow-y-auto bg-antracite px-7 py-[clamp(1.5rem,6vh,3rem)] text-center text-offwhite"
    >
      {/* Vignettatura appena accennata: dà un centro alla schermata senza
          introdurre una fotografia che qui non servirebbe a nulla. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(164,138,123,0.10), transparent 62%)',
        }}
      />

      {/* Finché il preloader sta caricando qui c'è solo il fondo: il contenuto
          non viene montato affatto, così le gocce di questa schermata cadono
          quando la si vede davvero e non a sipario ancora chiuso. */}
      {caricato && (
      /* Il ritmo verticale è legato all'ALTEZZA della finestra, non fisso: su
         un telefono in orizzontale o su un portatile con molta chrome le
         spaziature fisse mandavano la colonna oltre lo schermo. Il wordmark ha
         anche un tetto in vh — è il pezzo più alto e da solo valeva un quarto
         della colonna su una finestra bassa. */
      <div className="relative my-auto flex w-full max-w-lg flex-col items-center">
        <DropsLogo aria-hidden="true" className="h-[clamp(3.25rem,10vh,7rem)] w-auto text-tortora" />
        <p className="eta-riga mt-[clamp(1rem,3.5vh,1.75rem)]">
          <span className="sr-only">{site.nameParts.join(' ')}</span>
          <Wordmark className="max-h-[14vh] w-[clamp(9rem,30vw,13rem)] text-offwhite" />
        </p>

        <span
          className="eta-riga mt-[clamp(1.25rem,4.5vh,2.25rem)] block h-px w-16 bg-tortora"
          aria-hidden="true"
        />

        {rifiutato ? (
          <>
            <h2
              id="eta-titolo"
              className="eta-riga mt-[clamp(1.25rem,4.5vh,2.25rem)] font-display text-[clamp(1.5rem,4vw,2.1rem)] uppercase tracking-[0.16em]"
            >
              {verificaEta.rifiuto.titolo}
            </h2>
            <p
              id="eta-testo"
              className="eta-riga mt-[clamp(0.75rem,2.5vh,1.25rem)] max-w-md font-prose text-base font-light leading-relaxed text-offwhite/65"
            >
              {verificaEta.rifiuto.testo}
            </p>
            <button
              ref={primo}
              type="button"
              onClick={() => setRifiutato(false)}
              className="eta-riga mt-[clamp(1.5rem,4.5vh,2.25rem)] font-sans text-[0.7rem] uppercase tracking-[0.25em] text-sabbia/70 underline underline-offset-8 transition-colors hover:text-sabbia"
            >
              {verificaEta.rifiuto.indietro}
            </button>
          </>
        ) : (
          <>
            <h2
              id="eta-titolo"
              className="eta-riga mt-[clamp(1.25rem,4.5vh,2.25rem)] font-display text-[clamp(1.7rem,5vw,2.6rem)] uppercase tracking-[0.16em]"
            >
              {verificaEta.titolo}
            </h2>
            <p
              id="eta-testo"
              className="eta-riga mt-[clamp(0.75rem,2vh,1rem)] font-prose text-lg font-light text-offwhite/70"
            >
              {verificaEta.domanda}
            </p>
            {/* I due pulsanti hanno lo stesso peso: la risposta è una scelta,
                non una porta con accanto un ripensamento in piccolo. */}
            <div className="eta-riga mt-[clamp(1.5rem,5vh,2.5rem)] flex flex-wrap items-center justify-center gap-4">
              <button
                ref={primo}
                type="button"
                onClick={entra}
                className="btn btn-light min-w-[9rem] justify-center"
              >
                {verificaEta.si}
              </button>
              <button
                type="button"
                onClick={() => setRifiutato(true)}
                className="btn btn-light min-w-[9rem] justify-center"
              >
                {verificaEta.no}
              </button>
            </div>
            <p className="eta-riga eyebrow mt-[clamp(1.5rem,4vh,2.5rem)] text-sabbia/50">
              {verificaEta.nota}
            </p>
          </>
        )}
      </div>
      )}
    </div>
  )
}
