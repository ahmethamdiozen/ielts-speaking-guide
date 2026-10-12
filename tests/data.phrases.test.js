import { categories, entries } from '../src/data/phrases/index.js'

test('categories unique', () => {
  expect(new Set(categories.map((c) => c.id)).size).toBe(categories.length)
})
test('every category has >= 6 entries', () => {
  for (const c of categories) {
    expect(entries.filter((e) => e.category === c.id).length, c.id).toBeGreaterThanOrEqual(6)
  }
})
test('ids unique', () => {
  expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length)
})
describe.each(entries.map((e) => [e.id, e]))('phrase %s', (_id, e) => {
  test('required fields', () => {
    for (const k of ['term', 'tr', 'use', 'next']) expect(typeof e[k], k).toBe('string')
    expect(e.term.length).toBeGreaterThan(0)
    expect(categories.map((c) => c.id)).toContain(e.category)
  })
  test('3-5 examples containing term or form', () => {
    expect(e.examples.length).toBeGreaterThanOrEqual(3)
    expect(e.examples.length).toBeLessThanOrEqual(5)
    const forms = [e.term, ...(e.forms ?? [])].map((f) => f.toLowerCase())
    for (const ex of e.examples) expect(forms.some((f) => ex.toLowerCase().includes(f)), ex).toBe(true)
  })
})
