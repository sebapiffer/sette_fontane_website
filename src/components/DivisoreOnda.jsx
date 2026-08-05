// Stacco ondulato fra due sezioni: al posto della riga orizzontale netta, il
// colore di una delle due sezioni entra nell'altra con un bordo curvo e
// irregolare, come un lembo strappato. Modellato sul sito di riferimento
// portato dal cliente (cantinasanktpauls.it), dove l'onda misura ~26 px da
// cresta a cresta su un viewport da 1544 — un'increspatura, non un festone.
//
// COME SI INNESTA. Il divisore vive DENTRO una delle due sezioni, in fondo
// (`posizione="sotto"`) o in cima (`posizione="sopra"`), in `absolute`, e
// dipinge il colore PIENO della sezione confinante. Il bordo effettivo fra i
// due colori diventa quindi la linea ondulata, e il bordo nominale delle
// sezioni sparisce sotto al riempimento.
//
// Da che parte metterlo non è una scelta estetica ma una misura: il
// riempimento è una tinta piatta, quindi il lato che dipinge dev'essere piatto
// davvero. Campionando la pagina renderizzata riga per riga, il lato
// ANTRACITE di ogni stacco è uniforme (scarto 0-8 su 255), mentre i lati
// chiari variano di 23-60 perché sotto ci passa la foto velata di
// SfondoSezione. Da qui la regola: si dipinge sempre dal lato scuro, cioè si
// sceglie `posizione` in modo che il colore steso sia quello della sezione
// piatta. Invertirlo lascia una cucitura orizzontale visibile dove la tinta
// piatta incontra la fotografia.
//
// VINCOLI DEL VITICCIO (vedi CLAUDE.md). Il divisore è in `absolute` e non
// cambia l'altezza della sezione: gli ancoraggi del viticcio, misurati sul
// DOM, restano validi e non vanno ritarati. Non porta z-index — le figure
// `z-10` continuano a stare davanti al tralcio, e il tralcio (che nel wrapper
// viene dopo le sezioni) passa sopra all'onda come già passa sopra agli
// sfondi. La sezione ospite dev'essere `relative`: `position: relative` da
// sola NON crea un contesto di impilamento, quindi è sicura — non aggiungere
// `isolate` né z-index per farci stare il divisore.

const VB_W = 1000
const VB_H = 100

// Estremi dell'onda: x = frazione della larghezza, y = 0 sulla cresta più
// avanzata, 1 sulla linea di base. Ricalcati sul profilo misurato pixel per
// pixel del sito di riferimento: le distanze fra un estremo e l'altro sono
// volutamente disuguali (~20-27% della larghezza) e le ampiezze pure. Una
// sinusoide regolare si legge come un motivo decorativo ripetuto; qui deve
// leggersi come un bordo strappato, e l'irregolarità è tutto il lavoro.
const ESTREMI = [
  [0.0, 0.15],
  [0.08, 0.12],
  [0.18, 0.12],
  [0.27, 0.58],
  [0.35, 0.58],
  [0.48, 0.04],
  [0.545, 1.0],
  [0.63, 0.35],
  [0.72, 0.77],
  [0.82, 0.0],
  [0.94, 0.88],
  [1.0, 1.0],
]

// Il riempimento non arriva mai a spessore zero: la base dell'onda si ferma al
// 90% dell'altezza, così una striscia di colore copre SEMPRE il confine
// nominale fra le due sezioni. Senza questo, nei punti a spessore zero un
// arrotondamento subpixel del layout lascia trasparire un capello del colore
// sbagliato lungo la giunzione.
const BASE = 0.9

const arr = (n) => Math.round(n * 10) / 10

// Curva liscia per gli estremi: ogni punto della lista È un massimo o un
// minimo locale, quindi la tangente lì è orizzontale. Due cubiche con le
// maniglie a metà strada in x e la y dei due estremi danno esattamente questo,
// con continuità C1 e — a differenza di uno spline generico — nessuno
// sforamento oltre gli estremi, che su un bordo pieno si vedrebbe come una
// gobba fuori posto.
function ondulazione(specchia) {
  let p = ESTREMI.map(([x, y]) => [x * VB_W, y * BASE * VB_H])
  // Specchiata in orizzontale: lo stesso disegno letto al contrario, così due
  // stacchi vicini non sembrano incollati dallo stesso stampo.
  if (specchia) p = p.map(([x, y]) => [VB_W - x, y]).reverse()

  let d = `M ${arr(p[0][0])},${arr(p[0][1])}`
  for (let i = 1; i < p.length; i++) {
    const [x0, y0] = p[i - 1]
    const [x1, y1] = p[i]
    const mx = arr((x0 + x1) / 2)
    d += ` C ${mx},${arr(y0)} ${mx},${arr(y1)} ${arr(x1)},${arr(y1)}`
  }
  return d
}

