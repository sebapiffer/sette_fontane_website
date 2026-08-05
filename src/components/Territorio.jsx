import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Cta from './Cta.jsx'
import SfondoSezione from './SfondoSezione.jsx'
import SplitHeading from './SplitHeading.jsx'
import { territorio } from '../data/content.js'

export default function Territorio() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Il panorama si scopre da sinistra a destra, come uno sguardo che si apre sulla valle
        gsap.fromTo(
          '.territorio-img',
          { clipPath: 'inset(0 100% 0 0)', scale: 1.1 },
          {
            clipPath: 'inset(0 0% 0 0)',
            scale: 1.05,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: ref.current, start: 'top 85%' },
          }
        )
        // Il titolo (h2) è escluso qui: è uno SplitHeading, animato parola
        // per parola dal tween subito sotto invece che in blocco con gli
        // altri figli.
        gsap.from('.territorio-content > *:not(h2)', {
          autoAlpha: 0,
          y: 32,
          duration: 0.9,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: 'top 60%' },
        })
        gsap.from('.territorio-content .split-word', {
          yPercent: 110,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.03,
          scrollTrigger: { trigger: ref.current, start: 'top 60%' },
        })
      })
    },
    { scope: ref }
  )

  return (
    <section
      id={territorio.id}
      ref={ref}
      data-nav-theme="light"
      className="relative overflow-hidden bg-offwhite py-[clamp(5rem,12vw,9rem)]"
    >
      {/* Il panorama della valle è qui, a tutta sezione: è il soggetto più
          grande del sito dopo la hero. Il velo lo tiene sotto la soglia di
          rumore del testo — pieno a sinistra sulla colonna scritta, aperto a
          destra dove c'è solo la figura. */}
      <SfondoSezione src={territorio.background.src} opacita={0.55}>
        <div className="absolute inset-0 bg-gradient-to-b from-offwhite/95 via-offwhite/85 to-offwhite/80 md:bg-gradient-to-r md:from-offwhite md:via-offwhite/80 md:to-offwhite/25" />
      </SfondoSezione>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 md:grid-cols-2 md:gap-20">
        <div className="territorio-content">
          <p className="eyebrow text-moro">{territorio.eyebrow}</p>
          <SplitHeading
            as="h2"
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.08] text-antracite"
          >
            {territorio.title}
          </SplitHeading>
          <p className="mt-7 max-w-prose font-prose text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-antracite/70">
            {territorio.text}
          </p>
          <div className="mt-10">
            <Cta as={Link} to="/scopri-territorio" className="btn-dark">
              {territorio.cta}
            </Cta>
          </div>
        </div>
        {/* z-10: il viticcio decorativo passa dietro il panorama */}
        <figure className="relative z-10 mx-auto w-full max-w-md overflow-hidden md:max-w-none">
          <div className="aspect-[4/5] w-full">
            <img
              src={territorio.image.src}
              alt={territorio.image.alt}
              loading="lazy"
              decoding="async"
              width="1200"
              height="1500"
              className="territorio-img h-full w-full object-cover"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}
