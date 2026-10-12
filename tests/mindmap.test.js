import { layoutTree, boxSize, zoomAt, clientToView, MIN_K, MAX_K } from '../src/lib/mindmap.js'

const tree = {
  id: 'root', label: 'Merkez',
  children: [
    { id: 'a', label: 'A', to: '/a', children: [
      { id: 'a1', label: 'A1', children: [{ id: 'a1x', label: 'A1x' }, { id: 'a1y', label: 'A1y' }] },
      { id: 'a2', label: 'A2' },
    ] },
    { id: 'b', label: 'B', children: [{ id: 'b1', label: 'B1' }] },
    { id: 'c', label: 'C' },
  ],
}

describe('layoutTree', () => {
  const out = layoutTree(tree)
  const byId = Object.fromEntries(out.nodes.map((n) => [n.id, n]))

  test('places every node with finite coordinates inside the canvas', () => {
    expect(out.nodes).toHaveLength(9)
    for (const n of out.nodes) {
      expect(Number.isFinite(n.x) && Number.isFinite(n.y), n.id).toBe(true)
      expect(n.x).toBeGreaterThan(0); expect(n.x).toBeLessThan(out.size)
      expect(n.y).toBeGreaterThan(0); expect(n.y).toBeLessThan(out.size)
    }
  })
  test('all leaves share the outer ring, branches sit inside it', () => {
    const ring = byId.a1x.r
    for (const id of ['a1x', 'a1y', 'a2', 'b1']) expect(byId[id].r, id).toBe(ring)
    for (const id of ['a', 'a1', 'b', 'c']) expect(byId[id].r, id).toBeLessThan(ring)
  })
  test('root sits at the centre and depth grows outwards', () => {
    expect(byId.root.x).toBeCloseTo(out.center); expect(byId.root.y).toBeCloseTo(out.center)
    const dist = (n) => Math.hypot(n.x - out.center, n.y - out.center)
    expect(dist(byId.a)).toBeLessThan(dist(byId.a1))
    expect(dist(byId.a1)).toBeLessThan(dist(byId.a1x))
  })
  test('one link per non-root node, curve path present', () => {
    expect(out.links).toHaveLength(8)
    for (const l of out.links) expect(l.d).toMatch(/^M [\d.-]+ [\d.-]+ C /)
  })
  test('top-level branches get distinct colours; descendants keep the branch hue', () => {
    const hue = (c) => c.match(/hsl\((\d+)/)[1]
    expect(new Set(['a', 'b', 'c'].map((id) => hue(byId[id].color))).size).toBe(3)
    expect(hue(byId.a1x.color)).toBe(hue(byId.a.color))
    expect(hue(byId.a2.color)).toBe(hue(byId.a.color))
  })
  test('keeps the target route on nodes', () => { expect(byId.a.to).toBe('/a') })
  test('siblings do not share an angle', () => {
    expect(byId.a.angle).not.toBeCloseTo(byId.b.angle)
    expect(byId.a1x.angle).not.toBeCloseTo(byId.a1y.angle)
  })
  test('duplicate ids are rejected', () => {
    expect(() => layoutTree({ id: 'r', label: 'r', children: [{ id: 'x', label: 'x' }, { id: 'x', label: 'y' }] })).toThrow(/duplicate/i)
  })
  test('single-node tree does not crash', () => {
    const one = layoutTree({ id: 'solo', label: 'Solo' })
    expect(one.nodes).toHaveLength(1); expect(one.links).toHaveLength(0)
  })
})

describe('scaling for large trees', () => {
  const big = {
    id: 'r', label: 'R',
    children: Array.from({ length: 5 }, (_, b) => ({
      id: `b${b}`, label: `Dal numara ${b}`,
      children: Array.from({ length: 4 }, (_, c) => ({
        id: `b${b}c${c}`, label: `Alt dal ${b}-${c}`,
        children: Array.from({ length: 20 }, (_, l) => ({ id: `b${b}c${c}l${l}`, label: `yaprak ${l}` })),
      })),
    })),
  }
  test('the canvas grows so leaf labels keep their spacing; small trees keep the base size', () => {
    const small = layoutTree({ id: 'r', label: 'R', children: [{ id: 'a', label: 'A', children: [{ id: 'a1', label: 'x' }] }] })
    const large = layoutTree(big)
    expect(large.size).toBeGreaterThan(small.size)
    const leaves = large.nodes.filter((n) => n.leaf && n.depth >= 2).sort((p, q) => p.angle - q.angle)
    for (let i = 1; i < leaves.length; i++) {
      expect((leaves[i].angle - leaves[i - 1].angle) * leaves[i].r, leaves[i].id).toBeGreaterThanOrEqual(24)
    }
  })
})

describe('box placement', () => {
  test('box size grows with label length and shrinks with depth', () => {
    expect(boxSize({ label: 'uzun bir etiket', depth: 1 }).w).toBeGreaterThan(boxSize({ label: 'kısa', depth: 1 }).w)
    expect(boxSize({ label: 'aynı', depth: 1 }).h).toBeGreaterThan(boxSize({ label: 'aynı', depth: 2 }).h)
  })
})

describe('zoomAt and clientToView', () => {
  const view = { k: 1, x: 0, y: 0 }
  test('zoom keeps the point under the cursor fixed', () => {
    const next = zoomAt(view, 2, 300, 200)
    expect(next.k).toBe(2)
    // the content point that was under (300,200) is still under (300,200)
    expect((300 - view.x) / view.k).toBeCloseTo((300 - next.x) / next.k)
    expect((200 - view.y) / view.k).toBeCloseTo((200 - next.y) / next.k)
  })
  test('zoom is clamped', () => {
    expect(zoomAt(view, 1000, 0, 0).k).toBe(MAX_K)
    expect(zoomAt(view, 0.0001, 0, 0).k).toBe(MIN_K)
  })
  test('clientToView maps through letterboxing and survives a zero-size rect', () => {
    const rect = { left: 10, top: 20, width: 400, height: 200 }
    const p = clientToView(rect, 1000, 1000, 10 + 200, 20 + 100) // centre of the box
    expect(p.x).toBeCloseTo(500); expect(p.y).toBeCloseTo(500)
    expect(clientToView({ left: 0, top: 0, width: 0, height: 0 }, 1000, 1000, 5, 5)).toEqual({ x: 0, y: 0 })
  })
})
