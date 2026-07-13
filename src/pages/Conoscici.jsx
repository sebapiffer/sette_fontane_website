import SubpageHeader from '../components/SubpageHeader.jsx'
import Footer from '../components/Footer.jsx'
import SplitHeading from '../components/SplitHeading.jsx'
import useReveal from '../hooks/useReveal.js'
import { conosciciPage } from '../data/content.js'

export default function Conoscici() {
  const ref = useReveal()

  return (
    <>
      <SubpageHeader />
      <main>
        <section ref={ref} className="bg-antracite py-[clamp(5rem,12vw,9rem)]">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <p data-reveal className="eyebrow text-sabbia">
              {conosciciPage.eyebrow}
            </p>
            <SplitHeading
              as="h1"
              data-reveal-words
              className="mt-5 font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.08] text-offwhite"
            >
              {conosciciPage.title}
            </SplitHeading>
            <div className="mx-auto mt-8 max-w-prose space-y-5 text-left">
              {conosciciPage.paragraphs.map((p, i) => (
                <p
                  key={i}
                  data-reveal
                  className="font-prose text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-offwhite/75"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
