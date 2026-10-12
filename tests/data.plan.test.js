import plan from '../src/data/plan.js'
import { allDays } from '../src/lib/plan.js'
import { categories } from '../src/data/phrases/index.js'

const days = allDays(plan)
const ROOTS = ['/method', '/phrases', '/part1', '/part2', '/part3', '/drill', '/practice']
const catIds = categories.map((c) => c.id)

test('plan has 4 weeks of 7 days', () => {
  expect(plan.weeks).toHaveLength(4)
  plan.weeks.forEach((w) => expect(w.days).toHaveLength(7))
})
test('day ids are unique', () => {
  expect(new Set(days.map((d) => d.id)).size).toBe(days.length)
})
test('every day has a title and at least one step', () => {
  days.forEach((d) => { expect(d.title).toBeTruthy(); expect(d.steps.length).toBeGreaterThan(0) })
})
test('every link points to an existing route (and phrase category)', () => {
  days.filter((d) => d.link).forEach(({ link }) => {
    expect(ROOTS.some((r) => link.to === r || link.to.startsWith(`${r}/`))).toBe(true)
    const m = link.to.match(/^\/phrases\/(.+)$/)
    if (m) expect(catIds).toContain(m[1])
  })
})
test('plan lists the measurement criteria', () => {
  expect(plan.checks.length).toBeGreaterThanOrEqual(3)
})
