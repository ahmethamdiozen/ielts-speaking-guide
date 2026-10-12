import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  layoutTree, boxSize, zoomAt, clientToView, pruneTree, matchIds, ancestorIds, findPath, findNode, collapsibleIds,
} from '../lib/mindmap.js'
import { toMarkdown, toOpml, exportName, download } from '../lib/mindmapExport.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'

const NOTES_KEY = 'mindmap-notes-v1'
const safeNotes = (raw) => (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {})
const FIT = { k: 1, x: 0, y: 0 }
const STEP = 1.3
const DRAG_PX = 4

// Tüm düğümler için ortak kabuk: seç (tık / Enter), aç (çift tık), durum öznitelikleri.
function NodeShell({ node, flags, onSelect, onOpen, children }) {
  const { selected, match, dim, hasNote } = flags
  return (
    <g data-node={node.id} className="mm-node is-link" role="button" tabIndex={0} aria-label={node.label}
      data-selected={selected ? 'true' : undefined} data-match={match ? 'true' : undefined}
      data-dim={dim ? 'true' : undefined} data-has-note={hasNote ? 'true' : undefined}
      onClick={onSelect} onDoubleClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect() } }}>
      {children}
    </g>
  )
}

function Badge({ node, w, onToggle }) {
  const label = node.collapsed ? `Dalı aç: ${node.label}` : `Dalı kapat: ${node.label}`
  const cx = node.x + w / 2 + 20
  return (
    <g role="button" tabIndex={0} aria-label={label} className="mm-badge"
      onClick={(e) => { e.stopPropagation(); onToggle() }} onDoubleClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onToggle() } }}>
      <title>{node.collapsed ? `${node.hidden} öğe gizli` : 'Dalı kapat'}</title>
      <circle cx={cx} cy={node.y} r={17} />
      <text x={cx} y={node.y} textAnchor="middle" dominantBaseline="central">{node.collapsed ? '+' : '−'}</text>
    </g>
  )
}

function RootNode({ node, flags, onSelect, onOpen }) {
  const words = node.label.split(' ')
  return (
    <NodeShell node={node} flags={flags} onSelect={onSelect} onOpen={onOpen}>
      <circle cx={node.x} cy={node.y} r={120} fill={node.color} />
      <text x={node.x} y={node.y} textAnchor="middle" className="mm-root-text">
        {words.map((w, i) => <tspan key={i} x={node.x} dy={i === 0 ? `${-(words.length - 1) * 0.55}em` : '1.1em'}>{w}</tspan>)}
      </text>
      {flags.selected && <circle cx={node.x} cy={node.y} r={134} className="mm-ring" />}
    </NodeShell>
  )
}

function BoxNode({ node, flags, hasKids, onSelect, onOpen, onToggle }) {
  const { w, h } = boxSize(node)
  return (
    <NodeShell node={node} flags={flags} onSelect={onSelect} onOpen={onOpen}>
      <rect x={node.x - w / 2} y={node.y - h / 2} width={w} height={h} rx={h / 2} fill={node.color} />
      <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" className={node.depth <= 1 ? 'mm-box-text mm-box-1' : 'mm-box-text'}>{node.label}</text>
      {flags.hasNote && <text x={node.x - w / 2 + 4} y={node.y - h / 2 - 6} className="mm-note-mark" aria-hidden="true">✎</text>}
      {hasKids && <Badge node={node} w={w} onToggle={onToggle} />}
    </NodeShell>
  )
}

function LeafNode({ node, flags, onSelect, onOpen }) {
  const deg = (node.angle * 180) / Math.PI
  const left = Math.cos(node.angle) < 0
  const rot = left ? deg + 180 : deg
  return (
    <NodeShell node={node} flags={flags} onSelect={onSelect} onOpen={onOpen}>
      {flags.match && <circle cx={node.x} cy={node.y} r={14} className="mm-halo" />}
      {flags.selected && <circle cx={node.x} cy={node.y} r={16} className="mm-ring" />}
      <circle cx={node.x} cy={node.y} r={8} fill={node.color} />
      {flags.hasNote && <text x={node.x} y={node.y - 20} textAnchor="middle" className="mm-note-mark" aria-hidden="true">✎</text>}
      <g transform={`translate(${node.x} ${node.y}) rotate(${rot})`}>
        <text x={left ? -16 : 16} y={0} textAnchor={left ? 'end' : 'start'} dominantBaseline="central" className="mm-leaf-text"
          style={{ fill: `color-mix(in srgb, ${node.color} 55%, var(--ink))` }}>{node.label}</text>
      </g>
    </NodeShell>
  )
}

function Panel({ tree, id, collapsed, notes, onNote, onClose, onToggle, onOpen }) {
  const node = findNode(tree, id)
  if (!node) return null
  const path = findPath(tree, id)
  const isBranch = id !== tree.id && (node.children ?? []).length > 0
  const isOpen = !collapsed.has(id)
  return (
    <aside className="mm-panel" aria-label="Seçili düğüm">
      <h2>{node.label}</h2>
      {path.length > 1 && <p className="mm-path">{path.join(' › ')}</p>}
      <div className="mm-panel-actions">
        {node.to && <button type="button" className="primary-btn" onClick={() => onOpen(node)}>Sayfayı aç</button>}
        {isBranch && <button type="button" className="secondary-btn" onClick={() => onToggle(id)}>{isOpen ? 'Dalı kapat' : 'Dalı aç'}</button>}
        <button type="button" className="secondary-btn" onClick={onClose}>Seçimi kaldır</button>
      </div>
      <label className="field">
        <span>Notun</span>
        <textarea rows={4} value={typeof notes[id] === 'string' ? notes[id] : ''} onChange={(e) => onNote(id, e.target.value)} />
      </label>
    </aside>
  )
}

