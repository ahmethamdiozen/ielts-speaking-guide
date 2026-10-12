import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import SearchBox from './SearchBox.jsx'
import { useLocalStorage } from '../lib/useLocalStorage.js'

const prefersDark = () => {
  try { return !!window.matchMedia?.('(prefers-color-scheme: dark)').matches } catch { return false }
}

export const TABS = [
  { to: '/method', label: 'Yöntem', cls: 'tab-1' },
  { to: '/phrases', label: 'Kalıplar', cls: 'tab-2' },
]

export default function TopBar({ query, onQuery }) {
  const [theme, setTheme] = useLocalStorage('theme', 'auto')
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light' || theme === 'dark') root.dataset.theme = theme
    else delete root.dataset.theme
  }, [theme])

  const effective = theme === 'auto' ? (prefersDark() ? 'dark' : 'light') : theme
  const toggle = () => setTheme(effective === 'dark' ? 'light' : 'dark')

  return (
    <header className="topbar">
      <div className="brand">IELTS Speaking</div>
      <nav className="tasks" aria-label="Ana menü">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => `tab ${t.cls}${isActive ? ' active' : ''}`}>{t.label}</NavLink>
        ))}
      </nav>
      {pathname.startsWith('/phrases') ? <SearchBox query={query} onQuery={onQuery} /> : <div className="search" />}
      <button type="button" className="theme-btn" onClick={toggle} title="Temayı değiştir">
        <span className="visually-hidden">Tema: </span>
        {effective === 'dark' ? 'Açık' : 'Koyu'}
      </button>
    </header>
  )
}
