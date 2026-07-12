// Contratti condivisi sul "contesto pagina", definiti in un punto solo:
// preferenza di movimento ridotto, breakpoint e il segnale di pronto che il
// Preloader emette a caricamento finito (flag + evento, così chi monta dopo
// non lo perde). Producer e consumer importano da qui: nessuno riscrive la
// stringa dell'evento o la codifica del flag per conto suo.

export const riduciMovimento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Le stesse soglie md/lg di Tailwind: la logica JS che decide layout
// (Viticcio, SanFlorian) deve restare allineata alle utility md:/lg: del markup.
export const BREAKPOINT_MD = 768
export const BREAKPOINT_LG = 1024

// Il Preloader annuncia la pagina pronta: flag sul <html> (per chi arriva
// dopo) + evento (per chi è già in ascolto). Idempotente: la pagina diventa
// pronta una volta sola.
export function segnalaPronto() {
  if (document.documentElement.dataset.ready) return
  document.documentElement.dataset.ready = '1'
  window.dispatchEvent(new CustomEvent('sf:ready'))
}

// Esegue `fn` quando il preloader ha annunciato la pagina pronta — subito se
// è già successo. Ritorna la funzione di annullamento.
export function quandoPronto(fn) {
  if (document.documentElement.dataset.ready) {
    fn()
    return () => {}
  }
  window.addEventListener('sf:ready', fn, { once: true })
  return () => window.removeEventListener('sf:ready', fn)
}