export default function MindMap({ tree }) {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(() => new Set())
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [rawNotes, setRawNotes] = useLocalStorage(NOTES_KEY, {})
  const notes = safeNotes(rawNotes)

  const matches = useMemo(() => matchIds(tree, query), [tree, query])
  const lit = useMemo(() => new Set([...matches, ...ancestorIds(tree, matches)]), [tree, matches])
  const searching = query.trim().length > 0
  const shown = useMemo(() => pruneTree(tree, collapsed, lit), [tree, collapsed, lit])
  const layout = useMemo(() => layoutTree(shown), [shown])
  const branchIds = useMemo(() => {
    const ids = new Set()
    const walk = (n) => { if ((n.children ?? []).length) { ids.add(n.id); n.children.forEach(walk) } }
    walk(tree)
    return ids
  }, [tree])

  const [view, setView] = useState(FIT)
  const svgRef = useRef(null)
  const drag = useRef(null)
  const moved = useRef(false)
  const viewRef = useRef(view)
  viewRef.current = view

  const rectOf = () => svgRef.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 }
  const scaleOf = () => { const r = rectOf(); return r.width && r.height ? Math.min(r.width / layout.size, r.height / layout.size) : 1 }
  const zoomBy = (factor) => setView((v) => zoomAt(v, factor, layout.center, layout.center))

  // Sayfanın kaymaması için wheel dinleyicisi passive olmamalı.
  useEffect(() => {
    const el = svgRef.current
    if (!el) return undefined
    const onWheel = (e) => {
      e.preventDefault()
      const p = clientToView(el.getBoundingClientRect(), layout.size, layout.size, e.clientX, e.clientY)
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

  // Sürükleme sonrası gelen tıklama yok sayılır.
  const guard = (fn) => () => { if (moved.current) { moved.current = false; return } fn() }
  const open = (node) => { if (node.to) navigate(node.to) }
  const toggle = (id) => setCollapsed((c) => { const n = new Set(c); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const setNote = (id, text) => setRawNotes((prev) => {
    const cur = { ...safeNotes(prev) }
    if (text.trim()) cur[id] = text; else delete cur[id]
    return cur
  })

  const flagsOf = (n) => ({
    selected: n.id === selectedId,
    match: matches.has(n.id),
    dim: searching && n.depth > 0 && !lit.has(n.id),
    hasNote: typeof notes[n.id] === 'string' && notes[n.id].trim() !== '',
  })

  const nodeEl = (n) => {
    const f = flagsOf(n)
    const onSelect = guard(() => setSelectedId(n.id))
    const onOpen = guard(() => open(n))
    if (n.depth === 0) return <RootNode key={n.id} node={n} flags={f} onSelect={onSelect} onOpen={onOpen} />
    if (n.leaf && n.depth >= 2) return <LeafNode key={n.id} node={n} flags={f} onSelect={onSelect} onOpen={onOpen} />
    return <BoxNode key={n.id} node={n} flags={f} hasKids={branchIds.has(n.id)} onSelect={onSelect} onOpen={onOpen} onToggle={guard(() => toggle(n.id))} />
  }

  const exportAs = (ext) => {
    const text = ext === 'md' ? toMarkdown(tree, notes) : toOpml(tree, notes)
    download(exportName(tree, ext), text, ext === 'md' ? 'text/markdown' : 'text/x-opml')
  }

  return (
    <div className="mm">
      <div className="mm-bar">
        <label className="mm-search">
          <span className="visually-hidden">Haritada ara</span>
          <input type="search" placeholder="Haritada ara" aria-label="Haritada ara" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        {searching && <span className="muted" role="status">{matches.size} eşleşme</span>}
        <button type="button" className="secondary-btn" onClick={() => setCollapsed(new Set())}>Hepsini aç</button>
        <button type="button" className="secondary-btn" onClick={() => setCollapsed(new Set(collapsibleIds(tree)))}>Hepsini kapat</button>
        <span className="mm-spacer" />
        <button type="button" className="secondary-btn" onClick={() => exportAs('md')}>Markdown indir</button>
        <button type="button" className="secondary-btn" onClick={() => exportAs('opml')}>OPML indir</button>
      </div>
      <div className="mm-stage">
        <div className="mm-controls" role="group" aria-label="Harita kontrolleri">
          <button type="button" className="secondary-btn" aria-label="Yakınlaştır" onClick={() => zoomBy(STEP)}>+</button>
          <button type="button" className="secondary-btn" aria-label="Uzaklaştır" onClick={() => zoomBy(1 / STEP)}>−</button>
          <button type="button" className="secondary-btn" aria-label="Sığdır" onClick={() => setView(FIT)}>Sığdır</button>
        </div>
        {selectedId && (
          <Panel tree={tree} id={selectedId} collapsed={collapsed} notes={notes} onNote={setNote} onToggle={toggle}
            onClose={() => setSelectedId(null)} onOpen={open} />
        )}
        <svg ref={svgRef} data-testid="mm-svg" className="mm-svg" viewBox={`0 0 ${layout.size} ${layout.size}`} preserveAspectRatio="xMidYMid meet"
          role="group" aria-label="Zihin haritası: sürükleyerek kaydır, tekerlekle yakınlaştır"
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={endDrag} onMouseLeave={endDrag}>
          <g data-testid="mm-viewport" data-k={view.k} transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
            <g className="mm-links">
              {layout.links.map((l) => <path key={l.to} d={l.d} stroke={l.color} className={searching && !lit.has(l.to) ? 'mm-link is-dim' : 'mm-link'} />)}
            </g>
            {layout.nodes.map(nodeEl)}
          </g>
        </svg>
      </div>
    </div>
  )
}
