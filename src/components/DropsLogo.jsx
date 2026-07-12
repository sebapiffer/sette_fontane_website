// Le sette gocce del logo Sette Fontane, ridisegnate come SVG vettoriale.
// Ogni goccia ha classe "drop" per poterle animare singolarmente con GSAP.

// La caduta in formazione delle gocce: preloader (in loop) e apertura della
// hero DEVONO avere la stessa cadenza — il preloader passa il testimone alla
// hero e ogni differenza si vedrebbe come uno scatto. Vive qui, accanto alle
// gocce che anima. (Da spandere in una timeline con ease power2.out.)
export const CADUTA_GOCCE = { y: -70, autoAlpha: 0, duration: 0.8, stagger: 0.11 }

const DROP_PATH =
  'M0 -14 C 6 -7, 11 -1.5, 11 6.5 A 11 11 0 1 1 -11 6.5 C -11 -1.5, -6 -7, 0 -14 Z'

const POSITIONS = [
  [0, 0],
  [-30, 38],
  [0, 38],
  [30, 38],
  [-15, 76],
  [15, 76],
  [0, 114],
]

export default function DropsLogo({ className = '', title, spacingX = 1, ...rest }) {
  const halfWidth = 30 * spacingX + 14

  return (
    <svg
      viewBox={`${-halfWidth} -20 ${halfWidth * 2} 155`}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
      {...rest}
    >
      {title && <title>{title}</title>}
      {POSITIONS.map(([x, y], i) => (
        <path
          key={i}
          className="drop"
          d={DROP_PATH}
          transform={`translate(${x * spacingX} ${y})`}
        />
      ))}
    </svg>
  )
}
