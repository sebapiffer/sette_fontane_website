// Eyebrow numerata delle sezioni della home: indice progressivo, trattino
// sottile, etichetta. Il numero dà un ritmo editoriale alla pagina senza
// aggiungere peso visivo; le eyebrow senza numero (overlay, footer, pagine
// interne) restano semplici <p class="eyebrow">.
export default function Eyebrow({ numero, center = false, className = '', children, ...props }) {
  return (
    <p
      className={`eyebrow flex items-center gap-3 ${center ? 'justify-center' : ''} ${className}`}
      {...props}
    >
      <span aria-hidden="true" className="tabular-nums opacity-60">
        {numero}
      </span>
      <span aria-hidden="true" className="h-px w-7 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  )
}
