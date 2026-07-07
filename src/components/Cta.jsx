import { ArrowRight } from 'lucide-react'

// CTA condivisa: la freccia scivola leggermente all'hover, stesso
// linguaggio su tutte le sezioni.
export default function Cta({ as: Tag = 'a', className = '', children, ...props }) {
  return (
    <Tag className={`btn group ${className}`} {...props}>
      {children}
      <ArrowRight
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Tag>
  )
}
