import { Link } from 'react-router-dom'
import { useLocalStorage } from '../lib/useLocalStorage.js'
import { allDays, cleanDone, countDone, nextDay } from '../lib/plan.js'

export default function StudyPlan({ plan, storageKey = 'plan-done-v1' }) {
  const [stored, setDone] = useLocalStorage(storageKey, {})
  const done = cleanDone(stored)
  const total = allDays(plan).length
  const count = countDone(plan, done)
  const next = nextDay(plan, done)
  const toggle = (id) => setDone((prev) => {
    const cur = cleanDone(prev)
    if (cur[id]) { const { [id]: _drop, ...rest } = cur; return rest }
    return { ...cur, [id]: true }
  })

  return (
    <div className="plan">
      <p className="lead">{plan.intro}</p>
      <p className="progress" aria-label="Plan ilerlemesi"><span>{count}/{total}</span> gün tamamlandı</p>
      <div className="plan-bar" aria-hidden="true"><div style={{ width: `${(count / total) * 100}%` }} /></div>

      <aside className="plan-next" aria-label="Sıradaki gün">
        {next ? (
          <>
            <strong>Sıradaki: {next.title}</strong>
            {next.link && <> <Link to={next.link.to}>{next.link.label} →</Link></>}
          </>
        ) : <strong>Plan tamamlandı. Tebrikler!</strong>}
      </aside>

      {plan.weeks.map((w) => (
        <section key={w.id} className="plan-week" aria-labelledby={`h-${w.id}`}>
          <h2 id={`h-${w.id}`}>{w.title}</h2>
          <p className="muted">{w.goal}</p>
          <ul className="plan-days">
            {w.days.map((d) => (
              <li key={d.id} className={done[d.id] ? 'done' : ''}>
                <label>
                  <input type="checkbox" checked={!!done[d.id]} onChange={() => toggle(d.id)} />
                  <span className="plan-title">{d.title}</span>
                </label>
                <ul>{d.steps.map((s) => <li key={s}>{s}</li>)}</ul>
                {d.link && <Link className="plan-link" to={d.link.to}>{d.link.label} →</Link>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <h2>Her hafta sonu ölç</h2>
      <table className="plan-checks">
        <thead><tr><th>Ölçüt</th><th>Hedef</th></tr></thead>
        <tbody>{plan.checks.map((c) => <tr key={c.name}><td>{c.name}</td><td>{c.target}</td></tr>)}</tbody>
      </table>
      <p><button type="button" className="secondary-btn" onClick={() => setDone({})}>İlerlemeyi sıfırla</button></p>
    </div>
  )
}
