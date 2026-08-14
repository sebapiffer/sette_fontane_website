// Contratti condivisi sul "contesto pagina", definiti in un punto solo:
// preferenza di movimento ridotto, breakpoint e i due segnali d'apertura
// (flag + evento, così chi monta dopo non li perde). Producer e consumer
// importano da qui: nessuno riscrive la stringa dell'evento o la codifica del
// flag per conto suo.

export const riduciMovimento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Le stesse soglie md/lg di Tailwind: la logica JS che decide layout
// (Viticcio, SanFlorian) deve restare allineata alle utility md:/lg: del markup.
export const BREAKPOINT_MD = 768
export const BREAKPOINT_LG = 1024

// I due momenti dell'apertura hanno la stessa meccanica: flag sul <html> (per
// chi arriva dopo) + evento (per chi è già in ascolto), e scattano una volta
// sola. `quando…` esegue subito se il momento è già passato — nessuno resta ad
// aspettare per sempre un segnale emesso prima che si mettesse in ascolto — e
// ritorna la funzione di annullamento.
function creaSegnale(evento, flag) {
  return [
    function segnala() {
      if (document.documentElement.dataset[flag]) return
      document.documentElement.dataset[flag] = '1'
      window.dispatchEvent(new CustomEvent(evento))
    },
    function quando(fn) {
      if (document.documentElement.dataset[flag]) {
        fn()
        return () => {}
      }
      window.addEventListener(evento, fn, { once: true })
      return () => window.removeEventListener(evento, fn)
    },
  ]
}

// 1. CARICATO — il Preloader ha finito la sua attesa e si è tolto di mezzo.
// Scoprendosi rivela l'age gate, che sta sotto di lui e su questo segnale entra
// in scena: è il momento in cui la schermata di caricamento passa la mano alla
// soglia, non ancora al sito.
export const [segnalaCaricato, quandoCaricato] = creaSegnale('sf:caricato', 'caricato')

// 2. PRONTO — si è entrati davvero (age gate passato): è qui che si alza il
// sipario e parte tutto il resto (apertura della hero, scroll fluido, viticcio,
// reveal). Chi ha un'entrata al montaggio deve agganciarsi a QUESTO, o suonerà
// dietro un overlay ancora chiuso.
export const [segnalaPronto, quandoPronto] = creaSegnale('sf:ready', 'ready')
