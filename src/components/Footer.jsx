import { Instagram, Facebook } from 'lucide-react'
import useReveal from '../hooks/useReveal.js'
import DropsLogo from './DropsLogo.jsx'
import SfondoSezione from './SfondoSezione.jsx'
import { CLASSE_ALTEZZA } from './DivisoreOnda.jsx'
import { site, footer } from '../data/content.js'

const ICONS = { instagram: Instagram, facebook: Facebook }

export default function Footer() {
  const ref = useReveal()

  return (
    <footer
      ref={ref}
      id={footer.id}
      data-nav-theme="dark"
      className="relative overflow-hidden bg-antracite pb-10 pt-[clamp(4rem,9vw,6.5rem)] text-offwhite"
    >
      {/* Il maso in fondo alla pagina: chiude il racconto proprio dove si
          invita a venire a trovarci. Sfuma nell'antracite verso il basso, dove
          stanno i contatti e le note legali. */}
      <SfondoSezione src={footer.background.src} srcSet={footer.background.srcSet} opacita={0.52}>
        <div className="absolute inset-0 bg-gradient-to-b from-antracite/85 via-antracite/85 to-antracite" />
        {/* Fascia di antracite pieno in cima, alta esattamente quanto l'onda
            che la sezione precedente disegna verso il basso. Il velo del
            footer lascia passare un 15% di fotografia fin sul bordo
            superiore, e lì l'onda — tinta piatta — ci appoggiava sopra la
            propria base: uno scalino di ~15/255 che ridisegnava come riga
            dritta proprio il confine che l'onda serve a togliere (visibile a
            390 px sul terzo destro). Sotto la fascia la foto riprende: si
            perde solo la striscia che l'onda copre comunque. */}
        <div className={`absolute inset-x-0 top-0 ${CLASSE_ALTEZZA} bg-antracite`} />
      </SfondoSezione>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 md:grid-cols-3">
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
          {/* In colonna e non in riga: accanto all'icona ci sta l'account per
              esteso, che è anche l'unico modo di trovarci se qualcuno legge il
              sito stampato o su uno screenshot. Chi non ha ancora un account
              reale (`handle` assente) mostra solo il nome del social. */}
          <ul className="mt-5 flex flex-col items-start gap-3">
            {footer.social.map((s) => {
              const Icon = ICONS[s.icon]
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.handle ? `${s.label} — ${s.handle}` : s.label}
                    className="group flex items-center gap-3 text-offwhite/70 transition-colors hover:text-sabbia"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-offwhite/20 transition-colors group-hover:border-sabbia">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-sans text-sm font-light tracking-wide">
                      {s.handle ?? s.label}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div
        data-reveal
        className="relative mx-auto mt-14 max-w-7xl border-t border-offwhite/10 px-5 pt-6 sm:px-8"
      >
        <ul className="flex flex-col gap-2 font-sans text-xs font-light tracking-wide text-offwhite/40 sm:flex-row sm:justify-between">
          {footer.note.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
