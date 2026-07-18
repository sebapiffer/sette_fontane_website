import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { riduciMovimento, quandoPronto, BREAKPOINT_MD, BREAKPOINT_LG } from '../lib/ambiente.js'

// Un viticcio stilizzato: una sola linea sottile color tortora (il colore del
// logo) che nasce sotto la hero e si intreccia con i contenuti: passa DIETRO
// gli elementi che dichiarano z-10 (foto del maso, pulsante "Conoscici",
// panorama del territorio, bottiglia) e DAVANTI al resto, senza mai toccare
// il testo. Termina sulla prima goccia del logo di "Coming soon".
//
// Il tracciato non è una stringa fissa: viene GENERATO a ogni misura del
// layout da una lista di nodi ancorati agli elementi reali della pagina
// (frazioni del rettangolo di ogni ancora), così segue da solo i cambi di
// larghezza e le variazioni di altezza delle sezioni. La pipeline:
//
//   nodi [{x, y, asola?, ramo?, foglia?}] ──► generaViticcio ──►
//   { mainBranch, subBranches, leaves }
//
//   1. i nodi vengono uniti con una spline Catmull-Rom convertita in Bézier
//      cubiche: la linea passa ESATTAMENTE per ogni nodo, sempre con curve
//      morbide e fluide, senza gomiti;
//   2. dove un nodo dichiara `asola` un cappio auto-intersecante (5 punti,
//      vedi PUNTI_CAPPIO/costruisciCappio — un nodo scorsoio, come una "e"
//      corsiva) si accoda ai nodi PRIMA dell'unica spline che disegna tutta
//      la linea madre — nessuna giunzione, la stessa identica curva
//      Catmull-Rom dal primo nodo all'ultimo, asole comprese. Il vertice
//      d'ingresso è il nodo stesso, tangente alla direzione di marcia —
//      stimata dai nodi vicini, o imposta; da lì la spline sale, si
//      incurva sopra sé stessa e RIATTRAVERSA il primo tratto prima di
//      uscire: quel riattraversamento è l'unico incrocio, voluto;
//   3. dove un nodo dichiara `ramo` si genera un path separato: una semplice
//      BIFORCAZIONE della spline principale, non più una curva parametrica.
//      Nasce dal punto d'innesto TANGENTE alla linea madre (stessa saldatura
//      C1 usata dalle asole) e da lì il tracciato si autora come un proprio
//      array di `punti` — in coordinate LOCALI del gambo (`u` lungo la
//      tangente d'innesto, `v` perpendicolare, positivo verso `lato`) —
//      uniti dalla STESSA spline Catmull-Rom centripeta della linea madre:
//      la stessa lista di punti produce la stessa forma relativa ovunque
//      venga usata, qualunque direzione punti lì la linea. I rami sono POCHI
//      ma AMPI: vivono solo negli spazi larghi, così abbracciano il layout
//      con eleganza senza toccare il testo né sovrapporsi. Un ramo può
//      ancora BIFORCARSI (`figli`): ogni figlio innesta tangente a un punto
//      interno del gambo padre (indice `da`), con un proprio array di
//      `punti`, ricorsivamente. Sono tutti path separati (i subBranches): la
//      linea madre resta comunque una. In punta un ramo (a qualunque
//      livello: anche un figlio, sotto-ramo secondario o terziario) può
//      portare un `ricciolo`, in due varianti — entrambe restituiscono
//      PUNTI campionati, accodati al gambo prima della stessa unica spline,
//      niente giunzioni: `'induttore'` (default) — una fila di cappi auto-
//      intersecanti in sequenza, ciascuno un nodo scorsoio come una "e"
//      corsiva ripetuta (non un anello pulito: il simbolo della bobina in
//      elettrotecnica ne ricorda solo il ritmo), con propria ampiezza,
//      spaziatura da quella prima e inclinazione (vedi
//      puntiRiccioloInduttore/costruisciCappio) — oppure `'piatta'` — la spirale
//      continua che si stringe verso il centro, configurabile in ampiezza,
//      giri e restringimento (vedi puntiSpiralePiatta).
//   4. dove un nodo dichiara `foglia` si genera un RAMOSCELLO — stessa logica
//      di crescita dei `ramo` maggiori (`catenaGambo`, tangente all'innesto,
//      poi svolta verso `lato`), ma corto e senza ricciolo finale — e in punta
//      viene innestata una foglia di vite (il contorno di
//      `references/leaf-wireframe.svg`, importato com'è: un unico path
//      stroke, nessun riempimento): il suo punto di attacco (il picciolo, non
//      il centro della forma) è ancorato ESATTAMENTE sulla punta del
//      ramoscello, poi ruotata così che l'asse picciolo→punta prosegua la
//      tangente lì — la foglia continua il moto del ramoscello. Poche (3 su
//      desktop, 2 su mobile), sempre nei vuoti TRA una sezione e la
//      successiva — mai sui nodi che già hanno un `asola` o un `ramo` — con
//      lato/scala/rotazione diversi da foglia a foglia per un effetto
//      organico, non un timbro ripetuto.
//
// Due configurazioni: desktop (≥ lg, due colonne) e mobile (< md, colonna
// singola); nella fascia 768–1023 il viticcio resta nascosto (layout misti,
// nessun insieme di nodi è sicuro). Le frazioni dei nodi sono tarate sulle
// misure DOM reali: se una sezione cambia struttura vanno ritarate misurando
// il DOM, non a occhio.

// ---------------------------------------------------------------------------
// Geometria generativa
// ---------------------------------------------------------------------------

const arrotonda = (n) => Math.round(n * 10) / 10

const normalizza = (x, y) => {
  const l = Math.hypot(x, y) || 1
  return { x: x / l, y: y / l }
}

const ruota = (v, angolo) => {
  const cos = Math.cos(angolo)
  const sin = Math.sin(angolo)
  return { x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos }
}

// Punto di una cubica di Bézier a parametro t: serve al campionatore della
// linea madre (vedi generaViticcio) per stimare le lunghezze in pura
// aritmetica, senza mai interrogare il DOM.
function puntoCubica(p1, c1x, c1y, c2x, c2y, p2, t) {
  const u = 1 - t
  return {
    x: u * u * u * p1.x + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * p2.x,
    y: u * u * u * p1.y + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * p2.y,
  }
}

