import { render, screen, fireEvent, within, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'
import { buildMindMap } from '../src/data/mindmap.js'
import { layoutTree, matchIds } from '../src/lib/mindmap.js'

const tree = buildMindMap()
const FULL = layoutTree(tree).nodes.length
const BRANCHES = tree.children.length

const at = (p) => render(<MemoryRouter initialEntries={[p]}><App /></MemoryRouter>)
const h1 = () => screen.getByRole('heading', { level: 1 })
const view = () => screen.getByTestId('mm-viewport')
const k = () => Number(view().getAttribute('data-k'))
const nodes = () => document.querySelectorAll('[data-node]')
const nodeByLabel = (label) => screen.getByText(label, { selector: '[data-node] text, [data-node] tspan' }).closest('[data-node]')
const panel = () => screen.queryByRole('complementary', { name: 'Seçili düğüm' })
const readBlob = (blob) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsText(blob) })

test('menu has a Harita tab that opens the map page', () => {
  at('/method')
  const nav = screen.getByRole('navigation', { name: 'Ana menü' })
  fireEvent.click(within(nav).getByRole('link', { name: 'Harita' }))
  expect(h1()).toHaveTextContent('Zihin haritası')
})

test('renders every node of the tree', () => {
  at('/mindmap')
  expect(nodes()).toHaveLength(FULL)
})

describe('selecting and opening', () => {
  test('a click selects the node and shows a panel but does not navigate', () => {
    at('/mindmap')
    expect(panel()).toBeNull()
    fireEvent.click(nodeByLabel('Part 1'))
    expect(h1()).toHaveTextContent('Zihin haritası')
    expect(within(panel()).getByRole('heading', { level: 2, name: 'Part 1' })).toBeInTheDocument()
    expect(nodeByLabel('Part 1')).toHaveAttribute('data-selected', 'true')
  })
  test('"Sayfayı aç" in the panel navigates to the node page', () => {
    at('/mindmap')
    fireEvent.click(nodeByLabel('Part 1'))
    fireEvent.click(within(panel()).getByRole('button', { name: 'Sayfayı aç' }))
    expect(h1()).toHaveTextContent('Part 1')
  })
  test('double click opens the page directly', () => {
    at('/mindmap')
    fireEvent.doubleClick(nodeByLabel('Hikâye bankası'))
    expect(screen.getByRole('heading', { level: 2, name: 'Hikâye bankası' })).toBeInTheDocument()
  })
  test('Enter on a focused node selects it', () => {
    at('/mindmap')
    fireEvent.keyDown(nodeByLabel('Yöntem'), { key: 'Enter' })
    expect(within(panel()).getByRole('heading', { level: 2, name: 'Yöntem' })).toBeInTheDocument()
    expect(h1()).toHaveTextContent('Zihin haritası')
  })
  test('a leaf shows its path and the close button hides the panel', () => {
    at('/mindmap')
    fireEvent.click(nodeByLabel('let me think'))
    expect(within(panel()).getByText('Kalıplar › Zaman kazanma › let me think')).toBeInTheDocument()
    fireEvent.click(within(panel()).getByRole('button', { name: 'Seçimi kaldır' }))
    expect(panel()).toBeNull()
  })
})

describe('collapsing', () => {
  test('the badge collapses a branch and expands it again', () => {
    at('/mindmap')
    fireEvent.click(screen.getByRole('button', { name: 'Dalı kapat: Part 3' }))
    const collapsed = nodes().length
    expect(collapsed).toBeLessThan(FULL)
    expect(screen.queryByText('Soru kelimesini taşı')).toBeNull()
    expect(h1()).toHaveTextContent('Zihin haritası')
    fireEvent.click(screen.getByRole('button', { name: 'Dalı aç: Part 3' }))
    expect(nodes()).toHaveLength(FULL)
  })
  test('Hepsini kapat leaves only the centre and the main branches; Hepsini aç restores all', () => {
    at('/mindmap')
    fireEvent.click(screen.getByRole('button', { name: 'Hepsini kapat' }))
    expect(nodes()).toHaveLength(1 + BRANCHES)
    fireEvent.click(screen.getByRole('button', { name: 'Hepsini aç' }))
    expect(nodes()).toHaveLength(FULL)
  })
  test('the panel can collapse the selected branch too', () => {
    at('/mindmap')
    fireEvent.click(nodeByLabel('Part 3'))
    fireEvent.click(within(panel()).getByRole('button', { name: 'Dalı kapat' }))
    expect(nodes().length).toBeLessThan(FULL)
    fireEvent.click(within(panel()).getByRole('button', { name: 'Dalı aç' }))
    expect(nodes()).toHaveLength(FULL)
  })
  test('leaves have no collapse badge', () => {
    at('/mindmap')
    expect(screen.queryByRole('button', { name: /Dalı kapat: let me think/ })).toBeNull()
  })
})

describe('search', () => {
  const search = (q) => fireEvent.change(screen.getByRole('searchbox', { name: 'Haritada ara' }), { target: { value: q } })
  test('matches are highlighted, the rest are dimmed, and a count is announced', () => {
    at('/mindmap')
    search('zaman')
    expect(nodeByLabel('Zaman kazanma')).toHaveAttribute('data-match', 'true')
    expect(nodeByLabel('Zaman çizelgesi')).toHaveAttribute('data-match', 'true')
    expect(nodeByLabel('Part 1')).toHaveAttribute('data-dim', 'true')
    expect(screen.getByRole('status')).toHaveTextContent(`${matchIds(tree, 'zaman').size} eşleşme`)
  })
  test('clearing the query removes highlighting', () => {
    at('/mindmap')
    search('zaman'); search('')
    expect(document.querySelectorAll('[data-match], [data-dim]')).toHaveLength(0)
  })
  test('a match inside a collapsed branch opens its ancestors', () => {
    at('/mindmap')
    fireEvent.click(screen.getByRole('button', { name: 'Hepsini kapat' }))
    expect(screen.queryByText('let me think')).toBeNull()
    search('let me think')
    expect(nodeByLabel('let me think')).toHaveAttribute('data-match', 'true')
    search('')
    expect(screen.queryByText('let me think')).toBeNull()
  })
  test('regex characters and no results do not crash', () => {
    at('/mindmap')
    search('(*')
    expect(screen.getByRole('status')).toHaveTextContent('0 eşleşme')
    expect(nodes()).toHaveLength(FULL)
  })
})

