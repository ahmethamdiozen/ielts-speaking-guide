import { stories } from '../data/stories.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'

export const STORIES_KEY = 'stories-v1'
export const safeStories = (raw) => (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {})
const text = (v) => (typeof v === 'string' ? v : '')
export const isFilled = (s) => !!(s && (text(s.tr).trim() || text(s.en).trim()))

export default function StoryBank() {
  const [raw, setRaw] = useLocalStorage(STORIES_KEY, {})
  const all = safeStories(raw)
  const set = (id, field, value) => setRaw({ ...all, [id]: { ...(typeof all[id] === 'object' && all[id] ? all[id] : {}), [field]: value } })
  const filled = stories.filter((s) => isFilled(all[s.id])).length

  return (
    <section>
      <h2>Hikâye bankası</h2>
      <p className="lead">Part 2 için 8 kişisel hikâye hazırla. Gerçek anıların olduğu için sınavda hatırlaması kolay; çoğu cue card bunlardan birine uyar. Önce Türkçe not al, sonra İngilizce yaz.</p>
      <p className="progress" aria-label="Doldurulan hikâye"><span>{filled}/{stories.length}</span> hikâye hazır</p>
      <div className="cards">
        {stories.map((s) => {
          const v = typeof all[s.id] === 'object' && all[s.id] ? all[s.id] : {}
          return (
            <article key={s.id} className={`word-card${isFilled(v) ? ' is-learned' : ''}`}>
              <h3 className="word-term">{s.label}</h3>
              <p className="word-tr">{s.prompt}</p>
              <div className="tags">{s.fits.map((f) => <span key={f} className="tag">{f}</span>)}</div>
              <label className="field">
                <span>Türkçe notların</span>
                <textarea rows={3} value={text(v.tr)} onChange={(e) => set(s.id, 'tr', e.target.value)} />
              </label>
              <label className="field">
                <span>İngilizce versiyon</span>
                <textarea rows={4} lang="en" value={text(v.en)} onChange={(e) => set(s.id, 'en', e.target.value)} />
              </label>
            </article>
          )
        })}
      </div>
    </section>
  )
}
