const TAU = Math.PI * 2
const HUES = [212, 152, 340, 32, 270, 190, 8, 95]
export const MIN_K = 0.2
export const MAX_K = 8
const RADII = [0, 430, 860, 1300]
const OUTER_STEP = 420
const MARGIN = 460

const radiiFor = (scale) => RADII.map((r) => r * scale)
const radiusOf = (R, depth) => (depth < R.length ? R[depth] : R[R.length - 1] + (depth - R.length + 1) * OUTER_STEP)

// Her yaprak aynı payı alır; dal düğümleri çocuklarının toplamını alır.
const weight = (n) => (n.children?.length ? n.children.reduce((s, c) => s + weight(c), 0) : 1)

// Dal düğümleri kutu olarak çizilir; yapraklar dış halkada merkezden dışa dönük yazıdır.
export function boxSize({ label, depth }) {
  if (depth <= 1) return { w: label.length * 19 + 52, h: 58 }
  return { w: label.length * 14 + 36, h: 44 }
}

const BOX_GAP = 28
const LEAF_ARC = 26
const isBox = (n, depth) => depth <= 1 || (n.children?.length ?? 0) > 0

// Bir düğümün (ve altındakilerin) ihtiyaç duyduğu en az açı (radyan).
function need(n, depth, R) {
  const kids = n.children ?? []
  const own = isBox(n, depth) ? (boxSize({ label: n.label, depth }).w + BOX_GAP) / radiusOf(R, depth) : LEAF_ARC / R[R.length - 1]
  return Math.max(own, kids.reduce((s, c) => s + need(c, depth + 1, R), 0))
}

// Kardeşlere payı: ağırlıkla orantılı, ama hiçbiri ihtiyacının altına düşmez.
function distribute(kids, depth, available, R) {
  const w = kids.map(weight)
  const floor = kids.map((c) => need(c, depth, R))
  const fixed = kids.map(() => false)
  for (let guard = 0; guard < kids.length; guard++) {
    const fixedSum = floor.reduce((s, f, i) => s + (fixed[i] ? f : 0), 0)
    const freeW = w.reduce((s, x, i) => s + (fixed[i] ? 0 : x), 0)
    const rest = Math.max(0, available - fixedSum)
    let changed = false
    kids.forEach((_, i) => {
      if (!fixed[i] && freeW > 0 && (rest * w[i]) / freeW < floor[i]) { fixed[i] = true; changed = true }
    })
    if (!changed) break
  }
  const fixedSum = floor.reduce((s, f, i) => s + (fixed[i] ? f : 0), 0)
  const freeW = w.reduce((s, x, i) => s + (fixed[i] ? 0 : x), 0)
  const rest = Math.max(0, available - fixedSum)
  const spans = kids.map((_, i) => (fixed[i] ? floor[i] : freeW > 0 ? (rest * w[i]) / freeW : 0))
  const sum = spans.reduce((a, b) => a + b, 0)
  return sum > available && sum > 0 ? spans.map((x) => (x * available) / sum) : spans
}

const polar = (r, a) => [r * Math.cos(a), r * Math.sin(a)]

// Alt sınırlar çevreye sığana kadar halka yarıçaplarını büyütür (küçük ağaçlarda ölçek 1 kalır).
function fitRadii(root) {
  let scale = 1
  for (let i = 0; i < 60; i++) {
    const R = radiiFor(scale)
    const total = (root.children ?? []).reduce((s, c) => s + need(c, 1, R), 0)
    if (total <= TAU * 0.97) break
    scale *= 1.06
  }
  return radiiFor(scale)
}

export function layoutTree(root) {
  const R = fitRadii(root)
  const nodes = []
  const links = []
  const seen = new Set()
  let maxR = 0

  const place = (n, depth, a0, a1, parent, hue) => {
    if (seen.has(n.id)) throw new Error(`duplicate mind map id: ${n.id}`)
    seen.add(n.id)
    const angle = (a0 + a1) / 2
    const children = n.children ?? []
    const isLeaf = children.length === 0
    const r = isLeaf && depth >= 2 ? Math.max(radiusOf(R, depth), R[R.length - 1]) : radiusOf(R, depth)
    const [x, y] = polar(r, angle)
    const color = depth === 0
      ? 'hsl(222 32% 22%)'
      : `hsl(${hue} ${72 - (depth - 1) * 6}% ${40 + Math.min(depth - 1, 3) * 9}%)`
    const node = { id: n.id, label: n.label, to: n.to, depth, leaf: isLeaf, angle, r, x, y, color, parentId: parent?.id ?? null }
    nodes.push(node)
    if (parent) links.push({ from: parent.id, to: n.id, color, pr: parent.r, pa: parent.angle, cr: r, ca: angle })
    maxR = Math.max(maxR, r)

    const spans = distribute(children, depth + 1, a1 - a0, R)
    let a = a0
    children.forEach((c, i) => {
      place(c, depth + 1, a, a + spans[i], node, depth === 0 ? HUES[i % HUES.length] : hue)
      a += spans[i]
    })
  }
  place(root, 0, -Math.PI / 2, -Math.PI / 2 + TAU, null, 0)

  const center = maxR + MARGIN
  for (const n of nodes) { n.x += center; n.y += center }
  const f = (v) => Math.round(v * 10) / 10
  const outLinks = links.map(({ pr, pa, cr, ca, ...l }) => {
    const mid = pr + (cr - pr) * 0.5
    const [x0, y0] = polar(pr, pa)
    const [x1, y1] = polar(mid, pa)
    const [x2, y2] = polar(mid, ca)
    const [x3, y3] = polar(cr, ca)
    return { ...l, d: `M ${f(x0 + center)} ${f(y0 + center)} C ${f(x1 + center)} ${f(y1 + center)}, ${f(x2 + center)} ${f(y2 + center)}, ${f(x3 + center)} ${f(y3 + center)}` }
  })
  return { nodes, links: outLinks, size: center * 2, center }
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// px, py: görünüm (viewBox) koordinatlarında imleç konumu. İmlecin altındaki nokta sabit kalır.
export function zoomAt(view, factor, px, py) {
  const k = clamp(view.k * factor, MIN_K, MAX_K)
  const ratio = k / view.k
  return { k, x: px - (px - view.x) * ratio, y: py - (py - view.y) * ratio }
}

// SVG preserveAspectRatio="xMidYMid meet" altında ekran koordinatını viewBox koordinatına çevirir.
export function clientToView(rect, vbW, vbH, clientX, clientY) {
  if (!rect.width || !rect.height) return { x: 0, y: 0 }
  const s = Math.min(rect.width / vbW, rect.height / vbH)
  const ox = (rect.width - vbW * s) / 2
  const oy = (rect.height - vbH * s) / 2
  return { x: (clientX - rect.left - ox) / s, y: (clientY - rect.top - oy) / s }
}