// Tratta di spline Catmull-Rom CENTRIPETA (α = 0,5) convertita in Bézier
// cubiche: passa per tutti i punti con tangenti continue; la variante
// centripeta — maniglie pesate sulla radice della distanza tra i punti — è
// priva di cuspidi anche con spaziature molto irregolari. Emette solo la
// catena di comandi `C` (il punto corrente del path deve già essere
// punti[0]), così più tratte e archi si concatenano in un unico tracciato.
// `tIn`/`tOut` impongono ESATTAMENTE la tangente al primo/ultimo punto:
// servono a saldare la tratta agli archi delle asole senza gomiti.
// `campiona`, se presente, riceve punti intermedi di ogni cubica: è il
// campionatore della linea madre.
function splineSegmento(punti, tIn, tOut, campiona) {
  if (punti.length < 2) return ''
  const passo = (a, b) => Math.max(Math.sqrt(Math.hypot(b.x - a.x, b.y - a.y)), 0.01)
  let d = ''
  for (let i = 0; i < punti.length - 1; i++) {
    const p0 = punti[i - 1] ?? punti[i]
    const p1 = punti[i]
    const p2 = punti[i + 1]
    const p3 = punti[i + 2] ?? p2
    const d1 = passo(p0, p1)
    const d2 = passo(p1, p2)
    const d3 = passo(p2, p3)
    const a1 = 2 * d1 * d1 + 3 * d1 * d2 + d2 * d2
    const b1 = 3 * d1 * (d1 + d2)
    let c1x = (d1 * d1 * p2.x - d2 * d2 * p0.x + a1 * p1.x) / b1
    let c1y = (d1 * d1 * p2.y - d2 * d2 * p0.y + a1 * p1.y) / b1
    const a2 = 2 * d3 * d3 + 3 * d3 * d2 + d2 * d2
    const b2 = 3 * d3 * (d3 + d2)
    let c2x = (d3 * d3 * p1.x - d2 * d2 * p3.x + a2 * p2.x) / b2
    let c2y = (d3 * d3 * p1.y - d2 * d2 * p3.y + a2 * p2.y) / b2
    const maniglia = Math.hypot(p2.x - p1.x, p2.y - p1.y) / 3
    if (i === 0 && tIn) {
      c1x = p1.x + tIn.x * maniglia
      c1y = p1.y + tIn.y * maniglia
    }
    if (i === punti.length - 2 && tOut) {
      c2x = p2.x - tOut.x * maniglia
      c2y = p2.y - tOut.y * maniglia
    }
    if (campiona) {
      for (let k = 1; k <= 8; k++) campiona(puntoCubica(p1, c1x, c1y, c2x, c2y, p2, k / 8))
    }
    d += ` C ${arrotonda(c1x)} ${arrotonda(c1y)} ${arrotonda(c2x)} ${arrotonda(c2y)} ${arrotonda(p2.x)} ${arrotonda(p2.y)}`
  }
  return d
}

const spline = (punti) =>
  punti.length < 2 ? '' : `M ${arrotonda(punti[0].x)} ${arrotonda(punti[0].y)}${splineSegmento(punti)}`

// L'occhiello — usato sia dalle asole della linea madre sia da ogni spira
// di un ricciolo a induttore — non è un anello che si limita a toccare il
// proprio punto d'ingresso (tangente d'entrata e d'uscita coincidenti, come
// un cerchio chiuso: si sfiora ma non si incrocia mai) né un anello che si
// incrocia solo se il tratto SUCCESSIVO, per come capita, gli ripassa
// sopra: deve annodarsi DA SÉ, sempre, a prescindere da cosa viene dopo —
// come il gesto di una "e" corsiva o di un nodo scorsoio. PUNTI_CAPPIO è
// quel gesto in coordinate LOCALI (`u` avanti lungo la tangente d'ingresso,
// `v` laterale verso `lato`, la stessa convenzione di puntoLocale):
// dall'origine (il nodo stesso, tangente alla direzione di marcia) sale e
// si incurva sopra sé stesso, poi ridiscende e RIATTRAVERSA il primo tratto
// (fra l'origine e il primo punto) prima di uscire — quel riattraversamento
// è l'unico incrocio, verificato a tavolino campionando la spline
// risultante. CAPPIO_USCITA_LOCALE stima la tangente d'uscita dall'ultimo
// lato, per onestà dell'API (nessun chiamante la usa oggi: generaViticcio e
// puntiRiccioloInduttore accodano solo `.punti`, tranne quest'ultimo che la
// riusa per incatenare la spira successiva).
const PUNTI_CAPPIO = [
  [0.62, 0.95],
  [0.15, 1.6],
  [-0.55, 1.1],
  [-0.25, 0.15], // qui inizia il tratto che riattraversa l'ingresso
  [0.55, -0.15], // uscita, oltre l'incrocio
]

const CAPPIO_USCITA_LOCALE = normalizza(0.55 - -0.25, -0.15 - 0.15)

// Un cappio auto-intersecante (vedi PUNTI_CAPPIO), scalato per `raggio` e
// piazzato in (punto, direzione) con la stessa trasformazione locale→
// assoluta dei rami (puntoLocale). Ritorna l'array di `punti` (da accodare
// al punto di partenza, che NON è incluso, per coerenza con
// puntiSpiralePiatta) più punto e tangente d'uscita. Usato dalle asole
// della linea madre (arcoAsola) e da ogni spira di un ricciolo a induttore
// (puntiRiccioloInduttore).
function costruisciCappio(punto, direzione, raggio, lato) {
  const punti = PUNTI_CAPPIO.map(([u, v]) => puntoLocale(punto, direzione, lato, u * raggio, v * raggio))
  const tangente = puntoLocale({ x: 0, y: 0 }, direzione, lato, CAPPIO_USCITA_LOCALE.x, CAPPIO_USCITA_LOCALE.y)
  return { punti, uscita: punti[punti.length - 1], tangente }
}

// Arco di un'asola sulla linea madre: un singolo cappio (vedi
// costruisciCappio) col raggio e il lato scelti dal nodo. Ritorna anche
// punto e tangente d'uscita, dove la spline riprende.
function arcoAsola(nodo, direzione, { raggio, lato = 'destra' }) {
  return costruisciCappio(nodo, direzione, raggio, lato)
}

// Ricciolo "a induttore" (o "a solenoide"): una fila di cappi auto-
// intersecanti (vedi costruisciCappio) in sequenza, come il simbolo della
// bobina in elettrotecnica ma con ogni spira annodata su di sé come una "e"
// corsiva ripetuta, anziché un anello pulito — non una spirale continua
// che si stringe da sé (per quella vedi puntiSpiralePiatta, la variante `ricciolo.tipo: 'piatta'` più
// sotto), ma spire distinte descritte una per una dall'array `spire`. Ogni
// spira è `{ampiezza, spaziatura?, inclinazione?, lato?}`:
//   - `ampiezza` è il suo raggio;
//   - `spaziatura` è il tratto rettilineo — ma TANGENTE, quindi senza
//     gomiti — percorso PRIMA di disegnarla; default 0,9×la propria
//     ampiezza (la stessa proporzione con cui nasceva, quando non era
//     ancora configurabile);
//   - `inclinazione` (gradi) ruota la tangente corrente PRIMA di percorrere
//     quel tratto: 0 mantiene la bobina dritta sul proprio asse (il
//     comportamento di partenza), un valore diverso la fa aprire a
//     ventaglio o ondeggiare, spira dopo spira — il tratto di `spaziatura`
//     e la spira che segue ereditano la nuova direzione;
//   - `lato` (default quello del ramo) permette di alternare il verso di
//     avvolgimento da una spira all'altra.
// Come puntiSpiralePiatta, ritorna un array di PUNTI (non un path): tutte
// le spire e i tratti di spaziatura fra loro finiscono, campionati, nella
// STESSA passata di splineSegmento del gambo che le porta — un'unica curva
// continua, niente giunzioni fra "gambo Bézier" e "ricciolo ad arco".
function puntiRiccioloInduttore(punto, direzione, spire, lato) {
  let q = { x: punto.x, y: punto.y }
  let t = direzione
  const punti = []
  for (const spira of spire) {
    const { ampiezza, spaziatura = 0.9 * ampiezza, inclinazione = 0 } = spira
    t = ruota(t, (inclinazione * Math.PI) / 180)
    q = { x: q.x + t.x * spaziatura, y: q.y + t.y * spaziatura }
    punti.push(q)
    const giro = costruisciCappio(q, t, ampiezza, spira.lato ?? lato)
    punti.push(...giro.punti)
    q = giro.uscita
    t = giro.tangente
  }
  return punti
}

