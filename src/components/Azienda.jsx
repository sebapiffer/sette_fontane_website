import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import Cta from './Cta.jsx'
import SfondoSezione from './SfondoSezione.jsx'
import SplitHeading from './SplitHeading.jsx'
import { azienda } from '../data/content.js'
import DivisoreOnda from './DivisoreOnda.jsx'

export default function Azienda() {
  const ref = useReveal()

  return (
    <section
      id={azienda.id}
      ref={ref}
      data-nav-theme="light"
      className="relative overflow-hidden bg-creta pb-[clamp(5rem,12vw,9rem)] pt-[clamp(2.5rem,5vw,4rem)]"
    >
      <SfondoSezione src={azienda.background.src} srcSet={azienda.background.srcSet} opacita={0.5}>
        {/* Il testo sta a sinistra: il velo è pieno lì e si alleggerisce verso
            la foto. In colonna singola le due metà si sovrappongono, quindi il
            gradiente scende invece di attraversare. */}
        <div className="absolute inset-0 bg-gradient-to-b from-creta/95 via-creta/85 to-creta/75 md:bg-gradient-to-r md:from-creta md:via-creta/85 md:to-creta/35" />
      </SfondoSezione>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 md:grid-cols-2 md:gap-20">
        <div>
          <p data-reveal className="eyebrow text-moro">
            {azienda.eyebrow}
          </p>
          <SplitHeading
            as="h2"
            data-reveal-words
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.08] text-antracite"
          >
            {azienda.title}
          </SplitHeading>
          <div className="mt-7 space-y-5">
            {azienda.paragraphs.map((p, i) => (
              <p
                key={i}
                data-reveal
                className="max-w-prose font-prose text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-antracite/75"
              >
                {p}
              </p>
            ))}
          </div>
          <div data-reveal className="mt-10">
            <Cta as={Link} to="/scopri-azienda" className="btn-dark">
              {azienda.cta}
            </Cta>
          </div>
        </div>
        {/* z-10: il viticcio decorativo passa dietro la foto */}
        <figure className="relative z-10 mx-auto w-full max-w-md overflow-hidden md:max-w-none">
          <div className="aspect-[4/5] w-full">
            {/* `sizes` ricalca il layout vero, non 100vw: da `md` la figura è
                una delle due colonne di un `max-w-7xl` con gap 5rem e padding
                2rem, cioè ~568 px fissi; sotto, è larghezza piena meno il
                padding ma tappata a `max-w-md` (28rem). Senza questo il
                browser assume 100vw e scarica sempre la variante da 960. */}
            <img
              data-reveal-img
              src={azienda.image.src}
              srcSet={azienda.image.srcSet}
              sizes="(min-width: 768px) 568px, min(100vw - 2.5rem, 28rem)"
              alt={azienda.image.alt}
              loading="lazy"
              decoding="async"
              width="960"
              height="1200"
              className="h-full w-full object-cover"
            />
          </div>
        </figure>
      </div>
      <DivisoreOnda colore="antracite" posizione="sotto" />
    </section>
  )
}
