import PageShell from '../components/PageShell.jsx'
import Callout from '../components/Callout.jsx'
import { method } from '../data/frames.js'

export default function MethodPage() {
  return (
    <PageShell accent={1} title="Yöntem">
      <p className="lead">Hedef kusursuz İngilizce değil, durmadan akan cevap. Üç kural yeter.</p>
      <ol className="steps">
        {method.rules.map((r) => (
          <li key={r.title}>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
          </li>
        ))}
      </ol>
      <h2>Sık yapılan hatalar</h2>
      {method.mistakes.map((m) => <Callout key={m} tone="warn">{m}</Callout>)}
    </PageShell>
  )
}
