// Le due prese d'atto d'ingresso — maggiore età e informativa cookie — vivono
// qui: chiavi, lettura/scrittura e l'attesa che il resto del sito usa per non
// aprire le danze prima che l'utente sia entrato davvero.
//
// localStorage e non sessionStorage: la conferma vale per il browser, non per
// la singola scheda — chi torna sul sito, o apre una seconda pagina, non deve
// rispondere daccapo. Non è tracciamento e il banner resta veritiero: sono due
// valori scritti in locale, non lasciano il dispositivo, non vengono spediti a
// nessuno e non identificano nessuno.

export const CHIAVE_ETA = 'sf:eta-confermata'
export const CHIAVE_COOKIE = 'sf:cookie-letto'

// In navigazione privata (Safari) o con lo storage bloccato dalle preferenze
// del browser questi accessi lanciano: in quel caso il sito si comporta come
// alla prima visita — i popup ricompaiono, ma niente si rompe.
export function letto(chiave) {
  try {
    return window.localStorage.getItem(chiave) === '1'
  } catch {
    return false
  }
}

export function segna(chiave) {
  try {
    window.localStorage.setItem(chiave, '1')
  } catch {
    // Nessuno storage disponibile: la presa d'atto vale per questa visita.
  }
}

export const etaConfermata = () => letto(CHIAVE_ETA)

// L'apertura del sito (dissolvenza del preloader, sequenza della hero, scroll
// fluido) aspetta che l'age gate sia passato: senza questa attesa il sipario
// si alzerebbe dietro l'overlay e chi entra troverebbe l'animazione d'ingresso
// già finita. È una promise e non un evento perché chi la chiede DOPO la
// conferma deve trovarla già risolta (stessa regola di `quandoPronto`).
let apriIngresso
const ingresso = new Promise((res) => {
  apriIngresso = res
})
if (etaConfermata()) apriIngresso()

export function confermaEta() {
  segna(CHIAVE_ETA)
  apriIngresso()
}

export const attendiEta = () => ingresso
