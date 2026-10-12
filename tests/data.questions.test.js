import part1 from '../src/data/questions/part1.js'
import part2 from '../src/data/questions/part2.js'
import part3 from '../src/data/questions/part3.js'

const TYPES = ['person', 'place', 'object', 'event', 'experience']

test('part1: 10 topics x 4 questions, unique ids', () => {
  expect(part1).toHaveLength(10)
  expect(new Set(part1.map((t) => t.id)).size).toBe(10)
  for (const t of part1) { expect(t.title).toBeTruthy(); expect(t.questions, t.id).toHaveLength(4) }
})
test('part3: 10 topics x 3 questions, unique ids', () => {
  expect(part3).toHaveLength(10)
  expect(new Set(part3.map((t) => t.id)).size).toBe(10)
  for (const t of part3) expect(t.questions, t.id).toHaveLength(3)
})
test('part2: 20 cards, 4 per type, 4 bullets each', () => {
  expect(part2).toHaveLength(20)
  expect(new Set(part2.map((c) => c.id)).size).toBe(20)
  for (const t of TYPES) expect(part2.filter((c) => c.type === t), t).toHaveLength(4)
  for (const c of part2) {
    expect(c.prompt, c.id).toMatch(/^Describe /)
    expect(c.bullets, c.id).toHaveLength(4)
    expect(c.bullets[3], c.id).toMatch(/^and explain/i)
  }
})
test('every question ends with a question mark', () => {
  for (const t of [...part1, ...part3]) for (const q of t.questions) expect(q, q).toMatch(/\?$/)
})
