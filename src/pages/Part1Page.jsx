import PageShell from '../components/PageShell.jsx'
import Callout from '../components/Callout.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { part1 } from '../data/frames.js'

export default function Part1Page() {
  return (
    <PageShell accent={1} title="Part 1">
      <p className="lead">{part1.length}</p>
      <h2>Cevap iskeleti</h2>
      <div className="link-steps">
        {part1.steps.map((s) => (
          <section key={s.id} className="step-card">
            <h3>{s.label}</h3>
            <p>{s.tr}</p>
            <p className="example-line" lang="en">{s.example}</p>
          </section>
        ))}
      </div>
      <h2>Kurallar</h2>
      <ul>{part1.rules.map((r) => <li key={r}>{r}</li>)}</ul>
      <h2>Örnek</h2>
      <p className="prompt" lang="en">{part1.sample.question}</p>
      <Reveal label="Model cevabı göster"><p lang="en">{part1.sample.answer}</p></Reveal>
      <Callout tone="info" title="Hatırla">Bir cevabın üç cümleden uzun olması gerekmez; akıcı olması yeter.</Callout>
    </PageShell>
  )
}