describe('notes', () => {
  const note = () => within(panel()).getByRole('textbox', { name: 'Notun' })
  test('a note is saved, marks the node and is shown again when reselected', () => {
    at('/mindmap')
    fireEvent.click(nodeByLabel('let me think'))
    fireEvent.change(note(), { target: { value: 'bunu sık kullan' } })
    expect(JSON.parse(localStorage.getItem('mindmap-notes-v1'))['ph-let-me-think']).toBe('bunu sık kullan')
    expect(nodeByLabel('let me think')).toHaveAttribute('data-has-note', 'true')
    fireEvent.click(nodeByLabel('Part 1'))
    fireEvent.click(nodeByLabel('let me think'))
    expect(note()).toHaveValue('bunu sık kullan')
  })
  test('an emptied note removes the marker', () => {
    at('/mindmap')
    fireEvent.click(nodeByLabel('let me think'))
    fireEvent.change(note(), { target: { value: 'x' } })
    fireEvent.change(note(), { target: { value: '' } })
    expect(nodeByLabel('let me think')).not.toHaveAttribute('data-has-note')
  })
  test.each(['null', '5', '"x"', '[]', '{bad'])('corrupt notes storage (%s) does not crash', (raw) => {
    localStorage.setItem('mindmap-notes-v1', raw)
    at('/mindmap')
    fireEvent.click(nodeByLabel('let me think'))
    expect(note()).toHaveValue('')
    fireEvent.change(note(), { target: { value: 'ok' } })
    expect(note()).toHaveValue('ok')
  })
})

describe('export', () => {
  let blobs, names
  beforeEach(() => {
    blobs = []; names = []
    URL.createObjectURL = vi.fn((b) => { blobs.push(b); return 'blob:x' })
    URL.revokeObjectURL = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () { names.push(this.download) })
  })
  afterEach(() => vi.restoreAllMocks())

  test('Markdown download contains the tree and the notes', async () => {
    at('/mindmap')
    fireEvent.click(nodeByLabel('let me think'))
    fireEvent.change(within(panel()).getByRole('textbox', { name: 'Notun' }), { target: { value: 'önemli' } })
    fireEvent.click(screen.getByRole('button', { name: 'Markdown indir' }))
    expect(names).toEqual(['ielts-speaking-zihin-haritasi.md'])
    const text = await readBlob(blobs[0])
    expect(text.startsWith('# IELTS Speaking\n')).toBe(true)
    expect(text).toContain('- Kalıplar')
    expect(text).toContain('  - let me think\n      - Not: önemli')
  })
  test('OPML download is an opml document', async () => {
    at('/mindmap')
    fireEvent.click(screen.getByRole('button', { name: 'OPML indir' }))
    expect(names).toEqual(['ielts-speaking-zihin-haritasi.opml'])
    const text = await readBlob(blobs[0])
    expect(text).toContain('<opml version="2.0">')
    expect(text).toContain('text="Kalıplar"')
  })
  test('export ignores collapsed state and always contains the whole tree', async () => {
    at('/mindmap')
    fireEvent.click(screen.getByRole('button', { name: 'Hepsini kapat' }))
    fireEvent.click(screen.getByRole('button', { name: 'Markdown indir' }))
    expect(await readBlob(blobs[0])).toContain('let me think')
  })
})

describe('zoom and pan', () => {
  test('zoom buttons change the scale and Sığdır resets it', () => {
    at('/mindmap')
    expect(k()).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'Yakınlaştır' }))
    expect(k()).toBeGreaterThan(1)
    fireEvent.click(screen.getByRole('button', { name: 'Uzaklaştır' }))
    fireEvent.click(screen.getByRole('button', { name: 'Uzaklaştır' }))
    expect(k()).toBeLessThan(1)
    fireEvent.click(screen.getByRole('button', { name: 'Sığdır' }))
    expect(k()).toBe(1)
  })
  test('mouse wheel zooms in and out', () => {
    at('/mindmap')
    const svg = screen.getByTestId('mm-svg')
    fireEvent.wheel(svg, { deltaY: -100, clientX: 10, clientY: 10 })
    expect(k()).toBeGreaterThan(1)
    fireEvent.wheel(svg, { deltaY: 100, clientX: 10, clientY: 10 })
    fireEvent.wheel(svg, { deltaY: 100, clientX: 10, clientY: 10 })
    expect(k()).toBeLessThan(1)
  })
  test('dragging pans without selecting the node under the cursor', () => {
    at('/mindmap')
    const svg = screen.getByTestId('mm-svg')
    const before = view().getAttribute('transform')
    fireEvent.mouseDown(svg, { clientX: 100, clientY: 100, button: 0 })
    fireEvent.mouseMove(svg, { clientX: 160, clientY: 130 })
    fireEvent.mouseUp(svg, { clientX: 160, clientY: 130 })
    fireEvent.click(nodeByLabel('Part 1'))
    expect(panel()).toBeNull()
    expect(view().getAttribute('transform')).not.toBe(before)
    fireEvent.click(nodeByLabel('Part 1'))
    expect(panel()).not.toBeNull()
  })
})
