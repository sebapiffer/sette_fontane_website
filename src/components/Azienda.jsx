import useReveal from '../hooks/useReveal.js'
import Cta from './Cta.jsx'
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
          <h2
            data-reveal
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.08] text-antracite"
          >
            {azienda.title}
          </h2>
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
            <Cta href="#azienda" className="btn-dark">
              {azienda.cta}
            </Cta>
          </div>
        </div>
        <figure className="mx-auto w-full max-w-md overflow-hidden md:max-w-none">
          <img
            data-reveal-img
            src={azienda.image.src}
            alt={azienda.image.alt}
            loading="lazy"
            width="960"
            height="1200"
            className="aspect-[4/5] w-full object-cover"
          />
        </figure>
      </div>
    </section>
  )
}
