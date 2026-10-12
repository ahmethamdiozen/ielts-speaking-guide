export default function PageShell({ accent = 1, title, aside, children }) {
  return (
    <div className={`page-${accent}`}>
      <div className="page-head"><h1>{title}</h1></div>
      <div className={`layout${aside ? '' : ' layout-single'}`}>
        {aside}
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
