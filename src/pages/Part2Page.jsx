import { Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import SideNav from '../components/SideNav.jsx'
import StoryBank from '../components/StoryBank.jsx'
import { part2 } from '../data/frames.js'

const SECTIONS = [
  { id: 'template', label: 'Not şablonu' },
  { id: 'timeline', label: 'Zaman çizelgesi' },
  { id: 'stories', label: 'Hikâye bankası' },
]

function Template() {
  return (
    <section>
      <h2>Not şablonu</h2>
      <p className="lead">1 dakikalık hazırlıkta cümle yazma; cue card'ın tipini bul, slotlara 2–3 kelimelik not düş. Slotları sırayla anlatırsan 2 dakika kendiliğinden dolar.</p>
      {part2.types.map((t) => (
        <div key={t.id}>
          <h3>{t.title}</h3>
          <div className="slot-grid">
            {t.slots.map((s) => (
              <div key={s.id} className="slot-card">
                <h4>{s.label}</h4>
                <p>{s.prompt}</p>
                <p className="example-line" lang="en">{s.starter}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function Timeline() {
  return (
    <section>
      <h2>Zaman çizelgesi</h2>
      <ol className="timeline">
        {part2.timeline.map((t) => (
          <li key={t.time}>
            <span className="time-label">{t.time}</span>
            <h3 style={{ margin: '.1rem 0 .4rem' }}>{t.title}</h3>
            <ul>{t.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Part2Page() {
  const { section = 'template' } = useParams()
  if (!SECTIONS.some((s) => s.id === section)) return <Navigate to="/part2/template" replace />
  const groups = [{ title: 'Part 2', items: SECTIONS }]
  return (
    <PageShell accent={2} title="Part 2" aside={<SideNav base="/part2" groups={groups} />}>
      {section === 'template' && <Template />}
      {section === 'timeline' && <Timeline />}
      {section === 'stories' && <StoryBank />}
    </PageShell>
  )
}
