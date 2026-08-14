import Footer from '../components/Footer.jsx'
import SfondoSezione from '../components/SfondoSezione.jsx'
import SplitHeading from '../components/SplitHeading.jsx'
import useReveal from '../hooks/useReveal.js'
import { scopriAziendaPage } from '../data/content.js'

// Fondi ammessi per un blocco: il colore della sezione e il velo intonato che
// va sopra la fotografia (stessa tinta, così la foto resta profondità e non
// diventa un secondo colore). Vedi `blocchi` in content.js.
const FONDI = {
  creta: { sezione: 'bg-creta', velo: 'bg-creta/75' },
  offwhite: { sezione: 'bg-offwhite', velo: 'bg-offwhite/75' },
}

// Ogni blocco è una sezione a sé — fondo e foto propri — e ha il proprio
// useReveal invece di condividerlo: useReveal aggancia lo ScrollTrigger al
// contenitore che riceve il ref, quindi con un solo ref per tutti i blocchi il
// secondo si animerebbe mentre è ancora sotto la piega, arrivando già rivelato.
function BloccoAlternato({ blocco, immagineASinistra }) {
  const ref = useReveal()
  const fondo = FONDI[blocco.fondo] ?? FONDI.creta

  return (
    <section
      ref={ref}
      data-nav-theme="light"
      className={`relative overflow-hidden py-[clamp(4rem,10vw,8rem)] ${fondo.sezione}`}
    >
      <SfondoSezione src={blocco.background.src} opacita={0.6}>
        <div className={`absolute inset-0 ${fondo.velo}`} />
      </SfondoSezione>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-7 sm:px-8 md:grid-cols-2 md:gap-16 lg:gap-24">
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
                className="max-w-prose font-prose text-[clamp(1rem,1.45vw,1.24rem)] leading-relaxed text-antracite/75"
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
              className="h-full w-full object-cover"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}

export default function ScopriAzienda() {
  const introRef = useReveal()

  return (
    <>
      <main>
        {/* pt maggiorato: la navbar è fissa (come in Home) e qui, a
            differenza della Hero, non c'è una sezione full-bleed sotto a
            farle da sfondo — il contenuto deve iniziare sotto di lei. */}
        <section
          ref={introRef}
          data-nav-theme="light"
          className="relative overflow-hidden bg-creta pb-[clamp(5rem,12vw,9rem)] pt-[clamp(8rem,15vw,11rem)]"
        >
          <SfondoSezione src={scopriAziendaPage.background.src} opacita={0.5}>
            <div className="absolute inset-0 bg-gradient-to-b from-creta via-creta/85 to-creta/70" />
          </SfondoSezione>
          <div className="relative mx-auto max-w-7xl px-7 sm:px-8">
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
              <div className="mt-7">
                <p
                  data-reveal
                  className="font-prose text-[clamp(1.05rem,1.55vw,1.32rem)] leading-relaxed text-antracite/75"
                >
                  {scopriAziendaPage.intro[0]}
                </p>
              </div>
            </div>

            {/* Foto di gruppo: larga ma non full-bleed (max-w-5xl dentro il
                contenitore di pagina), scoperta con la stessa tendina
                clip-path di useReveal usata da ogni immagine del sito.
                Sta dentro l'intro, subito dopo il primo paragrafo: il resto
                del testo riprende sotto la didascalia. */}
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
                className="mt-5 text-center font-prose text-sm leading-relaxed md:text-[0.95rem] text-antracite/60"
              >
                {scopriAziendaPage.gruppo.caption}
              </figcaption>
            </figure>

            <div className="mx-auto mt-[clamp(3rem,7vw,5rem)] max-w-3xl space-y-5 text-center">
              {scopriAziendaPage.intro.slice(1).map((p, i) => (
                <p
                  key={i}
                  data-reveal
                  className="font-prose text-[clamp(1.05rem,1.55vw,1.32rem)] leading-relaxed text-antracite/75"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Blocchi alternati: su mobile una colonna (immagine sempre sotto il
            testo, ordine del DOM = ordine di lettura); da md in poi due
            colonne e il blocco dispari inverte l'ordine visivo portando
            l'immagine a sinistra. Ognuno è una sezione con fondo e foto
            propri (vedi `blocchi` in content.js): niente più un'unica fascia
            creta per tutti, così la pagina scandisce i capitoli col colore
            come fa la home. */}
        {scopriAziendaPage.blocchi.map((blocco, i) => (
          <BloccoAlternato key={i} blocco={blocco} immagineASinistra={i % 2 === 1} />
        ))}
      </main>
      <Footer />
    </>
  )
}
