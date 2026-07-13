import { Fragment } from 'react'

// Spacca un titolo in parole, ciascuna incapsulata in una maschera
// overflow-hidden: la parola scivola verticalmente da sotto la maschera
// invece di limitarsi a un fade in blocco (vedi il terzo blocco aggiunto a
// useReveal.js, che anima ".split-word" dentro ogni [data-reveal-words]).
// Il testo vero resta in un nodo sr-only: gli screen reader leggono la frase
// intera, non le singole parole spezzate (che sono aria-hidden).
export default function SplitHeading({ as: Tag = 'h2', children, className = '', ...props }) {
  const testo = String(children)
  const parole = testo.split(' ')

  return (
    <Tag className={className} {...props}>
      <span className="sr-only">{testo}</span>
      <span aria-hidden="true">
        {parole.map((parola, i) => (
          <Fragment key={i}>
            {/* La maschera è alta quanto la line-box, ma con leading stretto
                (i titoli usano leading-[1.08]) l'inchiostro di Mason Sans —
                maiuscole, apici, accenti — sborda sopra la line-box e verrebbe
                tranciato da overflow-hidden. Il padding-top le dà aria in
                testa (l'overflow clippa al padding box, quindi lì il glifo si
                vede) e il margin-top negativo la riassorbe, così il titolo
                resta esattamente dov'era. Solo sopra: il bordo BASSO deve
                restare aderente alla line-box, è quello che nasconde la parola
                prima che scivoli su. */}
            <span className="inline-block overflow-hidden pt-[0.2em] -mt-[0.2em]">
              <span className="split-word inline-block">{parola}</span>
            </span>
            {i < parole.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
