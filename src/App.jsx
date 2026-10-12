import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar.jsx'
import MethodPage from './pages/MethodPage.jsx'
import PhrasesPage from './pages/PhrasesPage.jsx'
import Part1Page from './pages/Part1Page.jsx'
import Part2Page from './pages/Part2Page.jsx'
import DrillPage from './pages/DrillPage.jsx'
import PracticePage from './pages/PracticePage.jsx'
import Part3Page from './pages/Part3Page.jsx'

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
        <Route path="/part1" element={<Part1Page />} />
        <Route path="/part2/:section?" element={<Part2Page />} />
        <Route path="/part3" element={<Part3Page />} />
        <Route path="/drill/:mode?" element={<DrillPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="*" element={<Navigate to="/method" replace />} />
      </Routes>
    </>
  )
}
