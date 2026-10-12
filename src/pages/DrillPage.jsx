import { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { isFilled, safeStories, STORIES_KEY } from '../components/StoryBank.jsx'
import part1Topics from '../data/questions/part1.js'
import part2Cards from '../data/questions/part2.js'
import part3Topics from '../data/questions/part3.js'
import { part1 as frame1, part2 as frame2, part3 as frame3 } from '../data/frames.js'
import { stories } from '../data/stories.js'
import { flatten, pickRandom } from '../lib/pick.js'
import { useCountdown, formatTime } from '../lib/useCountdown.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'

const MODES = [
  { id: 'part1', label: 'Part 1 (20 sn)' },
  { id: 'part2', label: 'Part 2 (1 + 2 dk)' },
  { id: 'part3', label: 'Part 3 (40 sn)' },
]

function Timer({ t }) {
  return (
    <div>
      <div className={`timer${t.left <= 5 ? ' low' : ''}`} role="timer" aria-live="off">{formatTime(t.left)}</div>
    </div>
  )
}

function QuestionDrill({ topics, seconds, steps }) {
  const bank = useMemo(() => flatten(topics), [topics])
  const [q, setQ] = useState(() => pickRandom(bank))
  const t = useCountdown(seconds)
  const next = () => { setQ((cur) => pickRandom(bank, Math.random, cur?.id)); t.reset() }
  return (
    <section>
      <h2>Soru</h2>
      <p className="blank-sentence" lang="en" data-testid="question-text">{q.text}</p>
      <p className="hint">Konu: {q.topic} · Sıra: {steps.join(' → ')}</p>
      <Timer t={t} />
      <button type="button" className="primary-btn" onClick={t.running ? t.pause : t.start}>{t.running ? 'Durdur' : 'Başlat'}</button>
      <button type="button" className="secondary-btn" onClick={() => t.reset()}>Sıfırla</button>
      <button type="button" className="secondary-btn" onClick={next}>Başka soru</button>
    </section>
  )
}

function Part2Drill() {
  const [card, setCard] = useState(() => pickRandom(part2Cards))
  const [phase, setPhase] = useState('ready') // ready | prep | talk | done
  const [notes, setNotes] = useState({})
  const [rawStories] = useLocalStorage(STORIES_KEY, {})
  const t = useCountdown(60)
  const type = frame2.types.find((x) => x.id === card.type)
  const mine = safeStories(rawStories)
  const suggestions = stories.filter((s) => s.fits.includes(card.type) && isFilled(mine[s.id]))

  useEffect(() => {
    if (t.left !== 0) return
    if (phase === 'prep') { setPhase('talk'); t.reset(120); t.start() }
    else if (phase === 'talk') setPhase('done')
  }, [t.left, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const startPrep = () => { setPhase('prep'); t.reset(60); t.start() }
  const another = () => { setCard((c) => pickRandom(part2Cards, Math.random, c.id)); setPhase('ready'); setNotes({}); t.reset(60) }

  return (
    <section>
      <h2>Cue card</h2>
      <div className="sample" lang="en">
        <p><strong>{card.prompt}</strong></p>
        <p>You should say:</p>
        <ul>{card.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      </div>
      <p className="hint">
        {phase === 'ready' && 'Hazır olunca başlat: 1 dakika hazırlık, ardından 2 dakika konuşma.'}
        {phase === 'prep' && 'Hazırlık süresi. Slotlara 2–3 kelimelik not düş.'}
        {phase === 'talk' && 'Konuşma süresi. Sesli konuş; notlarına bak.'}
        {phase === 'done' && 'Süre bitti. Beğendiysen aynı kartı tekrar dene ya da yeni kart al.'}
      </p>
      <Timer t={t} />
      {phase === 'ready' && <button type="button" className="primary-btn" onClick={startPrep}>Hazırlığı başlat</button>}
      <button type="button" className="secondary-btn" onClick={another}>Başka kart</button>
      {suggestions.length > 0 && (
        <p className="hint">Uyabilecek hikâyelerin: {suggestions.map((s) => s.label).join(', ')}</p>
      )}
      <h3>{type.title} için not şablonu</h3>
      <div className="slot-grid">
        {type.slots.map((s) => (
          <div key={s.id} className="slot-card">
            <label className="field">
              <span>{s.label}</span>
              <textarea rows={2} value={notes[s.id] ?? ''} placeholder={s.prompt}
                onChange={(e) => setNotes({ ...notes, [s.id]: e.target.value })} />
            </label>
            <p className="example-line" lang="en">{s.starter}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DrillPage() {
  const { mode = 'part1' } = useParams()
  if (!MODES.some((m) => m.id === mode)) return <Navigate to="/drill/part1" replace />
  return (
    <PageShell accent={3} title="Çalışma">
      <nav className="chips" aria-label="Bölüm seç">
        {MODES.map((m) => (
          <NavLink key={m.id} to={`/drill/${m.id}`} className={({ isActive }) => `chip${isActive ? ' on' : ''}`}>{m.label}</NavLink>
        ))}
      </nav>
      {mode === 'part1' && <QuestionDrill key="p1" topics={part1Topics} seconds={20} steps={frame1.steps.map((s) => s.label)} />}
      {mode === 'part2' && <Part2Drill key="p2" />}
      {mode === 'part3' && <QuestionDrill key="p3" topics={part3Topics} seconds={40} steps={frame3.ladder.map((s) => s.label.split(' ')[0])} />}
    </PageShell>
  )
}
