import { useRef, useState } from 'react'
import PageShell from '../components/PageShell.jsx'
import { categories, entries } from '../data/phrases/index.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'
import { buildQuestions, checkAnswer, BLANK } from '../lib/practice.js'
import { LEARNED_KEY, cleanIds } from './PhrasesPage.jsx'

const COUNT = 10
const fill = (q) => q.sentence.replace(BLANK, q.shown)

function Setup({ onStart }) {
  const [categoryId, setCategoryId] = useState('')
  const [mode, setMode] = useState('all')
  const [learned] = useLocalStorage(LEARNED_KEY, [])
  const [empty, setEmpty] = useState('')

  const start = (e) => {
    e.preventDefault()
    const ids = cleanIds(learned)
    const onlyIds = mode === 'learned' ? ids : undefined
    const qs = buildQuestions(entries, { count: COUNT, categoryId: categoryId || undefined, onlyIds })
    if (qs.length === 0) {
      setEmpty(mode === 'learned' && ids.length === 0
        ? 'Henüz hiçbir kalıbı “öğrendim” olarak işaretlemedin. Kalıplar sayfasında işaretle, sonra tekrar dene.'
        : 'Bu seçimde soru bulunamadı. Başka bir kategori dene.')
      return
    }
    setEmpty('')
    onStart(qs)
  }

  return (
    <form className="practice-setup" onSubmit={start}>
      <h2>Boşluk doldurma</h2>
      <p className="lead">Örnek cümlelerden bir kalıp silinir. Türkçe ipucuna ve ilk harfe bakarak kalıbı yaz. Her oturumda en fazla {COUNT} soru var.</p>
      <label className="field">
        <span>Kategori</span>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Hepsi</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </label>
      <fieldset className="field">
        <legend>Kalıplar</legend>
        <label><input type="radio" name="mode" checked={mode === 'all'} onChange={() => setMode('all')} /> Tüm kalıplar</label>
        <label><input type="radio" name="mode" checked={mode === 'learned'} onChange={() => setMode('learned')} /> Öğrendim dediklerim</label>
      </fieldset>
      {empty && <p className="empty" role="alert">{empty}</p>}
      <button type="submit" className="primary-btn">Başla</button>
    </form>
  )
}

function Quiz({ questions, onFinish }) {
  const [idx, setIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const input = useRef(null)
  const q = questions[idx]
  const last = idx === questions.length - 1

  const submit = (e) => {
    e.preventDefault()
    if (result) {
      if (last) { onFinish(score); return }
      setIdx(idx + 1); setAnswer(''); setResult(null)
      setTimeout(() => input.current?.focus(), 0)
      return
    }
    const ok = checkAnswer(q, answer)
    setResult({ ok })
    if (ok) setScore((s) => s + 1)
  }

  return (
    <form onSubmit={submit}>
      <p className="progress">Soru {idx + 1}/{questions.length}</p>
      <p className="blank-sentence" lang="en">{q.sentence}</p>
      <p className="hint">İpucu: {q.hint} · İlk harf: <strong>{q.firstLetter}</strong></p>
      <label className="field">
        <span>Eksik kalıp</span>
        <input ref={input} type="text" autoFocus autoComplete="off" lang="en" value={answer}
          disabled={!!result} onChange={(e) => setAnswer(e.target.value)} />
      </label>
      {result && (
        <div className={`feedback ${result.ok ? 'ok' : 'bad'}`} role="status">
          <strong>{result.ok ? 'Doğru' : 'Yanlış'}</strong>
          <p lang="en">{fill(q)}</p>
        </div>
      )}
      <button type="submit" className="primary-btn">{result ? (last ? 'Bitir' : 'Sonraki') : 'Kontrol et'}</button>
    </form>
  )
}

export default function PracticePage() {
  const [questions, setQuestions] = useState(null)
  const [score, setScore] = useState(null)
  let body
  if (score != null) {
    body = (
      <section>
        <h2>Sonuç</h2>
        <p className="score">{score}/{questions.length}</p>
        <button type="button" className="primary-btn" onClick={() => { setQuestions(null); setScore(null) }}>Yeniden başla</button>
      </section>
    )
  } else if (questions) {
    body = <Quiz questions={questions} onFinish={setScore} />
  } else {
    body = <Setup onStart={setQuestions} />
  }
  return <PageShell accent={3} title="Alıştırma">{body}</PageShell>
}