// Ricciolo a spirale piatta: la spirale campionata che c'era prima del
// passaggio dei rami a punti espliciti, ripristinata e resa configurabile —
// non più un giro e mezzo a raggio e restringimento fissi, ma `ampiezza`
// (raggio di partenza), `giri` (avvolgimenti) e `restringimento` (frazione
// di raggio perduta per ogni giro completo: vicino a 0 resta quasi un
// cerchio ripetuto, vicino a 1 collassa rapidamente al centro) tutti
// parametrici. Parte da `punto` con tangente d'ingresso ESATTAMENTE uguale
// a `direzione` (centro sulla perpendicolare, dal lato scelto): la tangenza
// d'ingresso è ciò che la rende derivabile nel punto d'innesto, la curva
// CONTINUA il moto del gambo. A differenza del ricciolo a induttore (archi
// esatti, path a sé che si aggancia con un `tOut` imposto) questa funzione
// ritorna un array di PUNTI campionati, non un path: vanno accodati al
// gambo PRIMA dell'unica passata di splineSegmento che disegna l'intero
// ramo, così tutta la curva — gambo e spirale insieme — nasce dalla stessa
// spline Catmull-Rom, senza giunzioni (esattamente come funzionava prima).
function puntiSpiralePiatta(punto, direzione, opzioni) {
  const { ampiezza, giri = 1.5, restringimento = 0.88, lato = 'destra', campioni = 18 } = opzioni
  const senso = lato === 'destra' ? 1 : -1
  const cx = punto.x - senso * ampiezza * direzione.y
  const cy = punto.y + senso * ampiezza * direzione.x
  const a0 = Math.atan2(punto.y - cy, punto.x - cx)
  const n = Math.max(2, Math.round(campioni * giri))
  const punti = []
  for (let k = 1; k <= n; k++) {
    const t = k / n
    const a = a0 + senso * Math.PI * 2 * giri * t
    const r = ampiezza * (1 - restringimento * t)
    punti.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) })
  }
  return punti
}

// Catena di punti di un gambo, integrando la curvatura passo-passo. Usata
// solo dal ramoscello che porta la foglia (i rami maggiori sono ora
// biforcazioni a punti espliciti, vedi generaRamo più sotto). La direzione
// parte ESATTAMENTE tangente alla linea madre (innesto invisibile), poi
// ruota rapidamente di `svolta` radianti verso il lato scelto — con il
// profilo f(t)=1−(1−t)² la rotazione è quasi tutta nel primo tratto — e da lì
// PROSEGUE DRITTA nella nuova direzione fino in fondo: il ramoscello si
// stacca SUBITO dalla linea (niente tratti paralleli) e poi tira dritto,
// come un vero tralcio.
function catenaGambo(innesto, tangente, L, svolta, senso, punti) {
  const catena = [{ x: innesto.x, y: innesto.y }]
  const ds = L / punti
  let pos = { x: innesto.x, y: innesto.y }
  for (let k = 1; k <= punti; k++) {
    const t = k / punti
    const theta = senso * svolta * (1 - (1 - t) * (1 - t))
    const dir = ruota(tangente, theta)
    pos = { x: pos.x + dir.x * ds, y: pos.y + dir.y * ds }
    catena.push({ ...pos })
  }
  return catena
}

// Converte un punto in coordinate LOCALI del gambo — `u` lungo la tangente
// d'innesto, `v` perpendicolare, positivo verso `lato` — in coordinate
// assolute di pagina. Con questo un array di punti si autora in numeri
// piccoli e leggibili (quanto avanti, quanto di lato) indipendentemente
// dalla posizione o dalla direzione della linea madre in quel nodo: la
// stessa lista di punti produce la stessa forma relativa ovunque venga usata.
function puntoLocale(innesto, tangente, lato, u, v) {
  const senso = lato === 'destra' ? 1 : -1
  const perp = { x: -tangente.y, y: tangente.x }
  return {
    x: innesto.x + tangente.x * u + perp.x * senso * v,
    y: innesto.y + tangente.y * u + perp.y * senso * v,
  }
}

// Ramo secondario: una semplice BIFORCAZIONE della spline principale, non
// più una curva parametrica. Nasce dal punto d'innesto TANGENTE alla linea
// madre (o al gambo padre, per i sotto-rami) — stessa saldatura C1 usata
// dalle asole, la maniglia di Bézier è imposta sulla tangente — e da lì il
// tracciato si autora come un proprio array di `punti` (coordinate locali,
// vedi puntoLocale), uniti dalla STESSA spline Catmull-Rom centripeta della
// linea madre: modificare il ramo significa modificare quell'array, non più
// angolo/lunghezza/raggio di una formula.
//
// Un ramo può ancora BIFORCARSI (`figli`): ogni figlio innesta tangente a un
// punto interno del gambo padre — indice `da` nel gambo risultante (0 =
// l'innesto stesso, 1 = primo punto di `punti`, …) — con la tangente stimata
// dai punti vicini (stesso criterio della linea madre), e ha il proprio
// array `punti`, ricorsivamente. La ricorsione produce un ARRAY di path
// separati (il tronco più ogni discendente): la linea madre resta comunque
// una sola. Ogni path porta con sé il proprio `inizio` (il punto d'innesto):
// serve a calcolare, già in generazione, la frazione della linea madre a cui
// il ramo deve comparire — senza mai rimisurare i path dal DOM.
//
// In punta si può innestare un `ricciolo`, in due varianti scelte da
// `ricciolo.tipo`:
//   - `'induttore'` (default) — vedi puntiRiccioloInduttore: `{spire}`, una
//     fila di giri distinti, come il simbolo della bobina in elettrotecnica.
//   - `'piatta'` — vedi puntiSpiralePiatta: `{ampiezza, giri?,
//     restringimento?}`, una spirale continua che si stringe verso il
//     centro.
// Entrambe ritornano semplici PUNTI: si accodano al gambo e finiscono nella
// STESSA, unica passata di splineSegmento che disegna l'intero ramo — non
// c'è alcuna giunzione fra "gambo" e "ricciolo", è tutta una spline sola
// (coerente con la fluidità della linea madre, vedi costruisciCappio). La
// tangente d'uscita del gambo, usata per seminare la geometria del
// ricciolo, è stimata dagli ultimi due punti (stesso criterio di `figli`).
// Entrambe le varianti funzionano su qualunque ramo, compresi i `figli`
// (sotto-rami secondari/terziari), perché passano per questa stessa
// funzione, ricorsivamente.
function generaRamo(innesto, tangente, opzioni) {
  const { lato = 'destra', punti = [], figli = [], ricciolo } = opzioni
  const gambo = [
    { x: innesto.x, y: innesto.y },
    ...punti.map(({ u, v }) => puntoLocale(innesto, tangente, lato, u, v)),
  ]
  let coda = []
  if (ricciolo) {
    const ultimo = gambo[gambo.length - 1]
    const direzioneUscita =
      gambo.length > 1
        ? normalizza(ultimo.x - gambo[gambo.length - 2].x, ultimo.y - gambo[gambo.length - 2].y)
        : tangente
    coda =
      ricciolo.tipo === 'piatta'
        ? puntiSpiralePiatta(ultimo, direzioneUscita, { lato, ...ricciolo })
        : puntiRiccioloInduttore(ultimo, direzioneUscita, ricciolo.spire, ricciolo.lato ?? lato)
  }
  const d = `M ${arrotonda(innesto.x)} ${arrotonda(innesto.y)}${splineSegmento([...gambo, ...coda], tangente, null)}`
  const paths = [{ d, inizio: innesto }]
  for (const figlio of figli) {
    const idx = Math.min(gambo.length - 1, Math.max(0, figlio.da ?? gambo.length - 1))
    const punto = gambo[idx]
    const prima = gambo[Math.max(idx - 1, 0)]
    const dopo = gambo[Math.min(idx + 1, gambo.length - 1)]
    const tang = normalizza(dopo.x - prima.x, dopo.y - prima.y)
    paths.push(...generaRamo(punto, tang, figlio))
  }
  return paths
}

