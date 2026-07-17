import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import DropsLogo, { CADUTA_GOCCE } from './DropsLogo.jsx'
import Wordmark from './Wordmark.jsx'
import { site, hero } from '../data/content.js'
import { quandoPronto } from '../lib/ambiente.js'

export default function Hero() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Sequenza di apertura: le sette gocce cadono in formazione,
        // poi il nome del maso emerge. Parte solo quando il preloader ha
        // finito (`sf:ready`), altrimenti suonerebbe a sipario chiuso.
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
        tl.from('.drop', { ...CADUTA_GOCCE })
          .from('.hero-word', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.15 }, '-=0.3')
          .from('.hero-rule', { scaleX: 0, duration: 0.7 }, '-=0.4')
          .from('.hero-sub', { autoAlpha: 0, duration: 0.8 }, '-=0.3')

        const annulla = quandoPronto(() => tl.play())

        // Allo scroll la hero sfuma verso il fondo chiaro della sezione
        // successiva. NIENTE pin: era il pin la causa della "pagina bianca".
        // La hero è alta un intero viewport; pinnandola, dopo che il contenuto
        // era sfumato restava a schermo il suo fondo (ormai creta) tenuto fermo
        // e vuoto finché il colore non finiva — schermo pieno di vuoto. Senza
        // pin la hero scorre via naturalmente e Azienda, che la segue subito
        // (è a un viewport esatto, nessun gap), sale a coprirla dal basso:
        // mentre il contenuto della hero sfuma in alto, Azienda è già in vista
        // in basso, quindi non c'è mai un fotogramma interamente vuoto.
        // Il fondo vira ad antracite → tortora → creta e chiude su creta presto
        // (progresso ~0.75), così quando il bordo hero/Azienda entra in campo i
        // due fondi combaciano e la giunzione è invisibile. `scrub` mappa tutto
        // sui primi ~55% di uscita della hero.
        // Con `scrub` l'ULTIMO tween chiude sempre a fine range: la corsa
        // (30%) è quindi la distanza entro cui il fondo raggiunge creta. Oltre,
        // la hero (creta) finisce di scorrere via su Azienda (creta) — stesso
        // colore, giunzione invisibile e nessuna tenuta vuota. Le posizioni
        // qui sono frazioni della corsa: contenuto e video via a ~metà, il
        // colore antracite → tortora → creta chiude a fondo corsa.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=30%',
              scrub: true,
            },
          })
          .to('.hero-content', { autoAlpha: 0, y: -70, ease: 'none', duration: 0.5 }, 0)
          // il video si dissolve per lasciar emergere il colore di fondo animato
          .to('.hero-media', { autoAlpha: 0, ease: 'none', duration: 0.4 }, 0.05)
          // passa per il tortora del brand per non attraversare grigi spenti
          .to(sectionRef.current, { backgroundColor: '#A48A7B', ease: 'none', duration: 0.3 }, 0.1)
          .to(sectionRef.current, { backgroundColor: '#F5F1EC', ease: 'none', duration: 0.6 }, 0.4)

        return annulla
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
      {/* Video di sfondo con velo scuro per la leggibilità; sotto resta il
          bg-antracite della sezione, che fa da fallback (e da destinazione
          della dissolvenza allo scroll). Nascosto con prefers-reduced-motion. */}
      <div className="hero-media absolute inset-0" aria-hidden="true">
        <video
          className="h-full w-full object-cover"
          src={hero.video.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
        />
        <div className="absolute inset-0 bg-gradient-to-b from-antracite/45 via-antracite/55 to-antracite/75" />
      </div>

      <div className="hero-content relative flex flex-col items-center px-6 text-center">
        <DropsLogo
          title="Logo Sette Fontane: sette gocce d'acqua"
          className="h-[clamp(7rem,16vh,10.5rem)] w-auto text-tortora"
        />
        <h1 className="mt-8 text-offwhite">
          <span className="sr-only">{site.nameParts.join(' ')}</span>
          <Wordmark className="hero-word w-[clamp(13rem,42vw,26rem)]" />
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
