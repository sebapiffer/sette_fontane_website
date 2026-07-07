import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'
import { X } from 'lucide-react'
import useReveal from '../hooks/useReveal.js'
import Cta from './Cta.jsx'
import { sanFlorian } from '../data/content.js'

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function SanFlorian() {
  const sectionRef = useReveal()
  const bottleRef = useRef(null)
  const overlayRef = useRef(null)
  const flipState = useRef(null)
  const bobTween = useRef(null)
  const glowTween = useRef(null)
  const [zoomed, setZoomed] = useState(false)
  const [format, setFormat] = useState(sanFlorian.formats[0])

  // Cattura lo stato della bottiglia prima del cambio layout, poi lascia che
  // l'effetto esegua il Flip flicker-free. Il fluttuare va messo in pausa e
  // il suo transform inline azzerato *prima* di leggere lo stato, altrimenti
  // Flip riparte da una posizione sfalsata e la bottiglia non torna centrata.
  const toggleZoom = (next) => {
    if (next) {
      bobTween.current?.pause()
      glowTween.current?.pause()
      gsap.set(bottleRef.current, { clearProps: 'transform' })
    }
    flipState.current = Flip.getState(bottleRef.current)
    if (next) document.body.style.overflow = 'hidden'
    setZoomed(next)
  }

  useGSAP(
    () => {
      if (!flipState.current) return
      const state = flipState.current
      flipState.current = null
      const dur = reduceMotion() ? 0 : 1

      Flip.from(state, {
        duration: dur,
        ease: 'power3.inOut',
        onComplete: () => {
          if (!zoomed) {
            document.body.style.overflow = ''
            gsap.set(bottleRef.current, { clearProps: 'transform' })
            bobTween.current?.play()
            glowTween.current?.play()
          }
        },
      })

      if (zoomed) {
        gsap.to(overlayRef.current, { autoAlpha: 1, duration: dur * 0.6 })
        gsap.fromTo(
          '.sf-detail',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: dur * 0.7, stagger: dur * 0.06, delay: dur * 0.45 }
        )
      } else {
        gsap.to(overlayRef.current, { autoAlpha: 0, duration: dur * 0.45 })
      }
    },
    { dependencies: [zoomed] }
  )

  // Crossfade al cambio formato (Renana / Magnum)
  useGSAP(
    () => {
      gsap.from(bottleRef.current, {
        autoAlpha: 0,
        scale: 0.94,
        duration: reduceMotion() ? 0 : 0.6,
        ease: 'power2.out',
      })
    },
    { dependencies: [format] }
  )

  // La bottiglia respira con un fluttuare lentissimo, e l'alone pulsa piano.
  // Creati una sola volta; toggleZoom li mette in pausa esplicitamente prima
  // del Flip e li fa ripartire solo a transizione di chiusura completata.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        bobTween.current = gsap.to(bottleRef.current, {
          y: '+=14',
          duration: 2.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
        glowTween.current = gsap.to('.sf-glow', {
          scale: 1.12,
          opacity: 0.85,
          duration: 3.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    },
    { scope: sectionRef }
  )

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && zoomed && toggleZoom(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomed])

  return (
    <section
      id={sanFlorian.id}
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative overflow-hidden bg-antracite py-[clamp(5rem,12vw,9rem)]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <p data-reveal className="eyebrow text-tortora">
            {sanFlorian.eyebrow}
          </p>
          <h2
            data-reveal
            className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.2rem)] leading-[1.05] text-offwhite"
          >
            {sanFlorian.title}
          </h2>
          <p
            data-reveal
            className="mt-3 font-sans text-[0.8rem] font-light uppercase tracking-[0.35em] text-sabbia"
          >
            {sanFlorian.denominazione}
          </p>
          <p
            data-reveal
            className="mt-7 max-w-prose font-prose text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-offwhite/70"
          >
            {sanFlorian.intro}
          </p>
          <div data-reveal className="mt-10">
            <Cta as="button" type="button" onClick={() => toggleZoom(true)} className="btn-light">
              {sanFlorian.cta}
            </Cta>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="sf-glow absolute h-[52vh] w-[52vh] max-w-full rounded-full bg-tortora/10 blur-3xl"
            aria-hidden="true"
          />
          <span
            className="absolute right-0 hidden font-sans text-[0.68rem] font-light uppercase tracking-[0.5em] text-offwhite/25 [writing-mode:vertical-rl] lg:block"
            aria-hidden="true"
          >
            San Florian · {sanFlorian.denominazione}
          </span>
          <img
            ref={bottleRef}
            src={format.image}
            alt={`Bottiglia di San Florian, formato ${format.label} ${format.volume}`}
            width="279"
            height="914"
            className={`sf-bottle relative z-10 h-[52vh] w-auto object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.55)] lg:h-[66vh] ${
              zoomed ? 'bottle-zoom' : ''
            }`}
          />
        </div>
      </div>

      {/* Overlay dettaglio: sempre montato, mostrato via GSAP per un fade pulito */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal={zoomed}
        aria-label="San Florian — note di degustazione e scheda tecnica"
        className="invisible fixed inset-0 z-[60] overflow-y-auto bg-[#181816] opacity-0"
        style={{ pointerEvents: zoomed ? 'auto' : 'none' }}
      >
        <button
          type="button"
          onClick={() => toggleZoom(false)}
          aria-label={sanFlorian.chiudi}
          className="fixed right-5 top-5 z-[80] rounded-full border border-offwhite/25 p-3 text-offwhite/80 transition-colors hover:border-offwhite hover:text-offwhite sm:right-8 sm:top-6"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto min-h-full max-w-7xl px-5 pb-20 pt-[52vh] sm:px-8 lg:flex lg:items-center lg:py-24 lg:pr-[42vw] lg:pt-24">
          <div className="max-w-xl">
            <p className="sf-detail eyebrow text-tortora">{sanFlorian.eyebrow}</p>
            <h3 className="sf-detail mt-4 font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] text-offwhite">
              {sanFlorian.title}
            </h3>
            <p className="sf-detail mt-3 font-sans text-[0.8rem] font-light uppercase tracking-[0.35em] text-sabbia">
              {sanFlorian.denominazione}
            </p>

            <h4 className="sf-detail eyebrow mt-10 text-offwhite/50">
              {sanFlorian.degustazione.titolo}
            </h4>
            <p className="sf-detail mt-4 font-prose text-[1.1rem] leading-relaxed text-offwhite/75">
              {sanFlorian.degustazione.testo}
            </p>

            <dl className="sf-detail mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-offwhite/10 pt-8">
              {sanFlorian.scheda.map((row) => (
                <div key={row.label}>
                  <dt className="eyebrow text-tortora/80">{row.label}</dt>
                  <dd className="mt-1.5 font-prose text-[1.02rem] text-offwhite/80">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="sf-detail mt-10 flex flex-wrap items-center gap-3">
              <span className="eyebrow mr-2 text-offwhite/50">Formato</span>
              {sanFlorian.formats.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f)}
                  aria-pressed={format.id === f.id}
                  className={`btn !px-6 !py-2.5 ${
                    format.id === f.id
                      ? 'border-sabbia bg-sabbia text-antracite'
                      : 'border-offwhite/25 text-offwhite/70 hover:border-offwhite/60 hover:text-offwhite'
                  }`}
                >
                  {f.label} {f.volume}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