// Giro attorno all'estremità destra arrotondata di un pulsante a pillola:
// la stessa asola ad archi esatti degli altri occhielli (profilo standard),
// centrata sul cap destro e imboccata in cima verso destra. Il tratto che
// attraversa il corpo del pulsante sparisce dietro di esso (z-10): l'anello
// resta visibile solo attorno al cap tondo, dove il contorno visibile
// coincide col box. (Restituisce un singolo nodo con asola a direzione fissa.)
function nodoAvvolgimento({ x, y, w, h }) {
  const raggio = 0.85 * h
  return {
    x: x + w - h / 2,
    y: y + h / 2 - raggio,
    asola: {
      raggio,
      lato: 'destra',
      direzione: { x: 1, y: 0 },
    },
  }
}

// Foglia di vite: il contorno di references/leaf-wireframe.svg, un unico
// path chiuso disegnato a matita (nessun riempimento). Nel file sorgente vive
// dentro <g transform="translate(0,800) scale(0.1,-0.1)">: FOGLIA_D è la `d`
// così com'è (coordinate native ~0-8000), FOGLIA_TRASFORMA_BASE è la stessa
// trasformazione, da applicare sempre prima di qualunque posizionamento.
// FOGLIA_PICCIOLO e FOGLIA_PUNTA sono il picciolo (l'incavo in alto dove la
// foglia si stacca dal tralcio) e la punta opposta, misurati con un campione
// fitto di getPointAtLength DOPO FOGLIA_TRASFORMA_BASE: definiscono l'asse
// naturale dell'opera (quasi verticale, picciolo in alto) che serve da
// riferimento per la rotazione. FOGLIA_ALTEZZA è l'altezza del bounding box
// nello stesso spazio, usata per convertire un'altezza in px in una scala.
const FOGLIA_D =
  'M6065 7300 c-27 -4 -93 -19 -145 -33 -168 -46 -216 -50 -590 -52 -407 -2 -448 -8 -643 -99 -174 -81 -384 -245 -475 -371 -20 -27 -55 -72 -77 -100 -128 -159 -143 -312 -62 -615 25 -97 53 -222 61 -278 8 -57 22 -114 31 -129 27 -41 23 -116 -9 -158 -14 -19 -29 -49 -33 -67 -24 -126 -204 -185 -303 -101 -71 61 -137 51 -179 -27 -77 -145 -264 -113 -264 46 0 83 30 115 138 146 66 18 80 45 57 102 -36 87 -24 207 41 409 60 187 64 217 47 342 -19 133 -130 288 -259 362 -105 61 -171 112 -262 202 -327 328 -504 398 -759 300 -134 -51 -202 -101 -254 -188 -35 -57 -99 -109 -241 -193 -81 -48 -194 -67 -450 -74 -357 -9 -385 -50 -184 -272 84 -92 87 -192 9 -354 -31 -65 -42 -75 -254 -252 -376 -313 -471 -453 -483 -711 -9 -197 5 -210 257 -218 286 -10 436 -70 528 -215 73 -113 65 -193 -43 -412 -107 -216 -130 -315 -106 -470 22 -141 122 -384 214 -513 24 -34 58 -89 77 -122 18 -33 59 -95 91 -138 33 -44 59 -83 59 -88 0 -6 32 -68 71 -140 96 -175 116 -182 204 -66 28 36 69 79 91 95 23 17 68 63 102 104 177 218 411 256 437 71 11 -86 -69 -295 -150 -393 -101 -121 -89 -272 25 -305 14 -4 45 -20 70 -35 25 -16 57 -31 71 -35 14 -3 66 -39 116 -80 100 -82 111 -101 193 -310 119 -305 187 -434 272 -517 21 -21 38 -44 38 -52 0 -8 18 -36 40 -61 22 -26 47 -61 54 -79 17 -40 395 -422 431 -436 53 -20 104 21 160 129 19 38 441 461 500 501 23 16 73 59 111 97 38 37 87 81 109 98 22 16 65 54 95 85 31 30 101 96 157 147 55 51 118 118 139 150 21 32 54 77 73 99 173 199 207 409 113 689 -49 146 -32 270 43 319 150 98 609 21 855 -143 30 -21 75 -49 100 -63 25 -14 60 -44 78 -67 182 -227 288 -30 382 708 10 75 49 178 153 402 103 221 104 321 6 517 -42 84 -60 108 -95 133 -24 16 -48 38 -54 49 -6 10 -48 62 -94 114 -168 192 -121 272 245 412 52 19 148 46 213 60 134 27 143 32 152 81 21 110 155 143 238 58 117 -120 180 20 75 166 -11 15 -26 45 -33 66 -19 55 -69 148 -113 214 -21 31 -60 89 -87 129 -62 91 -262 300 -337 350 -31 21 -63 50 -73 64 -9 14 -36 38 -59 53 -147 92 -218 214 -267 461 -67 329 -192 527 -325 511 -5 -1 -32 -5 -60 -9z'
