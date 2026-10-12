const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const safeNotes = (n) => (n && typeof n === 'object' && !Array.isArray(n) ? n : {})
const noteOf = (notes, id) => (typeof notes[id] === 'string' ? notes[id].replace(/\s+/g, ' ').trim() : '')

// Markmap, Obsidian ve çoğu zihin haritası aracı bu biçimi okur: kök başlık, altında iç içe madde işaretleri.
export function toMarkdown(root, rawNotes) {
  const notes = safeNotes(rawNotes)
  const lines = [`# ${root.label}`, '']
  const walk = (n, depth) => {
    for (const c of n.children ?? []) {
      const pad = '  '.repeat(depth)
      lines.push(`${pad}- ${c.label}`)
      const note = noteOf(notes, c.id)
      if (note) lines.push(`${pad}  - Not: ${note}`)
      walk(c, depth + 1)
    }
  }
  walk(root, 0)
  return `${lines.join('\n')}\n`
}

// OPML 2.0: XMind, MindNode, OmniOutliner gibi araçlar içe aktarır. Not, _note özniteliğinde taşınır.
export function toOpml(root, rawNotes) {
  const notes = safeNotes(rawNotes)
  const out = (n, depth) => {
    const pad = '    '.repeat(depth)
    const note = noteOf(notes, n.id)
    const attrs = `text="${xml(n.label)}"${note ? ` _note="${xml(note)}"` : ''}`
    const kids = n.children ?? []
    if (!kids.length) return `${pad}<outline ${attrs}/>\n`
    return `${pad}<outline ${attrs}>\n${kids.map((c) => out(c, depth + 1)).join('')}${pad}</outline>\n`
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0">\n  <head><title>${xml(root.label)}</title></head>\n  <body>\n${out(root, 2)}  </body>\n</opml>\n`
}

const TR = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }
export const exportName = (root, ext) =>
  `${root.label.toLowerCase().replace(/[çğıöşü]/g, (c) => TR[c]).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-zihin-haritasi.${ext}`

export function download(filename, text, mime) {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
