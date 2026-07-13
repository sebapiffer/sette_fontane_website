// Singolo punto di verità per l'istanza Lenis (scroll fluido): creata una
// sola volta da <SmoothScroll> in App.jsx. Chi deve spostare lo scroll a
// mano (es. ScrollToTop dopo un cambio rotta) legge da qui invece di
// chiamare window.scrollTo() direttamente — un window.scrollTo esterno
// verrebbe corretto (annullato) al frame successivo dal ciclo raf di Lenis,
// che insegue la propria posizione virtuale precedente.
let istanza = null

export function setLenis(lenis) {
  istanza = lenis
}

export function getLenis() {
  return istanza
}