const FOGLIA_TRASFORMA_BASE = 'translate(0,800) scale(0.1,-0.1)'
// il modulo del fattore di scala già incluso in FOGLIA_TRASFORMA_BASE: il path
// lo attraversa OLTRE allo scale(f.scala) di piazzamento, quindi la larghezza
// del tratto va compensata per il prodotto dei due, non solo per f.scala
const FOGLIA_SCALA_BASE = 0.1
const FOGLIA_PICCIOLO = { x: 350.2, y: 282.3 }
const FOGLIA_PUNTA = { x: 369.4, y: 728.5 }
const FOGLIA_ALTEZZA = 659.5
const FOGLIA_ASSE = Math.atan2(FOGLIA_PUNTA.y - FOGLIA_PICCIOLO.y, FOGLIA_PUNTA.x - FOGLIA_PICCIOLO.x)

// Da un punto d'innesto e una tangente produce il piazzamento di UNA foglia:
// si aggancia col picciolo esattamente sul punto (mai un offset — è lì che si
// stacca dal ramoscello) e ruota finché il proprio asse naturale
// (picciolo→punta) non è allineato alla tangente data: la foglia prosegue il
// moto del ramoscello. `rotazione` aggiunge un piccolo scarto (varietà
// organica), `scala` moltiplica `altezza` (px) foglia per foglia.
function generaFoglia(punto, tangente, opzioni) {
  const { rotazione, scala, altezza } = opzioni
  const angoloVoluto = Math.atan2(tangente.y, tangente.x) + (rotazione * Math.PI) / 180
  const rotazioneGradi = ((angoloVoluto - FOGLIA_ASSE) * 180) / Math.PI
  return {
    x: punto.x,
    y: punto.y,
    rotazione: arrotonda(rotazioneGradi),
    // la scala è tipicamente ~0.04-0.1: arrotonda (1 decimale) la schiaccerebbe
    // sempre sullo stesso 0.1, cancellando la variazione voluta tra le foglie
    scala: Math.round(((altezza * scala) / FOGLIA_ALTEZZA) * 1000) / 1000,
  }
}

// Il ramoscello che porta la foglia: STESSA logica di crescita dei rami
// maggiori (`catenaGambo`, tangente all'innesto, poi svolta verso `lato` col
// profilo 1−(1−t)²) ma corto e senza ricciolo finale — la foglia stessa ne è
// la conclusione, agganciata tangente alla PUNTA del ramoscello.
function generaRamoscello(nodo, tangenteLinea, opzioni) {
  const { lato, lunghezza, scala, rotazione, altezza } = opzioni
  const L = lunghezza * scala
  const senso = lato === 'destra' ? 1 : -1
  const M = Math.max(3, Math.round(L / 12))
  const gambo = catenaGambo(nodo, tangenteLinea, L, 1.1, senso, M)
  const punta = gambo[M]
  const tangentePunta = normalizza(punta.x - gambo[M - 1].x, punta.y - gambo[M - 1].y)
  return {
    stelo: spline(gambo),
    foglia: generaFoglia(punta, tangentePunta, { scala, rotazione, altezza }),
  }
}

// La funzione centrale: dall'array di nodi [{x, y, asola?, ramo?, foglia?}]
// produce { mainBranch, subBranches, leaves }. Il path principale è tutti i
// nodi PIÙ i punti campionati di ogni asola incontrata, accodati in un unico
// array e affidati a UNA sola passata di splineSegmento: nessuna giunzione
// fra "tratta" e "asola", tutta la linea è la stessa spline Catmull-Rom da
// un capo all'altro (vedi costruisciCappio).
//
// Mentre il path viene emesso, un campionatore accumula punti e lunghezza
// cumulata della linea madre (pura aritmetica): da lì escono le frazioni
// `progresso` a cui ogni ramo e ogni foglia devono comparire. In passato le
// stesse frazioni venivano ricavate a valle con ~600 getPointAtLength sul
// path già montato: un long task da oltre un secondo che congelava il main
// thread (e il preloader) a ogni rigenerazione.
function generaViticcio(nodi, { ramo: opzioniRamo = {}, foglia: opzioniFoglia = {} } = {}) {
  // direzione di marcia al nodo: la stessa tangente (Catmull-Rom) che la
  // spline avrebbe lì, stimata dai nodi vicini
  const marcia = (i) => {
    const prima = nodi[Math.max(i - 1, 0)]
    const dopo = nodi[Math.min(i + 1, nodi.length - 1)]
    return normalizza(dopo.x - prima.x, dopo.y - prima.y)
  }
  // campionatore della linea madre: punti in ordine di percorrenza, ognuno
  // con la lunghezza cumulata fin lì
  const campioni = [{ x: nodi[0].x, y: nodi[0].y, l: 0 }]
  let lunghezza = 0
  const campiona = (p) => {
    const u = campioni[campioni.length - 1]
    lunghezza += Math.hypot(p.x - u.x, p.y - u.y)
    campioni.push({ x: p.x, y: p.y, l: lunghezza })
  }
  const rami = []
  const foglie = []
  const percorso = [{ x: nodi[0].x, y: nodi[0].y }] // l'intera linea madre, un solo array di punti
  for (let i = 0; i < nodi.length; i++) {
    const nodo = nodi[i]
    if (i > 0) percorso.push({ x: nodo.x, y: nodo.y })
    if (nodo.ramo) rami.push(...generaRamo(nodo, marcia(i), { ...opzioniRamo, ...nodo.ramo }))
    if (nodo.foglia) {
      const { stelo, foglia } = generaRamoscello(nodo, marcia(i), { ...opzioniFoglia, ...nodo.foglia })
      rami.push({ d: stelo, inizio: nodo })
      foglie.push(foglia)
    }
    if (nodo.asola) {
      const direzione = nodo.asola.direzione ?? marcia(i)
      percorso.push(...arcoAsola(nodo, direzione, nodo.asola).punti)
    }
  }
  const d = `M ${arrotonda(nodi[0].x)} ${arrotonda(nodi[0].y)}${splineSegmento(percorso, null, null, campiona)}`
  // frazione della linea madre più vicina a un punto: allinea la comparsa di
  // rami e foglie al passaggio della punta sul loro innesto
  const frazione = (p) => {
    let migliore = 0
    let minimo = Infinity
    for (const c of campioni) {
      const distanza = (c.x - p.x) ** 2 + (c.y - p.y) ** 2
      if (distanza < minimo) {
        minimo = distanza
        migliore = c.l
      }
    }
    return Math.round((migliore / (lunghezza || 1)) * 10000) / 10000
  }
  return {
    mainBranch: d,
    subBranches: rami.map((r) => ({ d: r.d, progresso: frazione(r.inizio) })),
    leaves: foglie.map((f) => ({ ...f, progresso: frazione(f) })),
  }
}

// ---------------------------------------------------------------------------
// Ancoraggio al layout
// ---------------------------------------------------------------------------

