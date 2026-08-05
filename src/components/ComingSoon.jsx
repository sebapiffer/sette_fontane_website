import useReveal from '../hooks/useReveal.js'
import DropsLogo from './DropsLogo.jsx'
import SplitHeading from './SplitHeading.jsx'
import { comingSoon } from '../data/content.js'

export default function ComingSoon() {
  const ref = useReveal()

  return (
    <section
      id="coming-soon"
      ref={ref}
      data-nav-theme="light"
      className="bg-creta py-[clamp(5rem,12vw,8rem)] text-center"
    >
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <DropsLogo data-reveal className="mx-auto h-14 w-auto text-tortora/50" />
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
        <p data-reveal className="mt-4 font-prose text-lg text-antracite/60">
          {comingSoon.text}
        </p>
      </div>
    </section>
  )
}
