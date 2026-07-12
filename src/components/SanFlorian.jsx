import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'
import { X } from 'lucide-react'
import useReveal from '../hooks/useReveal.js'
import Cta from './Cta.jsx'
import { sanFlorian } from '../data/content.js'
import { riduciMovimento, BREAKPOINT_LG } from '../lib/ambiente.js'

export default function SanFlorian() {
  const sectionRef = useReveal()
  const bottleRef = useRef(null)
  const overlayRef = useRef(null)
  const flipState = useRef(null)
  const glowTween = useRef(null)
  const [zoomed, setZoomed] = useState(false)
  const [format, setFormat] = useState(sanFlorian.formats[0])

  // Cattura lo stato della bottiglia prima del cambio layout, poi lascia che
  // l'effetto esegua il Flip flicker-free.
  const toggleZoom = (next) => {
    if (next) {
      // Segnala l'overlay attivo PRIMA che la bottiglia diventi `fixed` (esce
      // dal flow → la pagina si accorcia): così il ResizeObserver del Viticcio
      // salta il ricalcolo, che altrimenti gira sul main thread a metà del
      // Flip e lo fa bloccare. Rimosso a chiusura completata (onComplete).
      document.documentElement.dataset.sfZoom = '1'
      glowTween.current?.pause()
      // Il crossfade del formato (gsap.from al mount) lascia sulla bottiglia
      // un transform inline residuo (translate(0,0)): va tolto PRIMA di
      // leggere lo stato, o sovrascrive il translate di .bottle-zoom e la
      // bottiglia zoomata finisce mezza fuori schermo.
      gsap.set(bottleRef.current, { clearProps: 'transform' })
      overlayRef.current.scrollTop = 0
    } else {
      // Su mobile lo scroll dell'overlay può aver dissolto la bottiglia:
      // va riportata piena prima di catturare lo stato per il Flip di ritorno.
      gsap.set(bottleRef.current, { clearProps: 'opacity' })
    }
    flipState.current = Flip.getState(bottleRef.current)
    if (next) document.body.style.overflow = 'hidden'
    setZoomed(next)
  }

  // Sotto lg la bottiglia zoomata resta fissa in alto mentre le note scorrono:
  // la si dissolve con lo scroll dell'overlay, così non copre mai il testo.
  const onOverlayScroll = (e) => {
    if (!zoomed || window.innerWidth >= BREAKPOINT_LG) return
    const progresso = Math.min(e.currentTarget.scrollTop / 260, 1)
    gsap.set(bottleRef.current, { opacity: 1 - progresso })
  }

  useGSAP(
    () => {
      if (!flipState.current) return
      const state = flipState.current
      flipState.current = null
      const dur = riduciMovimento() ? 0 : 0.62

      Flip.from(state, {
        duration: dur,
        ease: 'power2.inOut',
        // La bottiglia ha una drop-shadow con blur enorme (70px): ricalcolarla
        // a ogni frame mentre scala è la causa principale degli scatti. La
        // spengo per la durata del moto (il Flip così anima solo transform,
        // fluido) e la ripristino a fine.
        onStart: () => gsap.set(bottleRef.current, { filter: 'none' }),
        onComplete: () => {
          gsap.set(bottleRef.current, { clearProps: 'filter' })
          if (!zoomed) {
            document.body.style.overflow = ''
            gsap.set(bottleRef.current, { clearProps: 'transform' })
            glowTween.current?.play()
            // overlay chiuso e a bocce ferme: sblocca il Viticcio e fagli
            // ricalcolare i tracciati una volta sola, senza jankare nulla
            delete document.documentElement.dataset.sfZoom
            window.dispatchEvent(new Event('sf:relayout'))
          }
        },
      })

      if (zoomed) {
        gsap.to(overlayRef.current, { autoAlpha: 1, duration: dur * 0.5 })
        gsap.fromTo(
          '.sf-detail',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: dur * 0.7, stagger: dur * 0.05, delay: dur * 0.35 }
        )
      } else {
        gsap.to(overlayRef.current, { autoAlpha: 0, duration: dur * 0.4 })
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
        duration: riduciMovimento() ? 0 : 0.6,
        ease: 'power2.out',
      })
    },
    { dependencies: [format] }
  )

  // L'alone dietro la bottiglia pulsa piano. Creato una sola volta; toggleZoom
  // lo mette in pausa prima del Flip e lo fa ripartire a chiusura completata.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
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

  // Scalda in cache entrambe le bottiglie nei tempi morti, così il cambio
  // formato (e lo zoom) non mostra mai un'immagine ancora da scaricare.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 2500))
    const cancella = window.cancelIdleCallback ?? clearTimeout
    const id = idle(() => {
      sanFlorian.formats.forEach((f) => {
        const img = new Image()
        img.src = f.image
      })
    })
    return () => cancella(id)
  }, [])

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
          {/* Alone di luce dietro la bottiglia: gradiente radiale caldo
              (sabbia → tortora → trasparente) che sfuma da sé, senza filtri
              blur — più economico da comporre mentre il pulse lo scala. */}
          <div
            className="sf-glow absolute h-[58vh] w-[58vh] max-w-full rounded-full bg-[radial-gradient(closest-side,rgba(201,180,164,0.30),rgba(164,138,123,0.13)_55%,transparent_78%)]"
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
            decoding="async"
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
        onScroll={onOverlayScroll}
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