// Il lato piatto del riempimento sborda oltre il viewBox invece di fermarsi
// sul bordo. Misurato: chiudendo esattamente sul bordo, il box del divisore
// cade su una frazione di pixel (l'altezza è un clamp in vw) e l'ultima riga
// viene antialiasata contro lo sfondo della sezione ospite — sulla giunzione
// Azienda/Chi siamo si vedeva un capello chiaro (70,69,67 contro 29,29,27).
// Sbordando, quella riga è coperta di tinta piena; l'eccedenza finisce nella
// sezione confinante, che ha esattamente lo stesso colore, quindi non si vede.
const SBORDO = 10

// Le quattro combinazioni si calcolano una volta sola al caricamento del
// modulo: sono stringhe costanti, non c'è ragione di rigenerarle a ogni render.
const TRACCIATI = {
  // Chiusa in basso: il colore sale dentro la sezione che ospita il divisore.
  sotto: [false, true].map(
    (s) => `${ondulazione(s)} L ${VB_W},${VB_H + SBORDO} L 0,${VB_H + SBORDO} Z`
  ),
  // Chiusa in alto: il colore scende dentro la sezione che ospita il divisore.
  sopra: [false, true].map((s) => `${ondulazione(s)} L ${VB_W},${-SBORDO} L 0,${-SBORDO} Z`),
}

const RIEMPIMENTO = {
  antracite: 'fill-antracite',
  creta: 'fill-creta',
  offwhite: 'fill-offwhite',
}

// L'altezza del divisore, esportata perché una sezione confinante possa
// allinearci una fascia di tinta piena (vedi il Footer). Va tenuta come
// stringa letterale: Tailwind genera le utility leggendo il sorgente, quindi
// la classe deve comparire scritta per esteso almeno una volta — comporla a
// runtime da pezzi non produrrebbe alcun CSS.
export const CLASSE_ALTEZZA = 'h-[clamp(0.875rem,2vw,2.25rem)]'

/**
 * @param colore     tinta stesa dall'onda: il colore PIENO della sezione
 *                   confinante, non di quella che ospita il divisore.
 * @param posizione  'sotto' = in fondo alla sezione ospite (il colore sale),
 *                   'sopra' = in cima (il colore scende).
 * @param specchia   ribalta il disegno in orizzontale (varietà fra stacchi).
 */
export default function DivisoreOnda({ colore, posizione = 'sotto', specchia = false }) {
  return (
    // L'altezza è l'ampiezza cresta-base. Il pavimento del clamp è basso di
    // proposito: gli estremi dell'onda sono a frazioni fisse della larghezza,
    // quindi su 390 px ci stanno le stesse cinque gobbe che su 1440. Con un
    // pavimento alto ognuna diventa corta e ripida e il bordo si legge come una
    // merlatura; a 14 px ogni mezz'onda resta lunga ~6 volte la sua altezza e
    // torna a leggersi come un'increspatura, come sul desktop.
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${
        posizione === 'sotto' ? 'bottom-0' : 'top-0'
      } ${CLASSE_ALTEZZA}`}
    >
      {/* preserveAspectRatio="none": l'onda si stira in larghezza e tiene
          l'altezza dal box, così l'ampiezza resta quella del clamp a ogni
          viewport invece di crescere con la larghezza dello schermo.
          overflow-visible: senza, l'svg ritaglierebbe proprio lo sbordo che
          serve a coprire la giunzione (vedi SBORDO). */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className={`h-full w-full overflow-visible ${RIEMPIMENTO[colore]}`}
      >
        <path d={TRACCIATI[posizione][specchia ? 1 : 0]} />
      </svg>
    </div>
  )
}
