import Callout from './Callout.jsx'
import { Highlighted } from '../lib/highlight.jsx'

export default function PhraseCard({ entry, learned, onToggle, query, categoryTitle }) {
  const marks = [entry.term, ...(entry.forms ?? [])]
  return (
    <article className={`word-card${learned ? ' is-learned' : ''}`}>
      <header className="word-head">
        <div>
          <h3 className="word-term"><Highlighted text={entry.term} terms={query ? [query] : []} /></h3>
          <p className="word-tr">{entry.tr}</p>
        </div>
        <button type="button" className="learned-btn" aria-pressed={learned} onClick={() => onToggle(entry.id)}>
          {learned ? '✓ Öğrendim' : 'Öğrendim'}
        </button>
      </header>
      {categoryTitle && <div className="tags"><span className="tag tag-cat">{categoryTitle}</span></div>}
      <p className="word-use"><strong>Ne zaman?</strong> {entry.use}</p>
      <p className="word-note"><strong>Sonra ne gelir?</strong> {entry.next}</p>
      {entry.mistake && <Callout tone="warn" title="Sık hata">{entry.mistake}</Callout>}
      <ul className="examples">
        {entry.examples.map((ex) => <li key={ex} lang="en"><Highlighted text={ex} terms={marks} /></li>)}
      </ul>
    </article>
  )
}
