import { toMarkdown, toOpml, download, exportName } from '../src/lib/mindmapExport.js'

const t = {
  id: 'root', label: 'IELTS Speaking',
  children: [
    { id: 'a', label: 'Kalıplar', children: [{ id: 'a1', label: "I'd say" }, { id: 'a2', label: 'R&D <test> "x"' }] },
    { id: 'b', label: 'Part 1' },
  ],
}

describe('toMarkdown', () => {
  test('root heading then nested bullets (Markmap compatible)', () => {
    expect(toMarkdown(t)).toBe("# IELTS Speaking\n\n- Kalıplar\n  - I'd say\n  - R&D <test> \"x\"\n- Part 1\n")
  })
  test('notes become a sub-bullet, multi-line notes are flattened, blank notes are ignored', () => {
    const md = toMarkdown(t, { a1: 'ilk satır\nikinci satır', b: '   ', nope: 'x' })
    expect(md).toContain("  - I'd say\n    - Not: ilk satır ikinci satır\n")
    expect(md).not.toContain('Not:    ')
    expect(md.match(/Not:/g)).toHaveLength(1)
  })
  test('survives corrupt notes objects', () => {
    for (const bad of [null, undefined, 5, 'x', []]) expect(() => toMarkdown(t, bad)).not.toThrow()
  })
})

describe('toOpml', () => {
  test('well-formed nesting with escaped attributes', () => {
    const x = toOpml(t, { a1: 'not "özel" & <önemli>' })
    expect(x.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(x).toContain('<opml version="2.0">')
    expect(x).toContain('<title>IELTS Speaking</title>')
    expect(x).toContain('<outline text="R&amp;D &lt;test&gt; &quot;x&quot;"/>')
    expect(x).toContain('_note="not &quot;özel&quot; &amp; &lt;önemli&gt;"')
    expect(x).toContain('<outline text="Kalıplar">')
    expect(x.match(/<outline /g)).toHaveLength(5) // root + 2 + 2
    expect(x.match(/<\/outline>/g)).toHaveLength(2) // root, Kalıplar (yapraklar kendiliğinden kapanır)
  })
})

describe('exportName and download', () => {
  test('file names are ascii slugs', () => {
    expect(exportName(t, 'md')).toBe('ielts-speaking-zihin-haritasi.md')
    expect(exportName({ label: 'Çalışma Şğü' }, 'opml')).toBe('calisma-sgu-zihin-haritasi.opml')
  })
  test('download builds a Blob URL, clicks a hidden link and revokes the URL', () => {
    const created = []
    URL.createObjectURL = vi.fn((b) => { created.push(b); return 'blob:x' })
    URL.revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () { created.push(this.download) })
    vi.useFakeTimers()
    download('a.md', 'merhaba', 'text/markdown')
    vi.runAllTimers()
    vi.useRealTimers()
    expect(created[0]).toBeInstanceOf(Blob)
    expect(created[0].type).toContain('text/markdown')
    expect(created[1]).toBe('a.md')
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:x')
    expect(document.querySelector('a[download]')).toBeNull()
    click.mockRestore()
  })
})