// Posizione di layout via catena offsetTop/offsetLeft: immune ai transform
// inline che le reveal GSAP lasciano sugli elementi non ancora rivelati.
function rettangoloHTML(el, avvolgente) {
  let x = 0
  let y = 0
  for (let n = el; n && n !== avvolgente; n = n.offsetParent) {
    x += n.offsetLeft
    y += n.offsetTop
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

function rettangolo(el, avvolgente) {
  if (!el) return null
  if (el instanceof SVGElement) {
    // gli <svg> non hanno offsetTop: si parte dal genitore HTML (misurato in
    // coordinate di layout) e si aggiunge il delta dei bounding rect, che
    // elide le traslazioni comuni degli antenati; l'eventuale transform della
    // reveal sull'svg stesso viene neutralizzato leggendolo da GSAP.
    const genitore = rettangoloHTML(el.parentElement, avvolgente)
    const b = el.getBoundingClientRect()
    const pb = el.parentElement.getBoundingClientRect()
    return {
      x: genitore.x + (b.left - pb.left) - (Number(gsap.getProperty(el, 'x')) || 0),
      y: genitore.y + (b.top - pb.top) - (Number(gsap.getProperty(el, 'y')) || 0),
      w: b.width,
      h: b.height,
    }
  }
  return rettangoloHTML(el, avvolgente)
}

// Le frazioni fx/fy sono relative al rettangolo dell'ancora (possono uscire
// da [0,1] per punti oltre i bordi); dx/dy sono scostamenti in pixel.
// asola/ramo passano al generatore. Tarate sul layout reale: se una sezione
// cambia, rimisurare col DOM, non a occhio.
const CONFIGURAZIONI = [
  {
    // desktop ≥ lg: layout a due colonne
    nome: 'desktop',
    attivo: (larghezza) => larghezza >= BREAKPOINT_LG,
    spessoreLinea: 3.5,
    spessoreRamo: 2.5,
    foglia: { altezza: 46, lunghezza: 40 },
    // Pochi rami, AMPI: si staccano subito dalla linea (svolta) verso lo
    // spazio aperto, proseguono dritti per un lungo tratto e solo alla fine si
    // arricciano. Vivono dove, divergendo, trovano vuoto o il bordo esterno di
    // una foto da costeggiare (visibili, mai nascosti dietro l'immagine z-10),
    // senza toccare testo né sovrapporsi alla linea. Tarati con collisioni.mjs.
    nodi: ({ p, avvolgi, area }) => [
      p(area, 0.5, 0),
      // scavalca la foto del maso ed entra nel canale alla sua sinistra
      p('#azienda figure', 0.27, 0, { dy: -49 }),
      p('#azienda figure', 0.46, 0.085),
      p('#azienda figure', 1.214, 0.471),
      p('#azienda figure', -0.083, 0.637),
      // dall'angolo basso-sinistra della foto un ramo diverge nel vuoto sotto
      p('#azienda figure', -0.102, 0.948, {
        ramo: {
          lato: 'sinistra',
          punti: [
            { u: 50, v: 102 },
            { u: -68, v: 212 },
          ],
          // bobina a induttore che si apre leggermente a ventaglio: ogni
          // spira più stretta ruota di qualche grado rispetto alla precedente
          ricciolo: {
            spire: [{ ampiezza: 19 }, { ampiezza: 16, inclinazione: -24 }, { ampiezza: 14, inclinazione: -24 }],
          },
        },
      }),
      // ampia ansa a sinistra tra Azienda e Chi Siamo: il ramo più grande si
      // apre nel vuoto dell'ansa, con una biforcazione; nel vuoto appena sopra
      // una foglia segna il passaggio tra le due sezioni
      p('#chi-siamo', 0.3, -0.01, { foglia: { lato: 'destra', scala: 1.75, rotazione: 8 } }),
      p('#chi-siamo', 0.18, 0.048),
      p('#chi-siamo', 0.118, 0.123),
      p('#chi-siamo', 0.236, 0.219),
      // esce dall'angolo alto-destra del primo ritratto e ridiscende nel
      // canale (il gap tra le due colonne), senza mai entrare nel secondo
      // ritratto: resta sul margine sinistro, fuori dalla foto
      p('#chi-siamo figure', 0.89, 0.03),
      p('#chi-siamo figure', -0.05, 0.02, {}, 1),
      p('#chi-siamo figure', 1.12, 0.2, {}, 1),
      p('#chi-siamo figure', 1, 0.7, {}, 1),
      p('#chi-siamo figure', -0.1, 0.65, {}, 1),
      p('#chi-siamo figure', -0.139, 0.82, { asola: { raggio: 24, lato: 'sinistra' } }, 1),
      // giro completo attorno all'estremità destra del pulsante "Conoscici"
      p('#chi-siamo .btn-light', 0.598, -1.29),
            p('#chi-siamo .btn-light', 1.2, 0.29),
      // scavalca il panorama del territorio e scende nel canale a sinistra;
      // un'altra foglia nel vuoto tra Chi Siamo e Territorio, lato opposto
      // alla precedente per varietà
      p('#territorio figure', -0.117, -0.27, { foglia: { lato: 'destra', scala: 1.7, rotazione: -15 } }),
      p('#territorio figure', 0.693, -0.066),
      p('#territorio figure', 0.305, 0.138),
      p('#territorio figure', 0, 0.372),
      p('#territorio figure', -0.027, 0.468),
      p('#territorio figure', -0.014, 0.561),
      p('#territorio figure', -0.083, 0.774),

      // dall'angolo basso-sinistra del panorama un ramo diverge nel vuoto sotto
      p('#territorio figure', -0.083, 0.88, {
        ramo: {
          lato: 'destra',
          punti: [
            { u: 18, v: 42 },
            { u: 50, v: 92 },
            { u: 78, v: 142 },
          ],
          // qui invece la spirale piatta ripristinata, che si stringe verso
          // il centro in un giro e mezzo
          ricciolo: { tipo: 'piatta', ampiezza: 9, giri: 2, restringimento: 0.88 },
        },
      }),
      // Attraversa la fascia "I nostri vini" nel canale libero a destra del
      // titolo: i nodi sono ancorati al filo destro (indice 1) proprio perché
      // quel filo È il canale — nasce dove il titolo finisce e arriva al
      // bordo, quindi la linea resta larga dal testo a ogni larghezza senza
      // ritarature. Attraversa il filo: è una decorazione, l'intreccio ci sta.
      p('.vini-filo', 0.12, 0, { dy: -78 }, 1),
      p('.vini-filo', 0.22, 0, {}, 1),
      p('.vini-filo', 0.1, 0, { dy: 78 }, 1),
      // aggira la bottiglia: entra da sinistra, le gira dietro e riemerge.
      // Nel vuoto scuro a destra della bottiglia il ramo più elaborato.
      // Il nodo d'ingresso è sceso da -0.199 a -0.02: la fascia costringe la
      // linea nel canale a destra fino a 18 px sopra il vecchio ingresso, e
      // rientrare a sinistra in quello spazio era un gomito. Più in basso, la
      // rientranza torna una curva.
      p('.sf-bottle', -1.02, -0.02),
      p('.sf-bottle', -0.29, 0.267),
      p('.sf-bottle', -0.14, 0.482, { asola: { raggio: 27, lato: 'sinistra' } }),
      p('.sf-bottle', 0.5, 0.643),
      p('.sf-bottle', 1.05, 0.755),
      p('.sf-bottle', 1.51, 0.894),
      p('.sf-bottle', 0.93, 1.038),
      // sotto la bottiglia, dove la linea se ne va netta verso ComingSoon, un
      // ramo ampio diverge nel vuoto e si biforca — senza intrecci con la linea
      p('.sf-bottle', -0.6, 1.163, {
        ramo: {
          lato: 'destra',
          punti: [
            { u: 20, v: 48 },
            { u: 58, v: 108 },
            { u: 90, v: 168 },
                ],
                        ricciolo: {
                spire: [
                  { ampiezza: 18, spaziatura: 20 },
                  { ampiezza: 15, spaziatura: 25 },
                  { ampiezza: 12, spaziatura: 25 },
                ],
              },
          figli: [
            {
              lato: 'sinistra',
              da: 2,
              punti: [
                { u: 18, v: 38 },
                { u: 42, v: 80 },
              ],
              // il ricciolo funziona anche su un sotto-ramo (secondario):
              // qui spire più larghe e più distanziate del solito
            },
          ],
        },
      }),
      // planata finale sulla prima goccia del logo di Coming soon; ultima
      // foglia nel vuoto tra San Florian e Coming soon, la più grande delle tre
      p('#coming-soon svg', 1.04, -2.41, { foglia: { lato: 'destra', scala: 1.3, rotazione: 20 } }),
      p('#coming-soon svg', 0.47, -1.7),
      p('#coming-soon svg', 0.23, -1.21, { asola: { raggio: 17, lato: 'destra' } }),
      p('#coming-soon svg', 0.5, -0.1

        
      ),
    ],
  },
  {
    // mobile < md: colonna singola, la linea serpeggia lungo i margini
    nome: 'mobile',
    attivo: (larghezza) => larghezza < BREAKPOINT_MD,
    spessoreLinea: 2.5,
    spessoreRamo: 1.75,
    foglia: { altezza: 30, lunghezza: 28 },
    // Su mobile lo spazio è pochissimo: niente rami verso il margine (px-5 ≈
    // 20px) né accanto alle foto (finirebbero nascosti dietro). I pochi rami
    // ampi vivono solo nel vuoto attorno alla bottiglia, dove divergendo
    // trovano spazio reale. Tarato con collisioni.mjs.
    nodi: ({ p, avvolgi, area }) => [
      p(area, 0.5, 0),
      // scende lungo il margine destro del testo dell'Azienda
      p('#azienda h2', 1.028, 0.15),
      p('#azienda .space-y-5', 1.03, 0.6),
      p('#azienda .space-y-5', 1.028, 0.93),
      // scavalca la foto del maso da destra e le esce sotto a sinistra
      p('#azienda figure', 0.82, -0.19),
      p('#azienda figure', 0.73, 0),
      p('#azienda figure', 0.28, 0.775),
      p('#azienda figure', 0.2, 1),
      p('#azienda figure', 0.24, 1.14, { foglia: { lato: 'destra', scala: 1.6, rotazione: -10 }}),
      // scavalca il primo ritratto restando sul bordo alto (fy quasi 0) e
      // scende lungo il margine sinistro, senza mai entrare nella parte
      // centrale della foto, poi ridiscende lungo il secondo
      p('#chi-siamo figure', 1.02, -0.18),
      p('#chi-siamo figure', 1.024, -0.07),
      p('#chi-siamo figure', 0.94, 0),
      p('#chi-siamo figure', 0.4, 0.02),
      p('#chi-siamo figure', 0.05, 0.15),
      p('#chi-siamo figure', 0, 0.46),
      // scavalca il secondo ritratto restando SOPRA di esso (fy negativo) e poi
      // ridiscende lungo il MARGINE destro (fx>1, oltre il bordo del testo
      // bio), senza mai attraversarne la parte centrale, e rientra sotto la
      // bio, nel gap prima del pulsante — così non taglia mai il testo di Andrea
      p('#chi-siamo figure', -0.029, -0.31, {}, 1),
      p('#chi-siamo figure', -0.029, -0.04, {}, 1),
      p('#chi-siamo figure', 0.9, -0.02, {}, 1),
      p('#chi-siamo figure', 1.03, 0.15, {}, 1),
      p('#chi-siamo figure', 1.03, 0.42, {}, 1),
      p('#chi-siamo figure', 1.04, 0.66, {}, 1),
      p('#chi-siamo figure', 1.04, 0.95, {}, 1),
      p('#chi-siamo figure', 1.0, 1.16, {}, 1),
      // Niente avvolgimento del pulsante su mobile: la bio di Andrea occupa
      // tutta la larghezza tra foto e pulsante, e qualsiasi rientro verso il
      // cap sfiorerebbe le ultime righe. La linea resta nel margine destro
      // (dove il pulsante, allineato a sinistra, lascia spazio libero) e
      // prosegue dritta verso il Territorio — il pulsante è z-10 comunque.
      // foglia nel vuoto tra Chi Siamo e Territorio
      p('#chi-siamo .btn-light', 1, 1.2, { foglia: { lato: 'sinistra', scala: 1, rotazione: -10 } }),
      // margine destro del testo del Territorio, poi scavalca il panorama
      p('#territorio .territorio-content', 0.5, -0.25, {
        ramo: {
          lato: 'destra',
          punti: [
            { u: 30, v: 30 },
            { u: 62, v: 55 },
            { u: 80, v: 78 },
          ],
        },
      }),
      p('#territorio .territorio-content', -0.03, -0.05),
      p('#territorio .territorio-content', -0.025, 0.55),
      p('#territorio .territorio-content', -0.03, 0.95),
      p('#territorio figure', 0.94, 0),
      p('#territorio figure', 0.28, 0.72),
      p('#territorio figure', 0.28, 1),
      // Seconda foglia: il vuoto tra Territorio e San Florian ora è occupato
      // dalla fascia "I nostri vini", quindi la foglia risale nella striscia
      // che resta sopra la fascia — mai a cavallo del suo bordo.
      p('#territorio figure', 0.32, 1.06, { foglia: { lato: 'destra', scala: 1, rotazione: 10 } }),
      // Attraversa la fascia nel canale libero a sinistra del titolo, ancorata
      // al filo sinistro (indice 0), che quel canale lo delimita da sé a ogni
      // larghezza. Vedi la nota gemella nella configurazione desktop.
      p('.vini-filo', 0.4, 0, { dy: -58 }, 0),
      p('.vini-filo', 0.3, 0, {}, 0),
      p('.vini-filo', 0.55, 0, { dy: 58 }, 0),
      // costeggia il testo di San Florian e aggira la bottiglia
      p('#san-florian .grid > div', 1.028, 0.05),
      p('#san-florian .grid > div', 1.037, 0.55),
      p('#san-florian .grid > div', 1.028, 0.95),
      p('.sf-bottle', 1.81, 0.043),
      p('.sf-bottle', 1.16, 0.47, { asola: { raggio: 22, lato: 'destra' } }),
      p('.sf-bottle', 0.7, 0.5),
      p('.sf-bottle', 0, 0.575),
      // ramo ampio nel vuoto a sinistra della bottiglia
      p('.sf-bottle', -0.34, 0.836, {
        ramo: {
          lato: 'destra',
          punti: [
            { u: 34, v: 58 },
            { u: 50, v: 88 }
          ],
          figli: [
            {
              lato: 'sinistra',
              da: 1,
              punti: [
                { u: 26, v: 46 },
              ],
            },
          ],
        },
      }),
      p('.sf-bottle', 0.37, 1.12),
      // planata finale sulla prima goccia del logo di Coming soon
      p('#coming-soon svg', 0.19, -1.37, { foglia: { lato: 'destra', scala: 0.85, rotazione: 12 } }),
      p('#coming-soon svg', 0.5, -0.05),
    ],
  },
]

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function Viticcio() {
  const contenitore = useRef(null)
  const firma = useRef('')
  const [stato, setStato] = useState(null)

  // Misura il layout e rigenera i tracciati: al primo sf:ready (il preloader
  // garantisce font e immagini caricati), a ogni resize della finestra e a
  // ogni variazione di altezza del contenuto (ResizeObserver sul wrapper).
  useEffect(() => {
    const avvolgente = contenitore.current.parentElement

    const misura = () => {
      // Prima di sf:ready il viticcio è coperto dal preloader e font e
      // immagini in arrivo cambierebbero il layout più volte: ogni misura
      // sarebbe lavoro buttato che ruba main thread all'animazione di
      // caricamento. La prima misura vera la innesca quandoPronto.
      if (!document.documentElement.dataset.ready) return
      // Mentre l'overlay zoom di San Florian è attivo la bottiglia è `fixed` e
      // la pagina si accorcia: rigenerare qui i tracciati blocca l'animazione
      // del Flip. Il viticcio è comunque coperto dall'overlay; SanFlorian
      // rilancia `sf:relayout` a chiusura completata.
      if (document.documentElement.dataset.sfZoom) return
      const config = CONFIGURAZIONI.find((c) => c.attivo(window.innerWidth))
      if (!config) {
        firma.current = ''
        setStato(null)
        return
      }
      const area = { x: 0, y: 0, w: avvolgente.offsetWidth, h: avvolgente.offsetHeight }
      // le stesse ancore ricorrono in molti nodi: una sola query per selettore
      const cache = new Map()
      const trova = (sel, indice) => {
        if (!cache.has(sel)) cache.set(sel, document.querySelectorAll(sel))
        return cache.get(sel)[indice]
      }
      const p = (ancora, fx, fy, opzioni = {}, indice = 0) => {
        const r =
          typeof ancora === 'string' ? rettangolo(trova(ancora, indice), avvolgente) : ancora
        if (!r) return null
        return {
          ...opzioni,
          x: r.x + fx * r.w,
          y: r.y + fy * r.h + (opzioni.dy || 0),
        }
      }
      const avvolgi = (sel) => {
        const r = rettangolo(trova(sel, 0), avvolgente)
        return r ? nodoAvvolgimento(r) : null
      }
      const nodi = config.nodi({ p, avvolgi, area }).filter(Boolean)
      const tracciati = generaViticcio(nodi, { ramo: config.ramo, foglia: config.foglia })
      const chiave = [config.nome, tracciati.mainBranch, ...tracciati.subBranches.map((r) => r.d)].join('|')
      if (chiave === firma.current) return // evita il ciclo col ResizeObserver
      firma.current = chiave
      setStato({ w: area.w, h: area.h, config, ...tracciati })
    }

    let timer
    const misuraDebounced = () => {
      clearTimeout(timer)
      timer = setTimeout(misura, 150)
    }
    const annullaPronto = quandoPronto(misura)
    window.addEventListener('sf:relayout', misura)
    window.addEventListener('resize', misuraDebounced)
    const osservatore = new ResizeObserver(misuraDebounced)
    osservatore.observe(avvolgente)
    return () => {
      clearTimeout(timer)
      annullaPronto()
      window.removeEventListener('sf:relayout', misura)
      window.removeEventListener('resize', misuraDebounced)
      osservatore.disconnect()
    }
  }, [])

  // Disegno progressivo scrubbato con lo scroll; ogni ramo e ogni foglia si
  // rivelano quando la punta della linea madre passa sul loro innesto: la
  // frazione è già calcolata in generazione (data-progresso), qui si legge e
  // basta. Con prefers-reduced-motion il viticcio resta statico, già disegnato.
  useGSAP(
    () => {
      if (!stato || riduciMovimento()) return
      const svg = contenitore.current.querySelector('svg')
      const linea = svg.querySelector('.viticcio-linea')
      const lunghezza = linea.getTotalLength()
      gsap.set(linea, { strokeDasharray: lunghezza, strokeDashoffset: lunghezza })
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: contenitore.current,
          start: 'top 75%',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })
      timeline.to(linea, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
      svg.querySelectorAll('.viticcio-ramo').forEach((ramo) => {
        const l = ramo.getTotalLength()
        gsap.set(ramo, { strokeDasharray: l, strokeDashoffset: l })
        timeline.to(ramo, { strokeDashoffset: 0, ease: 'none', duration: 0.05 }, Number(ramo.dataset.progresso))
      })
      svg.querySelectorAll('.viticcio-foglia').forEach((foglia) => {
        const contorno = foglia.querySelector('path')
        const l = contorno.getTotalLength()
        gsap.set(contorno, { strokeDasharray: l, strokeDashoffset: l })
        timeline.to(contorno, { strokeDashoffset: 0, ease: 'none', duration: 0.08 }, Number(foglia.dataset.progresso))
      })
    },
    { scope: contenitore, dependencies: [stato], revertOnUpdate: true }
  )

  return (
    <div ref={contenitore} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {stato && (
        <svg
          className="absolute inset-0 h-full w-full text-tortora"
          viewBox={`0 0 ${stato.w} ${stato.h}`}
          preserveAspectRatio="none"
          fill="none"
        >
          {/* opacità sul gruppo, non sui singoli tratti: gli innesti dei rami
              si sovrappongono alla linea madre e resterebbero visibili */}
          <g opacity="0.6">
            <path
              className="viticcio-linea"
              d={stato.mainBranch}
              stroke="currentColor"
              strokeWidth={stato.config.spessoreLinea}
              strokeLinecap="round"
            />
            {stato.subBranches.map((ramo) => (
              <path
                key={ramo.d}
                className="viticcio-ramo"
                d={ramo.d}
                data-progresso={ramo.progresso}
                stroke="currentColor"
                strokeWidth={stato.config.spessoreRamo}
                strokeLinecap="round"
              />
            ))}
            {stato.leaves.map((f, i) => (
              <g
                key={i}
                className="viticcio-foglia"
                data-progresso={f.progresso}
                transform={`translate(${f.x} ${f.y}) rotate(${f.rotazione}) scale(${f.scala}) translate(${-FOGLIA_PICCIOLO.x} ${-FOGLIA_PICCIOLO.y})`}
              >
                <g transform={FOGLIA_TRASFORMA_BASE}>
                  <path
                    d={FOGLIA_D}
                    stroke="currentColor"
                    strokeWidth={stato.config.spessoreLinea / (f.scala * FOGLIA_SCALA_BASE)}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            ))}
          </g>
        </svg>
      )}
    </div>
  )
}
