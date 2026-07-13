import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import Cta from './Cta.jsx'
import SplitHeading from './SplitHeading.jsx'
import { azienda } from '../data/content.js'

export default function Azienda() {
  const ref = useReveal()

  return (
    <section
      id={azienda.id}
      ref={ref}
      data-nav-theme="light"
      className="bg-creta py-[clamp(5rem,12vw,9rem)]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 md:grid-cols-2 md:gap-20">
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
          <div data-parallax className="aspect-[4/5] w-full">
            <img
              data-reveal-img
              src={azienda.image.src}
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
    </section>
  )
}
