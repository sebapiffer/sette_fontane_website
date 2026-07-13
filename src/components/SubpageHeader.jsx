import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import DropsLogo from './DropsLogo.jsx'
import Wordmark from './Wordmark.jsx'
import { site } from '../data/content.js'

// Intestazione minimale condivisa dalle pagine dedicate (non la Navbar della
// Home, che resta legata alle sue sezioni e al menu ad hamburger): stesso
// logo e stesso linguaggio visivo, con un rimando diretto alla Home.
export default function SubpageHeader() {
  return (
    <header className="bg-antracite text-offwhite">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="Sette Fontane — torna alla home">
          <DropsLogo className="h-8 w-auto text-tortora" spacingX={1.5} />
          <span className="sr-only">{site.nameParts.join(' ')}</span>
          <Wordmark className="h-8 w-auto" />
        </Link>
        <Link
          to="/"
          className="eyebrow flex items-center gap-2 text-tortora transition-colors hover:text-offwhite"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Torna alla home
        </Link>
      </div>
    </header>
  )
}
