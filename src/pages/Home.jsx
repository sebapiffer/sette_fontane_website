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
          {/* Banda quieta color creta (#F5F1EC, lo stesso su cui chiude la
              sfumatura dell'hero: nessuno stacco) posta DENTRO la tela del
              viticcio, prima di Azienda. È la prima superficie su cui il
              tralcio scende: così la linea si vede già nella transizione
              sfumata dopo l'hero, non solo da Azienda in poi. Il primo nodo
              del tracciato è ancorato al wrapper (p(area, 0.5, 0)), quindi la
              banda ne alza da sola l'attacco senza ritarare gli altri nodi.
              Bassa (8vh, era 34): il wrapper sale sopra l'hero pinnata già
              durante la dissolvenza (pinSpacing: false, vedi Hero) e la banda
              è il bordo del "sipario" — più è alta, più creta vuota entra in
              scena prima di Azienda. */}
          <div aria-hidden="true" data-nav-theme="light" className="h-[8vh] bg-creta" />
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
