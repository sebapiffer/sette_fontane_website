import Preloader from '../components/Preloader.jsx'
import Hero from '../components/Hero.jsx'
import Azienda from '../components/Azienda.jsx'
import ChiSiamo from '../components/ChiSiamo.jsx'
import Territorio from '../components/Territorio.jsx'
import IntroVini from '../components/IntroVini.jsx'
import SanFlorian from '../components/SanFlorian.jsx'
import ComingSoon from '../components/ComingSoon.jsx'
import Viticcio from '../components/Viticcio.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        {/* Il contenitore relativo fa da tela al viticcio, che cresce
            in scrub lungo tutte le sezioni dopo la hero. */}
        <div className="relative">
          <Azienda />
          <ChiSiamo />
          <Territorio />
          <IntroVini />
          <SanFlorian />
          <ComingSoon />
          <Viticcio />
        </div>
      </main>
      <Footer />
    </>
  )
}
