import { buildMindMap } from '../src/data/mindmap.js'
import { layoutTree, boxSize } from '../src/lib/mindmap.js'
import { categories, entries } from '../src/data/phrases/index.js'
import { stories } from '../src/data/stories.js'
import { part2 } from '../src/data/frames.js'

const tree = buildMindMap()
const out = layoutTree(tree)

const PHRASE_CATS = categories.map((c) => c.id)
const PART2_SECTIONS = ['template', 'timeline', 'stories']
const DRILL = ['part1', 'part2', 'part3']
const STATIC = ['/method', '/phrases', '/part1', '/part2', '/part3', '/drill', '/practice']

const valid = (to) => {
  if (STATIC.includes(to)) return true
  const [, a, b] = to.split('/')
  if (a === 'phrases') return PHRASE_CATS.includes(b)
  if (a === 'part2') return PART2_SECTIONS.includes(b)
  if (a === 'drill') return DRILL.includes(b)
  return false
}

test('tree builds with a root and six main branches', () => {
  expect(tree.label).toBe('IELTS Speaking')
  expect(tree.children.map((c) => c.label)).toEqual(['Yöntem', 'Kalıplar', 'Part 1', 'Part 2', 'Part 3', 'Çalışma'])
})
test('every phrase and story from the data appears as a leaf', () => {
  const labels = out.nodes.map((n) => n.label)
  for (const e of entries) expect(labels, e.term).toContain(e.term)
  for (const s of stories) expect(labels, s.label).toContain(s.label)
  for (const t of part2.types) for (const sl of t.slots) expect(out.nodes.some((n) => n.id === `p2-${t.id}-${sl.id}`), `${t.id}.${sl.id}`).toBe(true)
})
test('every link target is a real page and section', () => {
  const targets = out.nodes.filter((n) => n.to)
  expect(targets.length).toBeGreaterThan(40)
  for (const n of targets) expect(valid(n.to), `${n.id} -> ${n.to}`).toBe(true)
})
test('boxes (branch nodes) never overlap', () => {
  const boxes = out.nodes.filter((n) => n.depth === 1 || (n.depth >= 2 && !n.leaf)).map((n) => {
    const { w, h } = boxSize(n)
    return { id: n.id, l: n.x - w / 2, r: n.x + w / 2, t: n.y - h / 2, b: n.y + h / 2 }
  })
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j]
    const overlap = a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b
    expect(overlap, `${a.id} x ${b.id}`).toBe(false)
  }
})
test('radial leaf labels keep at least 24px of arc between neighbours', () => {
  const leaves = out.nodes.filter((n) => n.leaf && n.depth >= 2).sort((p, q) => p.angle - q.angle)
  for (let i = 1; i < leaves.length; i++) {
    const gap = (leaves[i].angle - leaves[i - 1].angle) * leaves[i].r
    expect(gap, `${leaves[i - 1].id} / ${leaves[i].id}`).toBeGreaterThanOrEqual(24)
  }
})
