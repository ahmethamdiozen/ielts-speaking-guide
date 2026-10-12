import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar.jsx'
import MethodPage from './pages/MethodPage.jsx'
import PhrasesPage from './pages/PhrasesPage.jsx'

export default function App() {
  const [query, setQuery] = useState('')
  const { pathname } = useLocation()
  useEffect(() => { setQuery('') }, [pathname])
  return (
    <>
      <TopBar query={query} onQuery={setQuery} />
      <Routes>
        <Route path="/" element={<Navigate to="/method" replace />} />
        <Route path="/method" element={<MethodPage />} />
        <Route path="/phrases/:section?" element={<PhrasesPage query={query} />} />
        <Route path="*" element={<Navigate to="/method" replace />} />
      </Routes>
    </>
  )
}
