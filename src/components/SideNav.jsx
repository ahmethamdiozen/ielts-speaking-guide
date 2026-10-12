import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function SideNav({ base, groups }) {
  const [open, setOpen] = useState(false)
  return (
    <aside className="sidenav">
      <button type="button" className="sidenav-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Bölümler
      </button>
      <nav className={`sidenav-list${open ? ' open' : ''}`} aria-label="Bölümler">
        {groups.map((g) => (
          <div key={g.title} className="sidenav-group">
            <h2 className="sidenav-title">{g.title}</h2>
            {g.items.map((it) => (
              <NavLink key={it.id} to={`${base}/${it.id}`} onClick={() => setOpen(false)}
                className={({ isActive }) => `sidenav-link${isActive ? ' active' : ''}`}>
                <span>{it.label}</span>
                {it.count != null && <span className="count">{it.count}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
