import { useId, useState } from 'react'

export function Reveal({ label = 'Cevabı göster', children }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="reveal">
      <button type="button" className="secondary-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {open ? 'Cevabı gizle' : label}
      </button>
      {open && <div id={id} className="reveal-body">{children}</div>}
    </div>
  )
}
