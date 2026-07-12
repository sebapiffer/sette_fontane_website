import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Menu, X } from 'lucide-react'
import DropsLogo from './DropsLogo.jsx'
import { site, nav } from '../data/content.js'

export default function Navbar() {
  const [theme, setTheme] = useState('dark') // tema della sezione sottostante
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const onLight = theme === 'light'

  // La navbar adotta i colori giusti leggendo il tema dichiarato da ogni
  // sezione tramite data-nav-theme. Un listener di scroll diretto (invece
  // di affidarsi al ciclo di ScrollTrigger) resta corretto anche dopo un
  // salto istantaneo della pagina, ad es. cliccando un link del menu.
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
  }, [])

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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled && !open ? 'bg-offwhite/5 backdrop-blur-md' : ''
        } ${onLight && !open ? 'text-antracite' : 'text-offwhite'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label="Sette Fontane — inizio pagina"
          >
            <DropsLogo className="h-9 w-auto text-tortora" spacingX={1.5} />
            <span className="font-display leading-none">
              <span className="block text-[0.62rem] font-light uppercase tracking-[0.5em] opacity-80">
                {site.nameParts[0]}
              </span>
              <span className="block text-[0.8rem] font-semibold uppercase tracking-[0.3em]">
                {site.nameParts[1]}
              </span>
            </span>
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
            className="rounded-full p-2 transition-transform duration-300 hover:scale-110"
          >
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </header>

      {open && (
        <nav
          ref={menuRef}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-antracite/95 backdrop-blur-lg"
          aria-label="Navigazione principale"
        >
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-[clamp(1.9rem,6vw,3.4rem)] text-offwhite/90 transition-colors hover:text-tortora"
            >
              {link.label}
            </a>
          ))}
          <p className="eyebrow mt-10 text-tortora/70">{site.location}</p>
        </nav>
      )}
    </>
  )
}
