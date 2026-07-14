import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import Cta from './Cta.jsx'
import SfondoSezione from './SfondoSezione.jsx'
import SplitHeading from './SplitHeading.jsx'
import { chiSiamo } from '../data/content.js'

export default function ChiSiamo() {
  const ref = useReveal()

  return (
    <section
      id={chiSiamo.id}
      ref={ref}
      data-nav-theme="dark"
      className="relative overflow-hidden bg-antracite py-[clamp(5rem,12vw,9rem)]"
    >
      <SfondoSezione src={chiSiamo.background.src} opacita={0.3}>
        {/* Testo centrato su fondo scuro: velo pieno ai bordi (dove entrano e
            escono le sezioni adiacenti) e appena più aperto al centro, dove
            cadono i due ritratti. Il testo resta su un fondo praticamente
            antracite pieno. */}
        <div className="absolute inset-0 bg-gradient-to-b from-antracite via-antracite/75 to-antracite" />
        <div className="absolute inset-0 bg-antracite/45" />
      </SfondoSezione>

      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
        <p data-reveal className="eyebrow text-sabbia">
          {chiSiamo.eyebrow}
        </p>
        <SplitHeading
          as="h2"
          data-reveal-words
          className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.08] text-offwhite"
        >
          {chiSiamo.title}
        </SplitHeading>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
          {chiSiamo.people.map((person) => (
            <figure key={person.name} className="mx-auto w-full max-w-sm overflow-hidden">
              <div className="aspect-[3/4] w-full">
                <img
                  data-reveal-img
                  src={person.image.src}
                  alt={person.image.alt}
                  loading="lazy"
                  decoding="async"
                  width="720"
                  height="960"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption data-reveal className="mt-6">
                <h3 className="font-display text-2xl text-offwhite">{person.name}</h3>
                <p className="eyebrow mt-2 text-tortora">{person.role}</p>
                <p className="mt-4 font-prose text-[1.05rem] leading-relaxed text-offwhite/70">
                  {person.bio}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* z-10: il viticcio decorativo passa dietro il pulsante */}
        <div data-reveal className="relative z-10 mt-14">
          <Cta as={Link} to="/chi-siamo" className="btn-light">
            {chiSiamo.cta}
          </Cta>
        </div>
      </div>
    </section>
  )
}
