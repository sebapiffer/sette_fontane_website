import { Fragment, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { riduciMovimento } from '../lib/ambiente.js'
import useReveal from '../hooks/useReveal.js'
import DropsLogo from './DropsLogo.jsx'
import SplitHeading from './SplitHeading.jsx'
import { comingSoon } from '../data/content.js'

const GOCCE = 7

export default function ComingSoon() {
  const ref = useReveal()
  // Easter egg: ogni click sul logo riempie una goccia, dall'alto in basso.
  // Alla settima — sette fontane — compare la frase nascosta.
  const [clic, setClic] = useState(0)
  const completo = clic === GOCCE
  const frase = useRef(null)

  // La goccia passa dal 50% di tortora al pieno e ci resta: il logo si riempie
  // un click alla volta, e chi insiste vede il conto salire. Si fa toccando il
  // DOM e non con una prop di DropsLogo: il logo è uno solo in tutto il sito e
  // non deve avere varianti.
  const riempi = () => {
    if (clic >= GOCCE) return
    document.querySelectorAll('#coming-soon .drop')[clic]?.classList.add('fill-tortora')
    setClic(clic + 1)
  }

  // Comparsa della frase: il filo tortora si apre dal centro, poi le parole
  // salgono dalle loro maschere una dopo l'altra — lo stesso gesto dei titoli,
  // perché la frase si legga come una scritta del sito e non come un tooltip.
  useGSAP(
    () => {
      if (!completo || riduciMovimento()) return
      gsap
        .timeline({ delay: 0.25 })
        .from('.segreto-filo', { scaleX: 0, duration: 0.7, ease: 'power3.inOut' })
        .from(
          '.segreto-parola',
          { yPercent: 110, rotate: 4, duration: 0.8, stagger: 0.07, ease: 'power3.out' },
          '-=0.3',
        )
    },
    { dependencies: [completo], scope: frase },
  )

  return (
    <section
      id="coming-soon"
      ref={ref}
      data-nav-theme="light"
      className="bg-creta py-[clamp(5rem,12vw,8rem)] text-center"
    >
      {/* `relative` per la frase segreta, che sta in assoluto sotto il testo:
          comparendo non deve allungare la sezione, o il Viticcio — che finisce
          proprio su queste gocce — si rigenererebbe e sposterebbe. */}
      <div className="relative mx-auto max-w-2xl px-7 sm:px-8">
        {/* Il click va sull'svg stesso e non su un contenitore: il Viticcio
            si ancora a `#coming-soon svg`, e un wrapper cambierebbe il box.
            Niente cursore da link: un easter egg non si annuncia. */}
        <DropsLogo
          data-reveal
          onClick={riempi}
          className="mx-auto h-14 w-auto select-none text-tortora/50 [&_.drop]:duration-300 motion-safe:[&_.drop]:transition-[fill]"
        />
        <p data-reveal className="eyebrow mt-8 text-moro">
          {comingSoon.eyebrow}
        </p>
        <SplitHeading
          as="h2"
          data-reveal-words
          className="mt-4 font-display text-[clamp(1.7rem,3.5vw,2.6rem)] leading-tight text-antracite"
        >
          {comingSoon.title}
        </SplitHeading>
        <p data-reveal className="mt-4 font-prose text-lg text-antracite/60 md:text-[1.24rem]">
          {comingSoon.text}
        </p>
        <div
          ref={frase}
          aria-live="polite"
          className="absolute inset-x-0 top-full mt-6 px-7"
        >
          {completo && (
            <>
              <span
                aria-hidden="true"
                className="segreto-filo mx-auto mb-4 block h-px w-16 bg-tortora"
              />
              <p className="font-display text-base leading-snug text-moro md:text-xl">
                <span className="sr-only">{comingSoon.segreto}</span>
                {/* Stessa maschera di SplitHeading: il padding dà aria agli
                    accenti, il margine negativo lo restituisce al layout. */}
                <span aria-hidden="true">
                  {comingSoon.segreto.split(' ').map((parola, i) => (
                    <Fragment key={i}>
                      {i > 0 && ' '}
                      <span className="-my-[0.16em] inline-block overflow-hidden py-[0.16em] align-bottom">
                        <span className="segreto-parola inline-block">{parola}</span>
                      </span>
                    </Fragment>
                  ))}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
