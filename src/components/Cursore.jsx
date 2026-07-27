import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { riduciMovimento } from '../lib/ambiente.js'

// Cursore custom sul modello di kettmeir.com: un pallino tortora che insegue
// il puntatore con un filo di ritardo e si DEFORMA con la velocità — si stira
// nella direzione in cui corre e si schiaccia sull'asse opposto, come una
// goccia che cade (che poi è il segno del brand: qui la goccia non è
// disegnata, è il modo in cui il pallino si muove). Fermo torna un cerchio
// perfetto.
//
// Due livelli di trasformazione, separati apposta: il contenitore porta la
// POSIZIONE (x/y inseguite con ritardo) e la scala degli stati; il cerchio
// dentro porta solo ROTAZIONE e SCHIACCIAMENTO. Tenerli separati evita che il
// calcolo della velocità e quello dell'hover si scrivano sopra a vicenda
// sulla stessa matrice.
//
// La freccia di sistema NON viene nascosta (anche il riferimento la lascia):
// il pallino è un accento che segue, non un sostituto — chi punta continua ad
// avere il cursore preciso del proprio sistema operativo, e un errore JS o un
// dispositivo touch non lasciano la pagina senza puntatore.
//
// Si monta solo su puntatore fine e senza preferenza di movimento ridotto.

// Inseguimento della posizione, in secondi: abbastanza da vedere il ritardo,
// non tanto da perdere il puntatore.
const RITARDO = 0.42
// Velocità (px per frame della posizione RESA, non del mouse) oltre la quale
// la deformazione è al massimo.
const VELOCITA_PIENA = 22
// Deformazione massima: allunga del 45%, schiaccia del 28%. Oltre, il pallino
// diventa un trattino e si legge come un glitch invece che come inerzia.
const ALLUNGO = 0.45
const SCHIACCIO = 0.28
// Diametri in px: pallino pieno a riposo, anello vuoto sugli elementi
// interattivi. Sono misure vere e non una `scale` sul contenitore, perché il
// bordo dell'anello deve restare 1px come ogni altra linea del sito: scalando
// di 2.8× un cerchio con bordo 1px la linea ingrassa, e compensando con
// borderWidth 1/2.8 il browser arrotonda a 0 e l'anello sparisce del tutto
// (successo, misurato: border-width computato 0px). Animare width/height su un
// elemento fisso di 12px non costa nulla — è la stessa scelta del riferimento.
const DIAMETRO = 12
const DIAMETRO_APERTO = 34
// Rimpicciolimento alla pressione del tasto.
const PRESSIONE = 0.82

export default function Cursore() {
  const ref = useRef(null)

  useEffect(() => {
    if (riduciMovimento()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const scena = ref.current
    const cerchio = scena.querySelector('.cursore-cerchio')

    // Il contenitore è un punto (0×0) sul puntatore; il cerchio è centrato su
    // di lui e può quindi cambiare diametro restando centrato.
    gsap.set(scena, { autoAlpha: 0 })
    gsap.set(cerchio, { xPercent: -50, yPercent: -50 })

    const seguiX = gsap.quickTo(scena, 'x', { duration: RITARDO, ease: 'power3' })
    const seguiY = gsap.quickTo(scena, 'y', { duration: RITARDO, ease: 'power3' })

    let acceso = false
    const onMove = (e) => {
      seguiX(e.clientX)
      seguiY(e.clientY)
      if (!acceso) {
        acceso = true
        // Al primo movimento il pallino si accende dove sta il puntatore,
        // senza la strisciata dall'angolo 0,0.
        gsap.set(scena, { x: e.clientX, y: e.clientY })
        gsap.to(scena, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
      }
    }

    // La velocità si misura sulla posizione RESA (quella che GSAP ha appena
    // scritto), non sugli eventi del mouse: così la deformazione racconta il
    // movimento che si vede — cresce mentre il pallino rincorre e si spegne da
    // sola quando ha raggiunto il puntatore, senza bisogno di smorzarla a mano.
    let px = 0
    let py = 0
    let angolo = 0
    const deforma = () => {
      const x = gsap.getProperty(scena, 'x')
      const y = gsap.getProperty(scena, 'y')
      const dx = x - px
      const dy = y - py
      px = x
      py = y
      const v = Math.min(Math.hypot(dx, dy) / VELOCITA_PIENA, 1)
      // Sotto la soglia l'angolo resterebbe a inseguire il rumore di
      // mezzo pixel: si congela l'ultimo (a deformazione nulla è invisibile).
      if (v > 0.02) angolo = (Math.atan2(dy, dx) * 180) / Math.PI
      gsap.set(cerchio, {
        rotate: angolo,
        scaleX: 1 + v * ALLUNGO,
        scaleY: 1 - v * SCHIACCIO,
      })
    }
    gsap.ticker.add(deforma)

    // Stato "sopra qualcosa di cliccabile": il pallino pieno si apre in un
    // anello vuoto. La pressione del tasto rientra qui dentro come fattore sul
    // diametro e non come tween di scala: la scala del cerchio è già scritta
    // ogni frame da `deforma`, e una seconda tween sulla stessa proprietà si
    // scriverebbero addosso a vicenda.
    const SELETTORE_INTERATTIVO =
      'a, button, [role="button"], input, select, textarea, summary, label[for], [data-cursore]'
    let sopra = false
    let premuto = false
    const vesti = () => {
      const d = (sopra ? DIAMETRO_APERTO : DIAMETRO) * (premuto ? PRESSIONE : 1)
      gsap.to(cerchio, {
        width: d,
        height: d,
        backgroundColor: sopra ? 'rgba(164,138,123,0)' : 'rgba(164,138,123,0.85)',
        borderColor: sopra ? 'rgba(164,138,123,0.9)' : 'rgba(164,138,123,0)',
        duration: 0.45,
        ease: 'power3.out',
      })
    }
    const onOver = (e) => {
      const ora = !!e.target.closest?.(SELETTORE_INTERATTIVO)
      if (ora === sopra) return
      sopra = ora
      vesti()
    }
    const onDown = () => {
      premuto = true
      vesti()
    }
    const onUp = () => {
      premuto = false
      vesti()
    }

    // Puntatore fuori dalla finestra: il pallino resterebbe piantato sul
    // bordo, meglio spegnerlo.
    const spegni = () => gsap.to(scena, { autoAlpha: 0, duration: 0.25 })
    const riaccendi = () => acceso && gsap.to(scena, { autoAlpha: 1, duration: 0.25 })

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', spegni)
    document.addEventListener('mouseenter', riaccendi)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', spegni)
      document.removeEventListener('mouseenter', riaccendi)
      gsap.ticker.remove(deforma)
      gsap.killTweensOf([scena, cerchio])
    }
  }, [])

  return (
    // Il contenitore è un punto senza dimensioni traslato in x/y sul
    // puntatore; il cerchio ci sta centrato sopra e cresce da lì.
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-0 w-0 opacity-0 [@media(pointer:fine)]:block"
    >
      <div
        className="cursore-cerchio rounded-full border border-solid"
        style={{
          width: DIAMETRO,
          height: DIAMETRO,
          backgroundColor: 'rgba(164,138,123,0.85)',
          borderColor: 'rgba(164,138,123,0)',
        }}
      />
    </div>
  )
}
