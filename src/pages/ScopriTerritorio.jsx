import Footer from '../components/Footer.jsx'
import SplitHeading from '../components/SplitHeading.jsx'
import useReveal from '../hooks/useReveal.js'
import { scopriTerritorioPage } from '../data/content.js'

export default function ScopriTerritorio() {
  const ref = useReveal()

  return (
    <>
      <main>
        <section
          ref={ref}
          data-nav-theme="light"
          className="bg-offwhite pb-[clamp(5rem,12vw,9rem)] pt-[clamp(8rem,15vw,11rem)]"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 md:grid-cols-2 md:gap-20">
            <div>
              <p data-reveal className="eyebrow text-moro">
                {scopriTerritorioPage.eyebrow}
              </p>
              <SplitHeading
                as="h1"
                data-reveal-words
                className="mt-5 font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.08] text-antracite"
              >
                {scopriTerritorioPage.title}
              </SplitHeading>
              <div className="mt-7 space-y-5">
                {scopriTerritorioPage.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    data-reveal
                    className="max-w-prose font-prose text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-antracite/70"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <figure className="mx-auto w-full max-w-md overflow-hidden md:max-w-none">
              <div className="aspect-[4/5] w-full">
                <img
                  data-reveal-img
                  src={scopriTerritorioPage.image.src}
                  alt={scopriTerritorioPage.image.alt}
                  loading="lazy"
                  decoding="async"
                  width="1600"
                  height="900"
                  className="h-full w-full rounded-t-full object-cover"
                />
              </div>
            </figure>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
