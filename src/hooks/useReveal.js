import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import { quandoPronto } from '../lib/ambiente.js'

// Reveal condiviso: i testi [data-reveal] entrano in fade-up, i titoli
// [data-reveal-words] parola per parola da sotto la propria maschera, le
// immagini [data-reveal-img] si scoprono con una tendina (clip-path).
// Lo stesso linguaggio ovunque nel sito; con prefers-reduced-motion tutto
// resta semplicemente visibile.
//
// L'entrata è AGGANCIATA ALLO SCROLL (scrub): ogni elemento ha il proprio
// ScrollTrigger e avanza mentre l'elemento attraversa la finestra, invece di
// far partire un'animazione a tempo che poi corre per conto suo. È la
// differenza fra "il testo appare quando scrolli" e "il testo sale mentre
// scrolli": la seconda è quella che dà il passo lento e controllato: chi
// legge conduce il movimento, e tornando indietro il testo si ritira.
// Lo scrub è morbido (SCRUB secondi di inseguimento) perché la pagina è
// guidata da Lenis: un aggancio rigido restituirebbe il micro-tremolio della
// rotellina, con un filo di ritardo la salita resta setosa.
//
// Eccezione dichiarata: quello che è GIÀ IN PRIMA SCHERMATA al montaggio
// (l'intestazione delle sottopagine) non può dipendere dallo scroll — senza
// scroll resterebbe invisibile, e in cima alla pagina lo scroll a monte non
// esiste. Quegli elementi conservano l'entrata a tempo di sempre, in
// sequenza: è l'apertura della pagina, non un reveal di lettura.
export default function useReveal() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Inseguimento dello scroll, in secondi.
        const SCRUB = 0.6
        // La corsa del reveal: comincia appena l'elemento entra dal bordo
        // basso e si chiude quando ha superato la metà della finestra —
        // dentro c'è tutta la salita, e la si legge finita ben prima che
        // l'elemento esca di scena.
        const INIZIO = 'top 88%'
        const FINE = 'top 50%'
        // Al fondo pagina la corsa non ci starebbe — lo scroll finisce prima
        // che il footer arrivi a metà finestra, e senza clamp() gli ultimi
        // blocchi resterebbero invisibili per sempre (misurato: l'ultimo
        // [data-reveal] del footer si fermava a opacità 0). clamp() riporta
        // gli estremi dentro i limiti scrollabili. Si può usare senza rischi
        // perché qui passano SOLO gli elementi sotto la piega: per quelli in
        // prima schermata clamp riporterebbe a scroll 0 un attacco già
        // superato, lasciandoli da rivelare — e infatti prendono l'altra
        // strada (l'apertura a tempo).
        const traccia = (trigger) => ({
          trigger,
          start: `clamp(${INIZIO})`,
          end: `clamp(${FINE})`,
          scrub: SCRUB,
        })

        // Sopra la piega al montaggio → entrata a tempo; sotto → agganciato
        // allo scroll. La misura vale per la schermata iniziale: qui lo
        // scroll è a 0 (preloader sulla Home, ScrollToTop sulle sottopagine).
        const inPrimaSchermata = (el) =>
          el.getBoundingClientRect().top < window.innerHeight * 0.9
        const dividi = (selettore) => {
          const tutti = gsap.utils.toArray(selettore, ref.current)
          return [tutti.filter(inPrimaSchermata), tutti.filter((el) => !inPrimaSchermata(el))]
        }

        // L'apertura a tempo è in pausa e parte su `sf:ready`: al montaggio il
        // preloader copre ancora tutto e la sequenza suonerebbe a sipario
        // chiuso (stessa regola della hero).
        const apertura = gsap.timeline({ paused: true })
        const annullaPronto = quandoPronto(() => apertura.play())

        const [testiSubito, testiAlloScroll] = dividi('[data-reveal]')

        // ── Vocabolario delle entrate ────────────────────────────────────
        // Il gesto del sito è UNO: l'inchiostro. Tutto il testo entra così,
        // dagli occhielli alle didascalie ai paragrafi — è quello che dà
        // l'impressione di una pagina che viene scritta mentre la si scorre,
        // invece di un catalogo di effetti. Gli altri gesti restano nel
        // vocabolario ma nessuno li assegna più da solo: si chiedono a mano
        // nel markup con data-reveal="righe" | "tendina" | "lettere".
        //
        // Nessuno usa maschere overflow-hidden: il testo del sito va dalla
        // prosa con interlinea larga agli eyebrow strettissimi, e una maschera
        // aderente alla line-box rade discendenti e accenti — è lo stesso
        // problema che SplitHeading risolve a mano coi suoi padding, e qui
        // costerebbe una taratura per ogni classe di testo. Il taglio netto
        // resta un privilegio dei titoli.
        const VARIANTI = {
          // Le parole si INCHIOSTRANO una dopo l'altra, come se il testo
          // venisse scritto. Non si muovono: l'enfasi sta tutta nel modo in
          // cui arrivano a fuoco e nel colore.
          //
          // Tre cose insieme, e nessuna è uno spostamento:
          // — la parola nasce SFOCATA e mette a fuoco (blur 9px → 0): è il
          //   gesto dell'inchiostro che si asciuga, l'unico modo di dare peso
          //   a un'entrata ferma senza farla traslare;
          // — nasce TORTORA e vira al proprio colore. È il colore del logo e
          //   del viticcio, quindi l'inchiostro del sito è letteralmente
          //   l'accento di brand che si posa e si spegne nel testo. Funziona
          //   su entrambi i fondi: tortora si legge sia sull'antracite sia
          //   sulla creta, quindi la parola non sparisce mai a metà strada;
          // — l'onda è lunga (passo 0.085, quasi il doppio di prima): la
          //   scrittura si vede attraversare il paragrafo invece di
          //   accendersi quasi tutta insieme.
          //
          // pulisci: blur e color vanno tolti a fine corsa. `filter` lasciato
          // inline, anche a blur(0px), promuove OGNI parola a livello di
          // composizione — su una pagina intera sono centinaia di livelli
          // tenuti in memoria per niente; e il colore inline scavalcherebbe
          // per sempre le classi Tailwind del testo.
          inchiostro: {
            divisione: 'words',
            parti: (s) => s.words,
            da: { autoAlpha: 0, filter: 'blur(9px)', color: '#A48A7B' },
            pulisci: 'filter,color',
            ease: 'power2.out',
            passo: 0.085,
            durata: 1.1,
          },
          // La riga sale e sfuma: il paragrafo si compone mentre scende.
          // L'unità di lettura è la riga, quindi è la riga che si scopre.
          righe: {
            divisione: 'lines',
            parti: (s) => s.lines,
            da: { yPercent: 55, autoAlpha: 0 },
            ease: 'power3.out',
            passo: 0.09,
          },
          // Tendina: ogni riga si scopre da sinistra a destra, nel verso della
          // lettura. Nessuna dissolvenza — è un taglio che avanza, e per
          // questo va sui testi brevi (didascalie), dove si legge come un
          // gesto e non come un'attesa.
          tendina: {
            divisione: 'lines',
            parti: (s) => s.lines,
            da: { clipPath: 'inset(0 100% 0 0)' },
            ease: 'power2.inOut',
            passo: 0.14,
            durata: 1.15,
          },
          // Lettera per lettera, con un filo di salita. Vive solo sugli
          // eyebrow: sono maiuscoletti spaziati di 0.35em, dove le lettere
          // sono già oggetti separati e la cascata si legge come una
          // composizione tipografica. Su un paragrafo sarebbe insopportabile.
          lettere: {
            divisione: 'chars',
            parti: (s) => s.chars,
            da: { yPercent: 45, autoAlpha: 0 },
            ease: 'power2.out',
            passo: 0.022,
          },
        }

        // Chi prende quale gesto: l'inchiostro, tutti. L'unica cosa che resta
        // da decidere è se un elemento sia testo o impaginazione.
        const sezioni = [...document.querySelectorAll('section, footer')]
        const indiceSezione = (el) => sezioni.indexOf(el.closest('section, footer'))

        // Che cosa si spezza. Una CORSA DI TESTO è un elemento di testo che
        // non contiene blocchi: si spezza in parole direttamente.
        const CORSE = 'p, h1, h2, h3, h4, h5, h6, figcaption, blockquote, li, dt, dd'
        const BLOCCHI_DENTRO = 'p, div, ul, ol, li, figure, table, h1, h2, h3, h4, h5, h6'
        // Elementi che non sono testo e che quindi NON possono essere animati
        // parola per parola: se un contenitore ne ha uno, il gesto giusto
        // resta il fade-up intero (il logo e le icone social del footer, il
        // div attorno a una CTA).
        const NON_TESTO = 'img, svg, video, button, input, select, textarea, [role="button"], .btn'
        const corsaDiTesto = (el) =>
          el.matches(CORSE) &&
          el.textContent.trim().length > 0 &&
          !el.querySelector(BLOCCHI_DENTRO) &&
          // I titoli SplitHeading hanno già il loro gesto (parole in maschera):
          // spezzarli una seconda volta li animerebbe due volte.
          !el.hasAttribute('data-reveal-words') &&
          !el.querySelector('.split-word')

        // I bersagli di un [data-reveal]: sé stesso se è una corsa di testo,
        // altrimenti le corse di testo che contiene — purché sia un
        // contenitore di solo testo. Le didascalie di ChiSiamo sono
        // esattamente questo caso (nome, ruolo e bio dentro una figcaption):
        // prima venivano escluse perché "contengono blocchi", e restavano
        // l'unico testo del sito senza inchiostro. Con più bersagli si passa
        // UN solo split e UNA sola tween, così lo stagger scorre attraverso
        // tutto il blocco invece di ripartire da capo a ogni paragrafo.
        const bersagli = (el) => {
          if (el.dataset.reveal === 'blocco') return null
          if (corsaDiTesto(el)) return [el]
          if (el.querySelector(NON_TESTO)) return null
          const dentro = [...el.querySelectorAll(CORSE)].filter(corsaDiTesto)
          return dentro.length ? dentro : null
        }

        // Il gesto: l'inchiostro per tutti, salvo richiesta esplicita nel
        // markup (data-reveal="righe" | "tendina" | "lettere").
        const variante = (el) => VARIANTI[el.dataset.reveal] ? el.dataset.reveal : 'inchiostro'

        const splits = []

        // autoSplit: SplitText rifà da sé la divisione quando i font arrivano
        // (le righe cambierebbero di posto) e a ogni cambio di larghezza —
        // l'a-capo dipende dal viewport, una divisione congelata al montaggio
        // sarebbe sbagliata al primo resize. onSplit restituisce l'animazione
        // e SplitText la ricrea insieme alle parti.
        const spezzaEAnima = (bersagli, nome, costruisci) => {
          const v = VARIANTI[nome]
          splits.push(
            SplitText.create(bersagli, {
              type: v.divisione,
              linesClass: 'riga',
              autoSplit: true,
              onSplit: (self) => costruisci(v, v.parti(self)),
            })
          )
        }

        testiSubito.forEach((el) => {
          const parti = bersagli(el)
          if (!parti) return
          spezzaEAnima(parti, variante(el), (v, parti) =>
            // Aggiunta alla timeline d'apertura, non lanciata: se autoSplit
            // rifà la divisione dopo che l'apertura è già finita, la nuova
            // tween nasce su una timeline a fine corsa e si rende subito allo
            // stato finale — il testo resta dov'è invece di rientrare da capo.
            apertura.from(
              parti,
              {
                ...v.da,
                clearProps: v.pulisci,
                duration: (v.durata ?? 1) * 0.9,
                ease: v.ease,
                // A tempo il passo è più fitto che a scrub: qui non c'è lo
                // scroll a dettare il ritmo, e una cascata lunga come quella
                // agganciata allo scroll sembrerebbe solo lenta.
                stagger: v.passo * 0.8,
              },
              0
            )
          )
        })

        const inBlocco = testiSubito.filter((el) => !bersagli(el))
        if (inBlocco.length) {
          apertura.from(
            inBlocco,
            {
              autoAlpha: 0,
              y: 36,
              duration: 0.9,
              ease: 'power2.out',
              stagger: 0.12,
              clearProps: 'transform',
            },
            0
          )
        }

        testiAlloScroll.forEach((el) => {
          const daSpezzare = bersagli(el)
          if (daSpezzare) {
            spezzaEAnima(daSpezzare, variante(el), (v, parti) =>
              gsap.from(parti, {
                ...v.da,
                clearProps: v.pulisci,
                // Con lo scrub la ease non è una curva nel tempo ma nello
                // spazio scrollato: le power.out portano presto la parte a
                // posto e poi la posano, invece di trascinarla per tutta la
                // corsa.
                ease: v.ease,
                duration: v.durata ?? 1,
                // Lo stagger diventa spaziale: le parti si scoprono una dopo
                // l'altra mentre si scende. Corto, perché un paragrafo lungo
                // non deve pretendere mezzo schermo di scroll per finire.
                stagger: { each: v.passo, from: 'start' },
                scrollTrigger: traccia(el),
              })
            )
            return
          }
          gsap.from(el, {
            autoAlpha: 0,
            y: 40,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: traccia(el),
          })
        })

        // Titoli spezzati in parole (SplitHeading): ogni parola scivola su da
        // sotto la propria maschera overflow-hidden, invece del fade in blocco
        // riservato al resto del testo. Con lo scrub lo stagger diventa
        // spaziale: le parole si scoprono una dopo l'altra man mano che si
        // scende, e la frase si compone alla velocità di chi legge.
        //
        // Anche i titoli variano di sezione in sezione, ma cambiando la
        // COREOGRAFIA e non il gesto: la salita dalla maschera è la firma del
        // sito e resta identica ovunque, mentre l'ordine in cui le parole
        // partono alterna fra la lettura naturale (dalla prima) e l'apertura
        // dal centro. Cambiare anche il gesto dei titoli — chi ruota, chi
        // sfuma — è esattamente il modo di far sembrare un sito una vetrina di
        // effetti; la varietà sta nel corpo del testo, i titoli tengono il filo.
        const ORDINI = ['start', 'center']
        const ordineTitolo = (titolo) => ORDINI[Math.max(indiceSezione(titolo), 0) % ORDINI.length]

        const [titoliSubito, titoliAlloScroll] = dividi('[data-reveal-words]')

        titoliSubito.forEach((titolo) => {
          const parole = titolo.querySelectorAll('.split-word')
          if (!parole.length) return
          apertura.from(
            parole,
            {
              yPercent: 110,
              autoAlpha: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: { each: 0.03, from: ordineTitolo(titolo) },
            },
            // Piccolo scarto: stacca il titolo dall'eyebrow che lo precede
            // nella stessa sequenza a tempo.
            0.08
          )
        })

        titoliAlloScroll.forEach((titolo) => {
          const parole = titolo.querySelectorAll('.split-word')
          if (!parole.length) return
          gsap.from(parole, {
            yPercent: 110,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.out',
            // `each` in unità di timeline: sommato alla duration definisce
            // quanta parte della corsa serve a completare la frase. Tenuto
            // corto — le parole si rincorrono, non sfilano una per volta.
            stagger: { each: 0.12, from: ordineTitolo(titolo) },
            scrollTrigger: traccia(titolo),
          })
        })

        // Le immagini seguono lo stesso principio, su una corsa più lunga: la
        // tendina è un gesto ampio e va letta mentre sale, non consumata in
        // mezzo schermo.
        const [immaginiSubito, immaginiAlloScroll] = dividi('[data-reveal-img]')

        const dallaTendina = { clipPath: 'inset(0% 0 100% 0)', scale: 1.14 }
        const aTendinaAperta = { clipPath: 'inset(0% 0 0% 0)', scale: 1 }

        if (immaginiSubito.length) {
          apertura.fromTo(
            immaginiSubito,
            dallaTendina,
            { ...aTendinaAperta, duration: 1.3, ease: 'power3.out', stagger: 0.15 },
            0
          )
        }

        immaginiAlloScroll.forEach((img) => {
          gsap.fromTo(img, dallaTendina, {
            ...aTendinaAperta,
            ease: 'power2.out',
            scrollTrigger: {
              ...traccia(img),
              start: 'clamp(top 95%)',
              end: 'clamp(top 45%)',
            },
          })
        })

        // Se il componente si smonta prima di `sf:ready` (cambio rotta a
        // preloader ancora in scena) l'ascolto va tolto: le tween muoiono con
        // il contesto di useGSAP, il listener no. Gli split vanno annullati a
        // mano: revert() rimette il testo originale nel DOM, altrimenti
        // resterebbero i <div class="riga"> di una divisione morta.
        return () => {
          annullaPronto()
          splits.forEach((s) => s.revert())
        }
      })
    },
    { scope: ref }
  )

  return ref
}
