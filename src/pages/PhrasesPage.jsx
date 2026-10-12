import { Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import SideNav from '../components/SideNav.jsx'
import PhraseCard from '../components/PhraseCard.jsx'
import { categories, entries } from '../data/phrases/index.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'
import { matchesQuery } from '../lib/search.js'

const catTitle = Object.fromEntries(categories.map((c) => [c.id, c.title]))
const searchText = (e) => [e.term, ...(e.forms ?? []), e.tr, e.use, e.next, ...e.examples].join(' ')
export const LEARNED_KEY = 'learned-phrases-v1'
export const cleanIds = (l) => (Array.isArray(l) ? l.filter((x) => typeof x === 'string') : [])

export default function PhrasesPage({ query }) {
  const { section = categories[0].id } = useParams()
  const [learned, setLearned] = useLocalStorage(LEARNED_KEY, [])
  const learnedSet = new Set(cleanIds(learned))
  const toggle = (id) => setLearned((l) => {
    const a = cleanIds(l)
    return a.includes(id) ? a.filter((x) => x !== id) : [...a, id]
  })
  const q = query.trim()
  const cat = categories.find((c) => c.id === section)
  if (!cat) return <Navigate to={`/phrases/${categories[0].id}`} replace />

  const groups = [{
    title: 'Kalıp bankası',
    items: categories.map((c) => {
      const all = entries.filter((e) => e.category === c.id)
      return { id: c.id, label: c.title, count: `${all.filter((e) => learnedSet.has(e.id)).length}/${all.length}` }
    }),
  }]

  let body
  if (q) {
    const found = entries.filter((e) => matchesQuery(searchText(e), q))
    body = (
      <section aria-label="Arama sonuçları">
        <h2>Arama sonuçları</h2>
        {found.length === 0 ? <p className="empty">Sonuç bulunamadı</p> : (
          <div className="cards">
            {found.map((e) => (
              <PhraseCard key={e.id} entry={e} query={q} categoryTitle={catTitle[e.category]}
                learned={learnedSet.has(e.id)} onToggle={toggle} />
            ))}
          </div>
        )}
      </section>
    )
  } else {
    const list = entries.filter((e) => e.category === cat.id)
    body = (
      <section>
        <h2>{cat.title}</h2>
        <p className="lead">{cat.desc}</p>
        <p className="progress" aria-label="İlerleme">
          <span>{list.filter((e) => learnedSet.has(e.id)).length}/{list.length}</span> kalıp öğrenildi
        </p>
        <div className="cards">
          {list.map((e) => <PhraseCard key={e.id} entry={e} learned={learnedSet.has(e.id)} onToggle={toggle} />)}
        </div>
      </section>
    )
  }

  return (
    <PageShell accent={2} title="Kalıplar" aside={<SideNav base="/phrases" groups={groups} />}>
      {body}
    </PageShell>
  )
}
