import { categories, entries } from './phrases/index.js'
import { method, part1, part2, part3 } from './frames.js'
import { stories } from './stories.js'

const leaf = (id, label, to) => ({ id, label, to })

// Zihin haritası ağacı. İçerik mevcut veri dosyalarından üretilir; yeni kalıp/hikâye/slot eklenince haritaya kendiliğinden girer.
export function buildMindMap() {
  return {
    id: 'root',
    label: 'IELTS Speaking',
    children: [
      {
        id: 'method', label: 'Yöntem', to: '/method',
        children: method.rules.map((r, i) => leaf(`m-${i}`, r.short ?? r.title, '/method')),
      },
      {
        id: 'phrases', label: 'Kalıplar', to: '/phrases',
        children: categories.map((c) => ({
          id: `cat-${c.id}`, label: c.title, to: `/phrases/${c.id}`,
          children: entries.filter((e) => e.category === c.id).map((e) => leaf(`ph-${e.id}`, e.term, `/phrases/${c.id}`)),
        })),
      },
      {
        id: 'part1', label: 'Part 1', to: '/part1',
        children: part1.steps.map((s) => leaf(`p1-${s.id}`, s.label, '/part1')),
      },
      {
        id: 'part2', label: 'Part 2', to: '/part2',
        children: [
          ...part2.types.map((t) => ({
            id: `p2-${t.id}`, label: `${t.title} kartı`, to: '/part2/template',
            children: t.slots.map((s) => leaf(`p2-${t.id}-${s.id}`, s.label, '/part2/template')),
          })),
          {
            id: 'p2-timeline', label: 'Zaman çizelgesi', to: '/part2/timeline',
            children: part2.timeline.map((t, i) => leaf(`p2-time-${i}`, t.title, '/part2/timeline')),
          },
          {
            id: 'p2-stories', label: 'Hikâye bankası', to: '/part2/stories',
            children: stories.map((s) => leaf(`st-${s.id}`, s.label, '/part2/stories')),
          },
        ],
      },
      {
        id: 'part3', label: 'Part 3', to: '/part3',
        children: [
          {
            id: 'p3-ladder', label: 'Merdiven', to: '/part3',
            children: part3.ladder.map((s) => leaf(`p3-${s.id}`, s.label, '/part3')),
          },
          leaf('p3-echo', 'Soru kelimesini taşı', '/part3'),
          {
            id: 'p3-angles', label: 'Üç açı', to: '/part3',
            children: part3.angles.map((a) => leaf(`p3-angle-${a.id}`, a.label, '/part3')),
          },
        ],
      },
      {
        id: 'drill', label: 'Çalışma', to: '/drill',
        children: [
          leaf('d-part1', 'Part 1 · 20 sn', '/drill/part1'),
          leaf('d-part2', 'Part 2 · 1 + 2 dk', '/drill/part2'),
          leaf('d-part3', 'Part 3 · 40 sn', '/drill/part3'),
          leaf('d-practice', 'Kalıp boşluk doldurma', '/practice'),
        ],
      },
    ],
  }
}
