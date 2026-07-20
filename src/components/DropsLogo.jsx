// Le sette gocce del logo Sette Fontane, ridisegnate come SVG vettoriale.
// Ogni goccia ha classe "drop" per poterle animare singolarmente con GSAP.

// La caduta in formazione delle gocce: preloader (in loop) e apertura della
// hero DEVONO avere la stessa cadenza — il preloader passa il testimone alla
// hero e ogni differenza si vedrebbe come uno scatto. Vive qui, accanto alle
// gocce che anima. (Da spandere in una timeline con ease power2.out.)
// La y è in unità del viewBox (~45% dell'altezza del logo), non in px.
export const CADUTA_GOCCE = { y: -45, autoAlpha: 0, duration: 0.8, stagger: 0.11 }

// Geometria presa VERBATIM dal logo vettoriale del cliente
// (`allegati/Logo_7 FONTANE_completo.pdf`, content stream estratto e ribaltato
// sull'asse y perché il PDF ha y verso l'alto). Non ridisegnare "a occhio": la
// goccia originale è più LARGA e più CORTA di quanto sembri — le spalle si
// aprono al raggio pieno (8.419) già a metà strada tra punta e centro, e la
// punta dista dal centro solo 1.76 raggi. Una versione ricostruita a mano era
// finita a 1.86 raggi con le spalle basse, e leggeva visibilmente più stretta.
const RAGGIO = 8.419
const ALTEZZA_GOCCIA = 23.22

// Punta nell'origine, bulbo verso il basso.
const DROP_PATH =
  'M0 0 C 0 0, -8.418 8.756, -8.418 14.801 C -8.418 19.451, -4.649 23.22, 0 23.22 ' +
  'C 4.649 23.22, 8.419 19.451, 8.419 14.801 C 8.419 8.756, 0 0, 0 0 Z'

// Posizioni delle punte, sempre dal PDF. Da notare: le due gocce della terza
// riga stanno a ±11.30, non a metà del passo orizzontale (±12.68), e lo stacco
// della goccia di vertice (26.378) è leggermente maggiore di quello tra le
// righe (25.363). Sono asimmetrie dell'originale, vanno tenute.
const PASSO_X = 25.364
const POSITIONS = [
  [0, 0],
  [-25.364, 26.378],
  [0, 26.378],
  [25.364, 26.378],
  [-11.304, 51.741],
  [11.305, 51.741],
  [0, 77.105],
]

// Margine attorno al disegno. NON è decorativo ed è obbligatorio: un <svg> ha
// `overflow: hidden` di default, quindi con un viewBox che coincide esattamente
// col bounding box delle gocce (0 → 100.325) il bordo della forma cade sulla
// linea di taglio e il rasterizzatore rade la riga di pixel antialiasata più
// esterna. Sul bulbo tondo della goccia in basso si legge come un taglio netto,
// e le gocce laterali della prima riga vengono limate sui fianchi. Non togliere
// il margine e non "risolvere" con overflow: visible — durante la caduta
// (CADUTA_GOCCE) le gocce traslano di -45 e finirebbero a dipingere sopra il
// wordmark. Deve restare uniforme sui quattro lati, o il logo si scentra.
const MARGINE = 1

const ALTEZZA = 77.105 + ALTEZZA_GOCCIA + MARGINE * 2

// Il logo NON ha varianti: c'è una sola formazione, quella del PDF. Esisteva
// una prop `spacingX` che allargava solo l'asse X (la navbar la usava a 1.5) —
// cioè stirava le gocce fuori dalle proporzioni dell'originale. Rimossa: se
// serve un logo più grande si cambia l'altezza in CSS, la larghezza segue.
const HALF_WIDTH = PASSO_X + RAGGIO + MARGINE

export default function DropsLogo({ className = '', title, ...rest }) {
  return (
    <svg
      viewBox={`${-HALF_WIDTH} ${-MARGINE} ${HALF_WIDTH * 2} ${ALTEZZA}`}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
      {...rest}
    >
      {title && <title>{title}</title>}
      {POSITIONS.map(([x, y], i) => (
        <path
          key={i}
          className="drop"
          d={DROP_PATH}
          transform={`translate(${x} ${y})`}
        />
      ))}
    </svg>
  )
}
