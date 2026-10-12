export default function Callout({ tone = 'info', title, children }) {
  return (
    <aside className={`callout callout-${tone}`}>
      {title && <strong className="callout-title">{title}</strong>}
      <div>{children}</div>
    </aside>
  )
}
