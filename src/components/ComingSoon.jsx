import { useState } from 'react'
import useReveal from '../hooks/useReveal.js'
import DropsLogo from './DropsLogo.jsx'
import SplitHeading from './SplitHeading.jsx'
import { comingSoon } from '../data/content.js'

const GOCCE = 7
const LAMPO_MS = 160

export default function ComingSoon() {
  const ref = useReveal()
  // Easter egg: ogni click sul logo fa lampeggiare una goccia, dall'alto in
  // basso. Alla settima — sette fontane — compare la frase nascosta.
  const [clic, setClic] = useState(0)

  // Il lampo è breve e non lascia traccia — la goccia sale al 90% di tortora e
  // torna al 50%: chi clicca per caso non se ne accorge, chi insiste nota che
  // ogni volta tocca alla goccia successiva. Si fa toccando il DOM e non con
  // una prop di DropsLogo: il logo è uno solo in tutto il sito e non deve
  // avere varianti.
  const lampeggia = () => {
    if (clic >= GOCCE) return
    const goccia = document.querySelectorAll('#coming-soon .drop')[clic]
    goccia?.classList.add('fill-tortora/90')
    setTimeout(() => goccia?.classList.remove('fill-tortora/90'), LAMPO_MS)
    setClic(clic + 1)
  }

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
          onClick={lampeggia}
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
        <p
          aria-live="polite"
          className={`absolute inset-x-0 top-full mt-6 px-7 font-sans text-sm font-light italic text-moro motion-safe:transition-opacity motion-safe:duration-700 ${
            clic === GOCCE ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {clic === GOCCE && comingSoon.segreto}
        </p>
      </div>
    </section>
  )
}
