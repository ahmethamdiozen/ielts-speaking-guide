import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { layoutTree, boxSize, zoomAt, clientToView } from '../lib/mindmap.js'

const FIT = { k: 1, x: 0, y: 0 }
const STEP = 1.3
const DRAG_PX = 4

function RootNode({ node }) {
  const words = node.label.split(' ')
  return (
    <g data-node={node.id}>
      <circle cx={node.x} cy={node.y} r={120} fill={node.color} />
      <text x={node.x} y={node.y} textAnchor="middle" className="mm-root-text">
        {words.map((w, i) => <tspan key={i} x={node.x} dy={i === 0 ? `${-(words.length - 1) * 0.55}em` : '1.1em'}>{w}</tspan>)}
      </text>
    </g>
  )
}

function BoxNode({ node, open, interactive }) {
  const { w, h } = boxSize(node)
  return (
    <g data-node={node.id} className={interactive ? 'mm-node is-link' : 'mm-node'} role={interactive ? 'link' : undefined}
      tabIndex={interactive ? 0 : undefined} aria-label={interactive ? node.label : undefined} onClick={open} onKeyDown={(e) => { if (e.key === 'Enter') open() }}>
      <rect x={node.x - w / 2} y={node.y - h / 2} width={w} height={h} rx={h / 2} fill={node.color} />
      <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" className={node.depth <= 1 ? 'mm-box-text mm-box-1' : 'mm-box-text'}>{node.label}</text>
    </g>
  )
}

function LeafNode({ node, open, interactive }) {
  const deg = (node.angle * 180) / Math.PI
  const left = Math.cos(node.angle) < 0
  const rot = left ? deg + 180 : deg
  return (
    <g data-node={node.id} className={interactive ? 'mm-node is-link' : 'mm-node'} role={interactive ? 'link' : undefined}
      tabIndex={interactive ? 0 : undefined} aria-label={interactive ? node.label : undefined} onClick={open} onKeyDown={(e) => { if (e.key === 'Enter') open() }}>
      <circle cx={node.x} cy={node.y} r={8} fill={node.color} />
      <g transform={`translate(${node.x} ${node.y}) rotate(${rot})`}>
        <text x={left ? -16 : 16} y={0} textAnchor={left ? 'end' : 'start'} dominantBaseline="central" className="mm-leaf-text" style={{ fill: `color-mix(in srgb, ${node.color} 55%, var(--ink))` }}>{node.label}</text>
      </g>
    </g>
  )
}

export default function MindMap({ tree }) {
  const navigate = useNavigate()
  const layout = useMemo(() => layoutTree(tree), [tree])
  const [view, setView] = useState(FIT)
  const svgRef = useRef(null)
  const drag = useRef(null)
  const moved = useRef(false)
  const viewRef = useRef(view)
  viewRef.current = view

  const rectOf = () => svgRef.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 }
  const toView = (cx, cy) => clientToView(rectOf(), layout.size, layout.size, cx, cy)
  const scaleOf = () => { const r = rectOf(); return r.width && r.height ? Math.min(r.width / layout.size, r.height / layout.size) : 1 }
  const zoomBy = (factor, p) => setView((v) => zoomAt(v, factor, p?.x ?? layout.center, p?.y ?? layout.center))

  // Sayfanın kaymaması için wheel dinleyicisi passive olmamalı.
  useEffect(() => {
    const el = svgRef.current
    if (!el) return undefined
    const onWheel = (e) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      const p = clientToView(r, layout.size, layout.size, e.clientX, e.clientY)
      setView((v) => zoomAt(v, e.deltaY < 0 ? 1.15 : 1 / 1.15, p.x, p.y))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [layout.size])

  const onMouseDown = (e) => {
    if (e.button !== 0) return
    moved.current = false
    drag.current = { cx: e.clientX, cy: e.clientY, x: viewRef.current.x, y: viewRef.current.y }
  }
  const onMouseMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.cx
    const dy = e.clientY - d.cy
    if (!moved.current && Math.hypot(dx, dy) < DRAG_PX) return
    moved.current = true
    const s = scaleOf()
    setView((v) => ({ ...v, x: d.x + dx / s, y: d.y + dy / s }))
  }
  const endDrag = () => { drag.current = null }

  const open = (node) => () => {
    if (moved.current) { moved.current = false; return }
    if (node.to) navigate(node.to)
  }

  const nodeEl = (n) => {
    const interactive = !!n.to
    if (n.depth === 0) return <RootNode key={n.id} node={n} />
    if (n.leaf && n.depth >= 2) return <LeafNode key={n.id} node={n} open={open(n)} interactive={interactive} />
    return <BoxNode key={n.id} node={n} open={open(n)} interactive={interactive} />
  }

  return (
    <div className="mm">
      <div className="mm-controls" role="group" aria-label="Harita kontrolleri">
        <button type="button" className="secondary-btn" aria-label="Yakınlaştır" onClick={() => zoomBy(STEP)}>+</button>
        <button type="button" className="secondary-btn" aria-label="Uzaklaştır" onClick={() => zoomBy(1 / STEP)}>−</button>
        <button type="button" className="secondary-btn" aria-label="Sığdır" onClick={() => setView(FIT)}>Sığdır</button>
      </div>
      <svg ref={svgRef} data-testid="mm-svg" className="mm-svg" viewBox={`0 0 ${layout.size} ${layout.size}`} preserveAspectRatio="xMidYMid meet"
        role="img" aria-label="Zihin haritası: sürükleyerek kaydır, tekerlekle yakınlaştır"
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={endDrag} onMouseLeave={endDrag}>
        <g data-testid="mm-viewport" data-k={view.k} transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          <g className="mm-links">
            {layout.links.map((l) => <path key={l.to} d={l.d} stroke={l.color} className="mm-link" />)}
          </g>
          {layout.nodes.map(nodeEl)}
        </g>
      </svg>
    </div>
  )
}
