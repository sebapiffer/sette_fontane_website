import { Fragment } from 'react'

// Di quanto la parola scende, in percentuale della propria altezza, per
// starsene nascosta sotto la maschera prima di salire.
//
// NON è un numero libero: sta in equilibrio con lo sbordo BASSO della maschera
// qui sotto (`pb-[0.16em] -mb-[0.16em]`), e i due vanno cambiati insieme. Il
// budget è tutto qui: la parola sparisce sotto il bordo basso solo se scende
// più di quanto il bordo si sia abbassato, cioè
//
//     (DISCESA/100 − 1) × interlinea  ≥  sbordo
//
// Con l'interlinea più stretta del sito (leading-[1.05] su San Florian):
// 0.25 × 1.05em = 0.2625em contro 0.16em di sbordo — restano ~0.10em di
// margine sulla sparizione. Alzare lo sbordo senza alzare questa, o stringere
// l'interlinea di un titolo sotto 1.05, rimette in scena la parola prima che
// parta. Era 110 quando la maschera era a filo sotto, e allora bastava.
export const DISCESA_PAROLA = 125

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
                tranciato da overflow-hidden. Il padding le dà aria (l'overflow
                clippa al PADDING box, quindi lì dentro il glifo si vede) e il
                margin negativo la riassorbe, così il titolo resta esattamente
                dov'era: la maschera si allarga senza spostare niente.
                Il margine negativo in basso serve anche a un secondo scopo —
                un inline-block con overflow non visibile prende la baseline
                dal proprio bordo margine INFERIORE, quindi senza -mb la sola
                padding-bottom solleverebbe tutta la parola rispetto alla riga.

                Sotto serve tanto quanto sopra: Mason Sans porta code sotto la
                linea di base anche in parole che non hanno discendenti — la R
                di "Florian" ha uno svolazzo che scende ~5px a corpo 38 — e il
                bordo basso era a filo ESATTO della line-box (misurato: 0.00px
                di margine). Su Blink la coda ci stava per un pelo; a filo zero
                però basta un motore che arrotondi la line-box di mezzo pixel
                — WebKit su iPhone — per rasarla. Ora ha 0.16em di franco.
                Quel numero è in coppia con DISCESA_PAROLA: vedi lassù. */}
            <span className="inline-block overflow-hidden pt-[0.2em] -mt-[0.2em] pb-[0.16em] -mb-[0.16em]">
              <span className="split-word inline-block">{parola}</span>
            </span>
            {i < parole.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
