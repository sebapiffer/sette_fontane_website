import { getLenis } from './lenis.js'

// Blocco dello scroll a chiavi. Preloader e age gate coprono la pagina nello
// stesso momento e ognuno la vuole ferma: se ciascuno scrivesse direttamente
// body.overflow, il primo che si toglie sbloccherebbe anche per l'altro — il
// preloader finisce di caricare mentre l'age gate è ancora in scena, e la
// pagina tornerebbe scrollabile sotto l'overlay. Ognuno prende e rilascia la
// propria chiave; si sblocca quando non ne resta nessuna.
const chiavi = new Set()

export function bloccaScroll(chiave) {
  chiavi.add(chiave)
  if (chiavi.size !== 1) return
  document.body.style.overflow = 'hidden'
  // Lenis guida window.scrollTo per conto suo: overflow:hidden da solo non lo
  // fermerebbe (qui è quasi sempre ancora da creare — nasce su `sf:ready` —
  // ma il blocco non deve dipendere da quell'ordine).
  getLenis()?.stop()
}

export function sbloccaScroll(chiave) {
  if (!chiavi.delete(chiave) || chiavi.size) return
  document.body.style.overflow = ''
  getLenis()?.start()
}
