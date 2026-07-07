import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

// Reveal condiviso: i testi [data-reveal] entrano in fade-up; le immagini
// [data-reveal-img] si scoprono con una tendina (clip-path) e un leggero
// assestamento di scala, lo stesso linguaggio ovunque nel sito.
// Con prefers-reduced-motion tutto resta semplicemente visibile.
export default function useReveal() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const text = ref.current.querySelectorAll('[data-reveal]')
        if (text.length) {
          gsap.from(text, {
            autoAlpha: 0,
            y: 36,
            duration: 0.9,
            ease: 'power2.out',
            stagger: 0.12,
            clearProps: 'transform',
            scrollTrigger: { trigger: ref.current, start: 'top 72%' },
          })
        }

        const images = ref.current.querySelectorAll('[data-reveal-img]')
        if (images.length) {
          gsap.fromTo(
            images,
            { clipPath: 'inset(0% 0 100% 0)', scale: 1.14 },
            {
              clipPath: 'inset(0% 0 0% 0)',
              scale: 1,
              duration: 1.3,
              ease: 'power3.out',
              stagger: 0.15,
              scrollTrigger: { trigger: ref.current, start: 'top 72%' },
            }
          )
        }
      })
    },
    { scope: ref }
  )

  return ref
}
