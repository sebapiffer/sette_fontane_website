import Footer from '../components/Footer.jsx'
import SfondoSezione from '../components/SfondoSezione.jsx'
import SplitHeading from '../components/SplitHeading.jsx'
import useReveal from '../hooks/useReveal.js'
import { chiSiamoPage } from '../data/content.js'

// Un useReveal per ritratto, non uno per l'intera sezione: l'hook aggancia lo
// ScrollTrigger al contenitore che riceve il ref, quindi con un ref condiviso
// il secondo ritratto si animerebbe mentre è ancora sotto la piega e
// arriverebbe a schermo già rivelato.
function Ritratto({ persona, immagineASinistra }) {
  const ref = useReveal()

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24"
    >
      <div className={immagineASinistra ? 'md:order-2' : undefined}>
        <p data-reveal className="eyebrow text-tortora">
          {persona.ruolo}
        </p>
        <SplitHeading
          as="h2"
          data-reveal-words
          className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-antracite"
        >
          {persona.nome}
        </SplitHeading>
        <div className="mt-6 space-y-5">
          {persona.paragrafi.map((p, i) => (
            <p
              key={i}
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
        {/* Ritaglio pulito, senza bordo/ombra/arrotondamento: stesso stile
            fotografico delle sezioni della home (foto rettangolari a taglio
            netto, la sola tendina di useReveal come trattamento). */}
        <div className="aspect-[4/5] w-full overflow-hidden">
          <img
            data-reveal-img
            src={persona.image.src}
            alt={persona.image.alt}
            loading="lazy"
            decoding="async"
            width="1200"
            height="1500"
            className="h-full w-full object-cover"
          />
        </div>
      </figure>
    </div>
  )
}

export default function ChiSiamo() {
  const headerRef = useReveal()
  const radiciRef = useReveal()
  const { radici } = chiSiamoPage

  return (
    <>
      <main>
        {/* pt maggiorato: la navbar è fissa e qui non c'è una hero full-bleed
            a farle da sfondo — il contenuto deve iniziare sotto di lei. */}
        <section
          ref={headerRef}
          data-nav-theme="dark"
          className="relative overflow-hidden bg-antracite pb-[clamp(4rem,9vw,7rem)] pt-[clamp(8rem,15vw,11rem)]"
        >
          <SfondoSezione src={chiSiamoPage.background.src} opacita={0.5}>
            <div className="absolute inset-0 bg-gradient-to-b from-antracite via-antracite/75 to-antracite" />
          </SfondoSezione>
          <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
            <p data-reveal className="eyebrow text-sabbia">
              {chiSiamoPage.eyebrow}
            </p>
            <SplitHeading
              as="h1"
              data-reveal-words
              className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.08] text-offwhite"
            >
              {chiSiamoPage.title}
            </SplitHeading>
            <p
              data-reveal
              className="mx-auto mt-7 max-w-prose font-prose text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-offwhite/75"
            >
              {chiSiamoPage.intro}
            </p>
          </div>
        </section>

        {/* Ritratti alternati: su mobile una colonna (ordine del DOM = ordine
            di lettura, testo e poi immagine); da md in poi due colonne, e il
            secondo ritratto specchia il primo portando l'immagine a sinistra. */}
        <section data-nav-theme="light" className="bg-creta py-[clamp(5rem,12vw,9rem)]">
          <div className="mx-auto max-w-7xl space-y-[clamp(4rem,10vw,8rem)] px-5 sm:px-8">
            {chiSiamoPage.persone.map((persona, i) => (
              <Ritratto key={persona.nome} persona={persona} immagineASinistra={i % 2 === 1} />
            ))}
          </div>
        </section>

        {/* "Le nostre radici": fondo moro invece della creta dei ritratti, per
            isolare il blocco e dargli un tono più intimo — e per accompagnare
            il passaggio al Footer scuro. */}
        <section
          ref={radiciRef}
          data-nav-theme="dark"
          className="relative overflow-hidden bg-moro py-[clamp(5rem,12vw,9rem)]"
        >
          <SfondoSezione src={chiSiamoPage.radiciBackground.src} opacita={0.5}>
            <div className="absolute inset-0 bg-gradient-to-b from-moro/90 via-moro/80 to-moro/90 md:bg-gradient-to-r md:from-moro/45 md:via-moro/75 md:to-moro" />
          </SfondoSezione>
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-5 sm:px-8 md:grid-cols-2 md:gap-20">
            {/* Foto d'archivio in cornice polaroid: bordo bianco, leggera
                inclinazione, bianco e nero via grayscale. */}
            <figure className="mx-auto w-full max-w-sm -rotate-2 bg-offwhite p-3 pb-5 shadow-2xl shadow-antracite/40">
              <div className="aspect-[5/6] w-full overflow-hidden">
                <img
                  data-reveal-img
                  src={radici.foto.src}
                  alt={radici.foto.alt}
                  loading="lazy"
                  decoding="async"
                  width="1000"
                  height="1200"
                  className="h-full w-full object-cover grayscale"
                />
              </div>
              <figcaption
                data-reveal
                className="mt-4 text-center font-prose text-sm text-antracite/60"
              >
                {radici.foto.caption}
              </figcaption>
            </figure>

            <div>
              <p data-reveal className="eyebrow text-sabbia">
                {radici.eyebrow}
              </p>
              <blockquote
                data-reveal
                className="mt-6 font-quote text-[clamp(1.5rem,2.8vw,2.2rem)] italic leading-[1.35] text-offwhite"
              >
                <p>«{radici.citazione}»</p>
              </blockquote>
              <div className="mt-8 space-y-5">
                {radici.paragrafi.map((p, i) => (
                  <p
                    key={i}
                    data-reveal
                    className="max-w-prose font-prose text-[clamp(1rem,1.3vw,1.12rem)] leading-relaxed text-offwhite/75"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
