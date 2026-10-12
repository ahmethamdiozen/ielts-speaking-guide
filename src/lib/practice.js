import { escapeRegExp } from './search.js'

export const BLANK = '_____'

export const normalize = (s) =>
  s.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.,;:!?]+$/, '')

function shuffle(list, rng) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function blankOut(entry, example) {
  const forms = [entry.term, ...(entry.forms ?? [])].sort((a, b) => b.length - a.length)
  const re = new RegExp(`(?<![\\p{L}])(${forms.map(escapeRegExp).join('|')})(?![\\p{L}])`, 'iu')
  const m = re.exec(example)
  if (!m) return null
  return {
    shown: m[1],
    sentence: example.slice(0, m.index) + BLANK + example.slice(m.index + m[1].length),
  }
}

export function buildQuestions(entries, { count = 10, categoryId, onlyIds, rng = Math.random } = {}) {
  let pool = entries
  if (categoryId) pool = pool.filter((e) => e.category === categoryId)
  if (onlyIds) pool = pool.filter((e) => onlyIds.includes(e.id))

  const questions = []
  for (const e of shuffle(pool, rng)) {
    if (questions.length >= count) break
    const blanks = shuffle(e.examples, rng).map((ex) => blankOut(e, ex)).filter(Boolean)
    if (!blanks.length) continue
    const { shown, sentence } = blanks[0]
    questions.push({
      id: `${e.id}:${questions.length}`,
      entryId: e.id,
      sentence,
      shown,
      hint: e.tr,
      firstLetter: shown[0].toLowerCase(),
      accepted: [...new Set([e.term, ...(e.forms ?? []), shown].map(normalize))],
    })
  }
  return questions
}

export function checkAnswer(question, input) {
  const a = normalize(input ?? '')
  return a.length > 0 && question.accepted.includes(a)
}
