import { allDays, countDone, nextDay, cleanDone } from '../src/lib/plan.js'

const plan = { weeks: [
  { id: 'w1', days: [{ id: 'a' }, { id: 'b' }] },
  { id: 'w2', days: [{ id: 'c' }] },
] }

test('allDays flattens weeks in order', () => {
  expect(allDays(plan).map((d) => d.id)).toEqual(['a', 'b', 'c'])
})
test('countDone counts only ids that exist in the plan', () => {
  expect(countDone(plan, { a: true, c: true, zzz: true })).toBe(2)
})
test('nextDay returns first day not done, null when all done', () => {
  expect(nextDay(plan, { a: true }).id).toBe('b')
  expect(nextDay(plan, { a: true, b: true, c: true })).toBeNull()
})
test.each([null, 5, 'x', [], undefined])('cleanDone(%s) gives an empty object', (raw) => {
  expect(cleanDone(raw)).toEqual({})
})
test('cleanDone keeps only true entries', () => {
  expect(cleanDone({ a: true, b: false, c: 1 })).toEqual({ a: true })
})
