import Footer from '../components/Footer.jsx'
import SplitHeading from '../components/SplitHeading.jsx'
import useReveal from '../hooks/useReveal.js'
import { scopriTerritorioPage } from '../data/content.js'

// Pin in stile Google Maps, ridisegnato con i colori di brand: profilo e
// cerchio interno in antracite (#1D1D1B), corpo in tortora (#A48A7B). I colori
// sono scritti come classi Tailwind (fill-*/stroke-*) sui token, non in hex.
function PinMappa({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`drop-shadow-lg ${className}`}
    >
      <path
        d="M12 1.75c-4.28 0-7.75 3.47-7.75 7.75 0 5.4 6.86 11.7 7.15 11.97a.88.88 0 0 0 1.2 0c.29-.27 7.15-6.57 7.15-11.97 0-4.28-3.47-7.75-7.75-7.75Z"
        className="fill-tortora stroke-antracite"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.75" className="fill-antracite" />
    </svg>
  )
}

// Il box mappa non è un embed di Google (servirebbe una chiave API e un
// iframe di terze parti che romperebbe la coerenza cromatica): è una mappa
// stilizzata disegnata in SVG con i colori di brand — le curve di livello e il
// tracciato della valle — che fa da link alla ricerca su Google Maps.
function BoxMappa({ mappa }) {
  return (
    <a
      href={mappa.href}
      target="_blank"
      rel="noreferrer"
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-antracite/15 bg-creta shadow-2xl shadow-antracite/15 transition-shadow duration-500 hover:shadow-antracite/25"
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="h-full w-full text-tortora"
      >
        {/* Curve di livello: il fianco terrazzato della valle, per accenno. */}
        <g fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1">
          <path d="M-20 60 C 60 30, 140 80, 200 60 S 340 20, 420 70" />
          <path d="M-20 100 C 60 70, 140 120, 200 100 S 340 60, 420 110" />
          <path d="M-20 140 C 60 110, 140 160, 200 140 S 340 100, 420 150" />
          <path d="M-20 200 C 70 175, 150 225, 210 205 S 340 165, 420 215" />
          <path d="M-20 240 C 70 215, 150 265, 210 245 S 340 205, 420 255" />
        </g>
        {/* Il fondovalle dell'Avisio e la strada che sale ai masi. */}
        <path
          d="M-10 250 C 80 230, 130 190, 200 170 S 330 120, 410 90"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.75"
          strokeWidth="3"
        />
        <path
          d="M40 300 C 90 240, 160 220, 200 170"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="6 7"
        />
      </svg>

      {/* Il pin è sovrapposto in assoluto e ancorato con la punta al centro
          del box (translate -100% in Y = la punta, non il centro, sta sul
          punto). Un piccolo sollevamento all'hover, come su Maps. */}
      <PinMappa className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-full transition-transform duration-300 group-hover:-translate-y-[115%]" />
      <span className="absolute left-1/2 top-1/2 h-2 w-4 -translate-x-1/2 rounded-[50%] bg-antracite/25 blur-[2px]" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-offwhite via-offwhite/90 to-transparent p-5 pt-12">
        <div>
          <p className="font-display text-lg text-antracite">{mappa.label}</p>
          <p className="mt-1 font-prose text-sm text-antracite/60">{mappa.sublabel}</p>
        </div>
        <span className="eyebrow whitespace-nowrap text-moro underline-offset-4 group-hover:underline">
          {mappa.cta}
        </span>
      </div>
    </a>
  )
}

export default function ScopriTerritorio() {
  const introRef = useReveal()
  const mappaRef = useReveal()
  const newsRef = useReveal()
  const { mappa, news } = scopriTerritorioPage

  return (
    <>
      <main>
        {/* pt maggiorato: la navbar è fissa e qui non c'è una hero full-bleed
            a farle da sfondo — il contenuto deve iniziare sotto di lei. */}
        <section
          ref={introRef}
          data-nav-theme="light"
          className="bg-offwhite pb-[clamp(5rem,12vw,9rem)] pt-[clamp(8rem,15vw,11rem)]"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p data-reveal className="eyebrow text-moro">
                {scopriTerritorioPage.eyebrow}
              </p>
              <SplitHeading
                as="h1"
                data-reveal-words
                className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.08] text-antracite"
              >
                {scopriTerritorioPage.title}
              </SplitHeading>
            </div>

            {/* Immagine d'impatto ma non full-screen: max-w-5xl dentro il
                contenitore di pagina, scoperta dalla stessa tendina clip-path
                (useReveal) usata da ogni immagine del sito. */}
            <figure className="mx-auto mt-[clamp(3rem,7vw,5rem)] w-full max-w-5xl">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <img
                  data-reveal-img
                  src={scopriTerritorioPage.image.src}
                  alt={scopriTerritorioPage.image.alt}
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
                {scopriTerritorioPage.image.caption}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Testo a sinistra, mappa a destra. */}
        <section
          ref={mappaRef}
          data-nav-theme="light"
          className="bg-creta py-[clamp(5rem,12vw,9rem)]"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-16 lg:gap-24">
            <div>
              <div className="space-y-5">
                {scopriTerritorioPage.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    data-reveal
                    className="max-w-prose font-prose text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-antracite/75"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div data-reveal className="mx-auto w-full max-w-lg md:max-w-none">
              <BoxMappa mappa={mappa} />
            </div>
          </div>
        </section>

        {/* Altre news: immagine a sinistra, testo a destra. Su mobile il testo
            precede l'immagine (ordine del DOM = ordine di lettura). */}
        <section
          ref={newsRef}
          data-nav-theme="light"
          className="bg-offwhite py-[clamp(5rem,12vw,9rem)]"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-16 lg:gap-24">
            <div className="md:order-2">
              <p data-reveal className="eyebrow text-moro">
                {news.eyebrow}
              </p>
              <SplitHeading
                as="h2"
                data-reveal-words
                className="mt-5 max-w-prose font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.12] text-antracite"
              >
                {news.titolo}
              </SplitHeading>
              <div className="mt-6 space-y-5">
                {news.paragrafi.map((p, i) => (
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

            <figure className="mx-auto w-full max-w-md md:order-1 md:max-w-none">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <img
                  data-reveal-img
                  src={news.image.src}
                  alt={news.image.alt}
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
      </main>
      <Footer />
    </>
  )
}
