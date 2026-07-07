import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import DropsLogo from './DropsLogo.jsx'
import { site, hero } from '../data/content.js'

export default function Hero() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Sequenza di apertura: le sette gocce cadono in formazione,
        // poi il nome del maso emerge.
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
        tl.from('.drop', {
          y: -70,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.11,
        })
          .from('.hero-word', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.15 }, '-=0.3')
          .from('.hero-rule', { scaleX: 0, duration: 0.7 }, '-=0.4')
          .from('.hero-sub', { autoAlpha: 0, duration: 0.8 }, '-=0.3')

        // Allo scroll la hero sfuma verso il fondo chiaro della sezione successiva.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=85%',
              pin: true,
              scrub: true,
            },
          })
          .to('.hero-content', { autoAlpha: 0, y: -70, ease: 'none', duration: 0.5 }, 0)
          // passa per il tortora del brand per non attraversare grigi spenti
          .to(sectionRef.current, { backgroundColor: '#A48A7B', ease: 'none', duration: 0.55 }, 0.15)
          .to(sectionRef.current, { backgroundColor: '#F5F1EC', ease: 'none', duration: 0.3 }, 0.7)
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="top"
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-antracite"
    >
      <div className="hero-content flex flex-col items-center px-6 text-center">
        <DropsLogo
          title="Logo Sette Fontane: sette gocce d'acqua"
          className="h-[clamp(7rem,16vh,10.5rem)] w-auto text-tortora"
        />
        <h1 className="mt-8 font-sans leading-none text-offwhite">
          <span className="hero-word block text-[clamp(1.15rem,3.4vw,2rem)] font-light uppercase tracking-[0.6em] text-sabbia">
            {site.nameParts[0]}
          </span>
          <span className="hero-word mt-2 block text-[clamp(2.1rem,6.5vw,4.2rem)] font-semibold uppercase tracking-[0.22em]">
            {site.nameParts[1]}
          </span>
        </h1>
        <span className="hero-rule mt-8 block h-px w-16 bg-tortora" aria-hidden="true" />
        <p className="hero-sub eyebrow mt-6 text-tortora">
          {hero.eyebrow}
          <span className="mt-2 block font-light normal-case tracking-[0.25em] text-offwhite/60">
            {hero.location}
          </span>
        </p>
      </div>

      <a
        href="#azienda"
        className="hero-content absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-offwhite/50 transition-colors hover:text-offwhite"
      >
        <span className="text-[0.62rem] uppercase tracking-[0.4em]">{hero.scrollHint}</span>
        <span className="block h-10 w-px animate-pulse bg-current" aria-hidden="true" />
      </a>
    </section>
  )
}
