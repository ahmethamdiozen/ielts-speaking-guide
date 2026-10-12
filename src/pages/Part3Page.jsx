import PageShell from '../components/PageShell.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { part3 } from '../data/frames.js'

export default function Part3Page() {
  return (
    <PageShell accent={3} title="Part 3">
      <p className="lead">Part 3'te cevaplar daha uzun ve soyut olur. Merdiveni sırayla çık, soru kelimesini cevaba taşı ve üç açıdan birini seç.</p>
      <h2>Merdiven</h2>
      <div className="link-steps">
        {part3.ladder.map((s) => (
          <section key={s.id} className="step-card">
            <h3>{s.label}</h3>
            <p>{s.tr}</p>
            <p className="example-line" lang="en">{s.example}</p>
          </section>
        ))}
      </div>
      <h2>Konuda kalma: soru kelimesini taşı</h2>
      <p className="prompt" lang="en">{part3.echo.question}</p>
      <p><strong>Zayıf:</strong> <span lang="en">{part3.echo.weak}</span></p>
      <p><strong>Güçlü:</strong> <span lang="en">{part3.echo.strong}</span></p>
      <h2>Fikir bulamıyorsan: üç açı</h2>
      <ul>{part3.angles.map((a) => <li key={a.id}><strong>{a.label}:</strong> {a.prompt}</li>)}</ul>
      <h2>Örnek</h2>
      <p className="prompt" lang="en">{part3.sample.question}</p>
      <Reveal label="Model cevabı göster"><p lang="en">{part3.sample.answer}</p></Reveal>
    </PageShell>
  )
}
