import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import DropsLogo from './DropsLogo.jsx'
import Wordmark from './Wordmark.jsx'
import { site, nav } from '../data/content.js'
import { vaiAllaSezione, vaiInCima } from '../lib/scorri.js'

// Navbar globale (montata una sola volta in App.jsx, fuori dalle Routes):
// stessa intestazione fissa e reattiva al tema su Home e su ogni pagina
// dedicata, invece di un header statico separato per le sottopagine.
export default function Navbar() {
  const [theme, setTheme] = useState('dark') // tema della sezione sottostante
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const { pathname } = useLocation()
  const inHome = pathname === '/'

  const onLight = theme === 'light'

  // La navbar adotta i colori giusti leggendo il tema dichiarato da ogni
  // sezione tramite data-nav-theme. Un listener di scroll diretto (invece
  // di affidarsi al ciclo di ScrollTrigger) resta corretto anche dopo un
  // salto istantaneo della pagina, ad es. cliccando un link del menu.
  // L'effetto riparte ad ogni cambio rotta: il set di sezioni con
  // data-nav-theme è tutto nuovo (pagina diversa) e il DOM è già stato
  // scambiato quando questo effect gira, quindi la prima lettura è già
  // corretta anche se avviene "dietro" il sipario di PageTransition.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-nav-theme]'))
    const probe = 72
    const aggiorna = () => {
      setScrolled(window.scrollY > 60)
      const active = sections.find((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= probe && r.bottom > probe
      })
      if (active) setTheme(active.dataset.navTheme)
    }
    // Gli eventi scroll possono arrivare più volte per frame: le letture dei
    // rect si coalizzano in una sola per frame via requestAnimationFrame.
    let inCoda = false
    const onScroll = () => {
      if (inCoda) return
      inCoda = true
      requestAnimationFrame(() => {
        inCoda = false
        aggiorna()
      })
    }
    aggiorna()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  // Menu a comparsa: blocco dello scroll + chiusura con Esc
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  useGSAP(
    () => {
      if (!open) return
      gsap.from(menuRef.current.querySelectorAll('a'), {
        autoAlpha: 0,
        y: 28,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.07,
      })
    },
    { dependencies: [open] }
  )

  // Click su un'ancora a pagina già aperta (siamo in Home): niente salto
  // secco del browser, si scorre in modo animato — su o giù che sia la
  // sezione. L'href resta nel markup: senza JS, o con il tasto centrale, il
  // link continua a funzionare da ancora normale.
  const scorriA = (hash) => (e) => {
    e.preventDefault()
    setOpen(false)
    // Il menu sblocca lo scroll nel proprio effect, che gira DOPO il paint:
    // partire subito significherebbe animare a body ancora overflow:hidden,
    // cioè non muoversi affatto. Lo si sblocca qui, un attimo prima; l'effect
    // poi riassegnerà '' su una proprietà già vuota.
    document.body.style.overflow = ''
    vaiAllaSezione(hash)
    // La URL deve comunque riflettere la sezione (link condivisibile, tasto
    // indietro): replaceState e non il router, che rimonterebbe la rotta e
    // rimanderebbe ScrollToTop a rifare da capo il lavoro appena fatto.
    window.history.replaceState(null, '', hash)
  }

  const tornaInCima = (e) => {
    e.preventDefault()
    vaiInCima()
    window.history.replaceState(null, '', window.location.pathname)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled && !open ? 'bg-offwhite/5 backdrop-blur-md' : ''
        } ${onLight && !open ? 'text-antracite' : 'text-offwhite'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* In Home il logo risale alla hero in scroll animato; dalle
              sottopagine è un link di rotta verso la Home. */}
          {inHome ? (
            <a
              href="#top"
              onClick={tornaInCima}
              className="group flex items-center gap-3"
              aria-label="Sette Fontane — inizio pagina"
            >
              <DropsLogo className="h-9 w-auto text-tortora" spacingX={1.5} />
              <span className="sr-only">{site.nameParts.join(' ')}</span>
              <Wordmark className="h-9 w-auto" />
            </a>
          ) : (
            <Link
              to="/"
              className="group flex items-center gap-3"
              aria-label="Sette Fontane — torna alla home"
            >
              <DropsLogo className="h-9 w-auto text-tortora" spacingX={1.5} />
              <span className="sr-only">{site.nameParts.join(' ')}</span>
              <Wordmark className="h-9 w-auto" />
            </Link>
          )}
          {/* Le tre linee non vengono scambiate con un'icona diversa da aperto
              a chiuso: sono sempre le stesse e si trasformano in croce (la
              prima e la terza ruotano di ±45°, la mediana svanisce). Lo stato
              viaggia su aria-expanded, che il CSS usa come selettore — così
              non serve né una checkbox nascosta né una classe in più. */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
            className="burger"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {open && (
        <nav
          ref={menuRef}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-antracite/95 backdrop-blur-lg"
          aria-label="Navigazione principale"
        >
          {nav.links.map((link) => {
            const classi =
              'font-display text-[clamp(1.9rem,6vw,3.4rem)] text-offwhite/90 transition-colors hover:text-tortora'

            // Voce con una pagina dedicata: link di rotta, ovunque ci si trovi.
            if (link.to) {
              return (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className={classi}>
                  {link.label}
                </Link>
              )
            }
            // Voce che vive solo nella home: in home è un'ancora nativa, da una
            // sottopagina è la rotta "/" con l'ancora in coda (ScrollToTop la
            // intercetta e scrolla alla sezione una volta montata).
            return inHome ? (
              <a
                key={link.href}
                href={link.href}
                onClick={scorriA(link.href)}
                className={classi}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={`/${link.href}`}
                onClick={() => setOpen(false)}
                className={classi}
              >
                {link.label}
              </Link>
            )
          })}
          <p className="eyebrow mt-10 text-tortora/70">{site.location}</p>
        </nav>
      )}
    </>
  )
}
