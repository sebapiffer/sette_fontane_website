// Sfondo fotografico di sezione. L'immagine è decorativa (aria-hidden, alt
// vuoto: il contenuto informativo resta nelle figure) e sta DIETRO al testo,
// sotto un velo che ne garantisce il contrasto — la leggibilità viene prima
// dell'immagine, sempre: il velo si passa come `children` ed è tarato sezione
// per sezione sul punto in cui il testo cade davvero.
//
// Due vincoli di impilamento, entrambi legati al viticcio:
//  - la sezione che lo ospita dev'essere `relative overflow-hidden` ma NON
//    deve creare un contesto di impilamento (niente `isolate`, niente z-index
//    esplicito), altrimenti le figure `z-10` smettono di stare davanti alla
//    linea e l'intreccio si perde;
//  - il contenitore del contenuto va marcato `relative` e messo DOPO questo
//    sfondo nel DOM, così vi si dipinge sopra.
// Il viticcio, che nel wrapper viene dopo le sezioni, resta comunque sopra
// allo sfondo: la linea corre sulla fotografia, come deve.
export default function SfondoSezione({ src, opacita = 0.35, children }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ opacity: opacita }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {children}
    </div>
  )
}
