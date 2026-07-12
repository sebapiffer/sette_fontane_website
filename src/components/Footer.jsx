import { Instagram, Facebook } from 'lucide-react'
import useReveal from '../hooks/useReveal.js'
import DropsLogo from './DropsLogo.jsx'
import { site, footer } from '../data/content.js'

const ICONS = { instagram: Instagram, facebook: Facebook }

export default function Footer() {
  const ref = useReveal()

  return (
    <footer
      ref={ref}
      id={footer.id}
      data-nav-theme="dark"
      className="bg-antracite pb-10 pt-[clamp(4rem,9vw,6.5rem)] text-offwhite"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 md:grid-cols-3">
        <div data-reveal>
          <div className="flex items-center gap-3">
            <DropsLogo className="h-10 w-auto text-tortora" />
            <span className="font-display leading-none">
              <span className="block text-[0.65rem] font-light uppercase tracking-[0.5em] text-sabbia">
                {site.nameParts[0]}
              </span>
              <span className="block text-[0.85rem] font-semibold uppercase tracking-[0.3em]">
                {site.nameParts[1]}
              </span>
            </span>
          </div>
          <p className="mt-5 font-sans text-sm font-light text-offwhite/50">{site.location}</p>
        </div>

        <div data-reveal>
          <h2 className="eyebrow text-tortora">{footer.heading}</h2>
          <ul className="mt-5 space-y-2 font-sans text-sm font-light text-offwhite/70">
            <li>{footer.indirizzo}</li>
            <li>
              <a href={`mailto:${footer.email}`} className="transition-colors hover:text-offwhite">
                {footer.email}
              </a>
            </li>
            <li>{footer.telefono}</li>
            <li>
              <a
                href={`https://${site.domain}`}
                className="transition-colors hover:text-offwhite"
              >
                {site.domain}
              </a>
            </li>
          </ul>
        </div>

        <div data-reveal>
          <h2 className="eyebrow text-tortora">Seguici</h2>
          <ul className="mt-5 flex gap-4">
            {footer.social.map((s) => {
              const Icon = ICONS[s.icon]
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-offwhite/20 text-offwhite/70 transition-colors hover:border-sabbia hover:text-sabbia"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div data-reveal className="mx-auto mt-14 max-w-7xl border-t border-offwhite/10 px-5 pt-6 sm:px-8">
        <ul className="flex flex-col gap-2 font-sans text-xs font-light tracking-wide text-offwhite/40 sm:flex-row sm:justify-between">
          {footer.note.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
