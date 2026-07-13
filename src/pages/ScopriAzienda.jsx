import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Footer from '../components/Footer.jsx'
import SplitHeading from '../components/SplitHeading.jsx'
import useReveal from '../hooks/useReveal.js'
import { scopriAziendaPage } from '../data/content.js'

// Ogni blocco ha il proprio useReveal invece di condividere quello della
// sezione: useReveal aggancia lo ScrollTrigger al contenitore che riceve il
// ref, quindi con un solo ref per l'intera sezione il secondo blocco si
// animerebbe mentre è ancora sotto la piega, arrivando già rivelato.
function BloccoAlternato({ blocco, immagineASinistra }) {
  const ref = useReveal()

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24"
    >
      <div className={immagineASinistra ? 'md:order-2' : undefined}>
        <p data-reveal className="eyebrow text-moro">
          {blocco.eyebrow}
        </p>
        <SplitHeading
          as="h2"
          data-reveal-words
          className="mt-5 max-w-prose font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.12] text-antracite"
        >
          {blocco.titolo}
        </SplitHeading>
        <div className="mt-6 space-y-5">
          {blocco.testo.map((p, j) => (
            <p
              key={j}
              data-reveal
              className="max-w-prose font-prose text-[clamp(1rem,1.3vw,1.12rem)] leading-relaxed text-antracite/75"
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <figure
        className={`mx-auto w-full max-w-md md:max-w-none ${immagineASinistra ? 'md:order-1' : ''}`}
      >
        <div className="aspect-[4/5] w-full overflow-hidden">
          <img
            data-reveal-img
            src={blocco.image.src}
            alt={blocco.image.alt}
            loading="lazy"
            decoding="async"
            width="1200"
            height="1500"
            className="h-full w-full rounded-t-full object-cover"
          />
        </div>
      </figure>
    </div>
  )
}

export default function ScopriAzienda() {
  const introRef = useReveal()
  const timelineRef = useReveal()

  // La linea della timeline si disegna mentre si scrolla, stessa tecnica
  // (stroke-dashoffset scrubbato) del Viticcio, qui su una semplice linea
  // dritta: pathLength la normalizza a 100 unità logiche, così non serve
  // misurarne la lunghezza reale in JS al variare del numero di tappe.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // start/end sulla stessa soglia (85%): la distanza di scroll fra i
        // due punti è sempre esattamente l'altezza della lista, quindi il
        // disegno completa SEMPRE entro la fine della lista, qualunque sia
        // il numero di tappe.
        gsap.to('.timeline-line', {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-list',
            start: 'top 85%',
            end: 'bottom 85%',
            scrub: true,
          },
        })
      })
    },
    { scope: timelineRef }
  )

  return (
    <>
      <main>
        {/* pt maggiorato: la navbar è fissa (come in Home) e qui, a
            differenza della Hero, non c'è una sezione full-bleed sotto a
            farle da sfondo — il contenuto deve iniziare sotto di lei. */}
        <section
          ref={introRef}
          data-nav-theme="light"
          className="bg-creta pb-[clamp(5rem,12vw,9rem)] pt-[clamp(8rem,15vw,11rem)]"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p data-reveal className="eyebrow text-moro">
                {scopriAziendaPage.eyebrow}
              </p>
              <SplitHeading
                as="h1"
                data-reveal-words
                className="mt-5 font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.08] text-antracite"
              >
                {scopriAziendaPage.title}
              </SplitHeading>
              <div className="mt-7 space-y-5">
                {scopriAziendaPage.intro.map((p, i) => (
                  <p
                    key={i}
                    data-reveal
                    className="font-prose text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-antracite/75"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Foto di gruppo: larga ma non full-bleed (max-w-5xl dentro il
                contenitore di pagina), scoperta con la stessa tendina
                clip-path di useReveal usata da ogni immagine del sito. */}
            <figure className="mx-auto mt-[clamp(3rem,7vw,5rem)] w-full max-w-5xl">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img
                  data-reveal-img
                  src={scopriAziendaPage.gruppo.src}
                  alt={scopriAziendaPage.gruppo.alt}
                  loading="lazy"
                  decoding="async"
                  width="1800"
                  height="1100"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption
                data-reveal
                className="mt-5 text-center font-prose text-sm leading-relaxed text-antracite/60"
              >
                {scopriAziendaPage.gruppo.caption}
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          ref={timelineRef}
          data-nav-theme="light"
          className="bg-offwhite py-[clamp(5rem,12vw,9rem)]"
        >
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <p data-reveal className="eyebrow text-center text-moro">
              {scopriAziendaPage.timelineEyebrow}
            </p>
            <h2
              data-reveal
              className="mt-5 text-center font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.08] text-antracite"
            >
              {scopriAziendaPage.timelineTitle}
            </h2>

            <div className="relative mt-16">
              {/* La linea non è più un border statico: è disegnata da GSAP
                  (stroke-dashoffset) man mano che si scrolla la lista sotto.
                  pathLength=100 normalizza la lunghezza logica del tratto,
                  indipendente dall'altezza reale (cambia con le tappe). */}
              <svg
                className="pointer-events-none absolute left-0 top-0 h-full w-px overflow-visible"
                aria-hidden="true"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  className="timeline-line stroke-tortora/30"
                />
              </svg>
              <ol className="timeline-list relative space-y-14 pl-8 sm:pl-10">
                {scopriAziendaPage.timeline.map((tappa, i) => (
                  <li key={i} data-reveal className="relative">
                    <span className="absolute -left-[calc(2rem+5px)] top-1 h-[9px] w-[9px] rounded-full bg-tortora sm:-left-[calc(2.5rem+5px)]" />
                    <p className="eyebrow text-tortora">{tappa.anno}</p>
                    <h3 className="mt-2 font-display text-xl text-antracite">{tappa.titolo}</h3>
                    <p className="mt-3 max-w-prose font-prose leading-relaxed text-antracite/70">
                      {tappa.testo}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Blocchi alternati: su mobile una colonna (immagine sempre sotto il
            testo, ordine del DOM = ordine di lettura); da md in poi due
            colonne e il blocco dispari inverte l'ordine visivo portando
            l'immagine a sinistra. */}
        <section data-nav-theme="light" className="bg-creta py-[clamp(5rem,12vw,9rem)]">
          <div className="mx-auto max-w-7xl space-y-[clamp(4rem,10vw,8rem)] px-5 sm:px-8">
            {scopriAziendaPage.blocchi.map((blocco, i) => (
              <BloccoAlternato key={i} blocco={blocco} immagineASinistra={i % 2 === 1} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
