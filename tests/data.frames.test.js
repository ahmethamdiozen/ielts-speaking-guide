import { method, part1, part2, part3 } from '../src/data/frames.js'

test('method has 3 rules and mistakes', () => {
  expect(method.rules).toHaveLength(3)
  for (const r of method.rules) { expect(r.title.length).toBeGreaterThan(0); expect(r.body.length).toBeGreaterThan(20) }
  expect(method.mistakes.length).toBeGreaterThanOrEqual(3)
})
test('part1 frame', () => {
  expect(part1.steps.map((s) => s.id)).toEqual(['answer', 'reason', 'example'])
  for (const s of part1.steps) for (const k of ['label', 'tr', 'example']) expect(s[k], k).toBeTruthy()
  expect(part1.sample.question).toBeTruthy(); expect(part1.sample.answer).toBeTruthy()
  expect(part1.rules.length).toBeGreaterThanOrEqual(3)
})
test('part2 types and slots', () => {
  expect(part2.types.map((t) => t.id)).toEqual(['person', 'place', 'object', 'event', 'experience'])
  for (const t of part2.types) {
    expect(t.slots.length, t.id).toBeGreaterThanOrEqual(5)
    for (const s of t.slots) for (const k of ['id', 'label', 'prompt', 'starter']) expect(s[k], `${t.id}.${k}`).toBeTruthy()
    expect(new Set(t.slots.map((s) => s.id)).size).toBe(t.slots.length)
  }
  expect(part2.timeline.length).toBeGreaterThanOrEqual(3)
})
test('part3 ladder, echo and angles', () => {
  expect(part3.ladder.map((s) => s.id)).toEqual(['opinion', 'reason', 'example', 'wider'])
  expect(part3.angles).toHaveLength(3)
  expect(part3.echo.weak).toBeTruthy(); expect(part3.echo.strong).toBeTruthy()
  expect(part3.sample.answer).toBeTruthy()
})
