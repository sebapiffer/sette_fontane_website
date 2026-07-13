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
            <span className="inline-block overflow-hidden">
              <span className="split-word inline-block">{parola}</span>
            </span>
            {i < parole.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
