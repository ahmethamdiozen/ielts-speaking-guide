import { escapeRegExp } from './search.js'

export function Highlighted({ text, terms = [] }) {
  const ts = terms.filter(Boolean).sort((a, b) => b.length - a.length).map(escapeRegExp)
  if (!ts.length) return <>{text}</>
  const re = new RegExp(`(?<![\\p{L}])(${ts.join('|')})(?![\\p{L}])`, 'giu')
  return <>{text.split(re).map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p))}</>
}
