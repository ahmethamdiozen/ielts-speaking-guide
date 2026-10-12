import { buildQuestions, checkAnswer, normalize } from '../src/lib/practice.js'
import { entries } from '../src/data/phrases/index.js'

const seq = () => { let i = 0; return () => ((i++ * 0.37) % 1) }

describe('buildQuestions', () => {
  test('returns requested count, one per entry, each with exactly one blank', () => {
    const qs = buildQuestions(entries, { count: 10, rng: seq() })
    expect(qs).toHaveLength(10)
    expect(new Set(qs.map((q) => q.entryId)).size).toBe(10)
    for (const q of qs) {
      expect(q.sentence.match(/_____/g)).toHaveLength(1)
      expect(q.hint.length).toBeGreaterThan(0)
      expect(q.accepted.length).toBeGreaterThan(0)
    }
  })
  test('the removed phrase is accepted and restores an original example', () => {
    const qs = buildQuestions(entries, { count: 200, rng: seq() })
    expect(qs.length).toBeGreaterThan(0)
    for (const q of qs) {
      const original = q.sentence.replace('_____', q.shown)
      const e = entries.find((x) => x.id === q.entryId)
      expect(e.examples).toContain(original)
      expect(checkAnswer(q, q.shown)).toBe(true)
    }
  })
  test('category filter', () => {
    const qs = buildQuestions(entries, { count: 10, categoryId: 'repair', rng: seq() })
    expect(qs.length).toBeGreaterThan(0)
    for (const q of qs) expect(entries.find((e) => e.id === q.entryId).category).toBe('repair')
  })
  test('learned filter and empty pool', () => {
    const qs = buildQuestions(entries, { count: 10, onlyIds: ['or-rather', 'the-thing-is'], rng: seq() })
    expect(qs.map((q) => q.entryId).sort()).toEqual(['or-rather', 'the-thing-is'])
    expect(buildQuestions(entries, { count: 10, onlyIds: [] })).toEqual([])
    expect(buildQuestions(entries, { count: 10, categoryId: 'nope' })).toEqual([])
  })
})

describe('checkAnswer', () => {
  const q = { accepted: ['to be honest'] }
  test('ignores case, spaces and trailing punctuation', () => {
    expect(checkAnswer(q, '  To  be honest, ')).toBe(true)
  })
  test('rejects wrong and empty answers', () => {
    expect(checkAnswer(q, 'to be sure')).toBe(false)
    expect(checkAnswer(q, '')).toBe(false)
    expect(checkAnswer(q, '   ')).toBe(false)
  })
  test('curly apostrophe is normalised', () => {
    expect(checkAnswer({ accepted: ["i'd say"] }, 'I’d say')).toBe(true)
    expect(normalize('A  B ')).toBe('a b')
  })
})
