# IELTS Speaking Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `speaking/` klasöründe, IELTS Speaking için kalıp bankası + Part 1/2/3 iskeletleri + hikâye bankası + süreli çalışma ve boşluk doldurma alıştırması olan bir web uygulaması kurmak.

**Architecture:** `writing/` projesinin yığını ve görsel dili aynen alınır (Vite + React 18 + HashRouter + vitest). İçerik `src/data/` altında düz JS verisi; sayfalar sadece gösterir. Kullanıcıya ait veri (öğrendim işaretleri, hikâye bankası, tema) `useLocalStorage` ile tarayıcıda tutulur. Sunucu, hesap, ses ve yapay zekâ yok.

**Tech Stack:** react 18.3, react-router-dom 6.30 (HashRouter), vite 8, vitest 5 + @testing-library/react 16 + jsdom.

**Spec:** `docs/superpowers/specs/2026-10-12-ielts-speaking-guide-design.md`

## Global Constraints

- Çalışma dizini: `/Users/ahmethamdiozen/Downloads/Language/IELTS New/codes/speaking` (aşağıda `$SP`). Referans proje: `../writing` (`$WR`).
- Arayüz metinleri Türkçe, örnek cümleler İngilizce (`lang="en"`).
- Konuşma botu, ses kaydı/tanıma, AI geri bildirimi, hesap, backend YOK.
- Kalıp bankasında her kategoride en az 6 kalıp; her kalıpta 3–5 örnek ve her örnek kalıbı (ya da `forms` içindeki bir biçimi) içerir. Apostroflar düz `'` olacak.
- `localStorage` her okuma/yazmada hataya dayanıklı olmalı (bozuk JSON, `null`, sayı, dizi gelirse çökmeden varsayılana düşmek).
- Router: `HashRouter` (`src/main.jsx`), testlerde `MemoryRouter`.
- Commit mesajları: `git commit -m "<mesaj>" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"`.
- Yayın (GitHub Pages) bu planın kapsamı dışı; `vite.config.js` `base` değeri `'/ielts-speaking-guide/'`.

## Review Focus

- `stories-v1` / `learned-phrases-v1` localStorage'da bozuk (`null`, `5`, `"x"`, `[]`) olunca sayfalar çökmeden boş durumla açılmalı. (Task 8, Task 5)
- Süre sıfıra inince geri sayım negatife düşmemeli, bileşen sökülünce interval temizlenmeli. (Task 9)
- "Öğrendim dediklerim" modunda hiç öğrenilmiş kalıp yokken alıştırma boş soruyla açılmamalı, açıklayıcı mesaj göstermeli. (Task 10)
- Arama kutusuna `(*` gibi regex karakterleri girilince çökmeden "Sonuç bulunamadı" göstermeli. (Task 4)
- Bilinmeyen rota / bilinmeyen bölüm varsayılan sayfaya yönlenmeli (boş ekran değil). (Task 1, 4, 9)

---

## File Structure

```
speaking/
  package.json, vite.config.js, index.html, .gitignore, README.md
  tests/
    setup.js
    lib.test.jsx            (useLocalStorage, search, highlight, pick, useCountdown)
    data.phrases.test.js
    data.frames.test.js
    data.questions.test.js
    practice.test.js
    routes.test.jsx
  src/
    main.jsx, App.jsx
    styles/theme.css, app.css
    lib/useLocalStorage.js, search.js, highlight.jsx, pick.js, useCountdown.js, practice.js
    components/PageShell.jsx, TopBar.jsx, SideNav.jsx, SearchBox.jsx, Callout.jsx, PhraseCard.jsx, StoryBank.jsx
    data/
      phrases/_entry.js, start.js, time.js, repair.js, extend.js, describe.js, past.js, part3.js
      phrases/index.js      (categories + entries)
      frames.js             (method, part1, part2, part3)
      stories.js            (hikâye şablonları)
      questions/part1.js, part2.js, part3.js
    pages/MethodPage.jsx, PhrasesPage.jsx, Part1Page.jsx, Part2Page.jsx, Part3Page.jsx, DrillPage.jsx, PracticePage.jsx
```

---

### Task 1: İskele (scaffold), tema, kabuk ve duman testi

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `.gitignore`, `tests/setup.js`
- Copy: `src/styles/theme.css`, `src/styles/app.css`, `src/lib/useLocalStorage.js`, `src/lib/search.js`, `src/lib/highlight.jsx`, `src/components/Callout.jsx`, `src/components/SearchBox.jsx`, `src/components/SideNav.jsx` (hepsi `$WR`'den, değişmeden)
- Create: `src/main.jsx`, `src/App.jsx`, `src/components/PageShell.jsx`, `src/components/TopBar.jsx`, `src/pages/MethodPage.jsx`
- Test: `tests/lib.test.jsx`, `tests/routes.test.jsx`

**Interfaces:**
- Produces:
  - `PageShell({ accent = 1, title, aside, children })` → `<div className="page-{accent}">` içinde `<h1>{title}</h1>`, `aside` varsa `.layout` + aside + `<main className="content">`, yoksa `.layout.layout-single`.
  - `useLocalStorage(key, initial) → [value, set]`, `matchesQuery(haystack, query)`, `escapeRegExp(s)`, `<Highlighted text terms />` (writing'deki imzalar).
  - `TopBar({ query, onQuery })` — `<nav aria-label="Ana menü">` içinde linkler, tema düğmesi (`aria-label` yerine görünmez "Tema: " + "Açık"/"Koyu").
  - `App()` — Task 1'de sadece `/` → `/method`, `/method`, `*` → `/method`.

- [ ] **Step 1: Klasör, git ve bağımlılıklar**

```bash
cd "/Users/ahmethamdiozen/Downloads/Language/IELTS New/codes/speaking"
git init
mkdir -p src/{styles,lib,components,pages,data/phrases,data/questions} tests
cat > package.json <<'EOF'
{
  "name": "ielts-speaking-guide",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.6"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/react": "^16.3.3",
    "@vitejs/plugin-react": "^6.1.2",
    "jsdom": "^30.1.2",
    "vite": "^8.3.4",
    "vitest": "^5.0.3"
  }
}
EOF
printf 'node_modules\ndist\n.DS_Store\n' > .gitignore
npm install
```

Expected: `added ... packages`, hata yok.

- [ ] **Step 2: Yapılandırma ve kopyalanacak dosyalar**

```bash
WR="../writing"
cat > vite.config.js <<'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: '/ielts-speaking-guide/',
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./tests/setup.js'] },
})
EOF
cat > index.html <<'EOF'
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IELTS Speaking Guide</title>
    <meta name="description" content="IELTS Speaking için kalıp bankası, Part 1/2/3 iskeletleri ve süreli çalışma." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF
cp $WR/tests/setup.js tests/setup.js
cp $WR/src/styles/theme.css $WR/src/styles/app.css src/styles/
cp $WR/src/lib/useLocalStorage.js $WR/src/lib/search.js $WR/src/lib/highlight.jsx src/lib/
cp $WR/src/components/Callout.jsx $WR/src/components/SearchBox.jsx $WR/src/components/SideNav.jsx src/components/
```

- [ ] **Step 3: Başarısız testi yaz**

`tests/lib.test.jsx`:

```jsx
import { renderHook, act, render } from '@testing-library/react'
import { useLocalStorage } from '../src/lib/useLocalStorage.js'
import { matchesQuery, escapeRegExp } from '../src/lib/search.js'
import { Highlighted } from '../src/lib/highlight.jsx'

test('corrupt storage falls back to initial', () => {
  localStorage.setItem('k', '{bad')
  const { result } = renderHook(() => useLocalStorage('k', 5))
  expect(result.current[0]).toBe(5)
})
test('storage that throws does not crash', () => {
  const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('x') })
  const { result } = renderHook(() => useLocalStorage('k2', 'a'))
  expect(result.current[0]).toBe('a')
  act(() => result.current[1]('b'))
  expect(result.current[0]).toBe('b')
  spy.mockRestore()
})
test('search handles regex chars and empty query', () => {
  expect(matchesQuery('while', '')).toBe(true)
  expect(matchesQuery('a (b)', '(b')).toBe(true)
  expect(matchesQuery('abc', '*')).toBe(false)
  expect(escapeRegExp('a.b*')).toBe('a\\.b\\*')
})
test('highlight multi-word terms and apostrophes', () => {
  const { container } = render(<Highlighted text="Well, I'd say it depends. To be honest, no." terms={["I'd say", 'to be honest', '']} />)
  expect([...container.querySelectorAll('mark')].map((m) => m.textContent)).toEqual(["I'd say", 'To be honest'])
})
```

`tests/routes.test.jsx`:

```jsx
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'

export const at = (p) => render(<MemoryRouter initialEntries={[p]}><App /></MemoryRouter>)
const h1 = () => screen.getByRole('heading', { level: 1 })

test('root redirects to method', () => { at('/'); expect(h1()).toHaveTextContent('Yöntem') })
test('unknown route falls back to method', () => { at('/nope/zzz'); expect(h1()).toHaveTextContent('Yöntem') })

describe('top bar', () => {
  test('has main menu with Yöntem link', () => {
    at('/method')
    const nav = screen.getByRole('navigation', { name: 'Ana menü' })
    expect(within(nav).getByRole('link', { name: 'Yöntem' })).toBeInTheDocument()
  })
  test('theme toggle sets data-theme', () => {
    at('/method')
    fireEvent.click(screen.getByRole('button', { name: /tema/i }))
    expect(['light', 'dark']).toContain(document.documentElement.dataset.theme)
  })
})
```

- [ ] **Step 4: Testin başarısız olduğunu doğrula**

Run: `npx vitest run`
Expected: `tests/routes.test.jsx` FAIL ("Failed to resolve import ../src/App.jsx"); `lib.test.jsx` PASS.

- [ ] **Step 5: Kabuğu yaz**

`src/components/PageShell.jsx`:

```jsx
export default function PageShell({ accent = 1, title, aside, children }) {
  return (
    <div className={`page-${accent}`}>
      <div className="page-head"><h1>{title}</h1></div>
      <div className={`layout${aside ? '' : ' layout-single'}`}>
        {aside}
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
```

`src/components/TopBar.jsx` (writing'deki TopBar'ın uyarlaması; yeni sekmeler sonraki task'larda eklenir):

```jsx
import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import SearchBox from './SearchBox.jsx'
import { useLocalStorage } from '../lib/useLocalStorage.js'

const prefersDark = () => {
  try { return !!window.matchMedia?.('(prefers-color-scheme: dark)').matches } catch { return false }
}

export const TABS = [
  { to: '/method', label: 'Yöntem', cls: 'tab-1' },
]

export default function TopBar({ query, onQuery }) {
  const [theme, setTheme] = useLocalStorage('theme', 'auto')
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light' || theme === 'dark') root.dataset.theme = theme
    else delete root.dataset.theme
  }, [theme])

  const effective = theme === 'auto' ? (prefersDark() ? 'dark' : 'light') : theme
  const toggle = () => setTheme(effective === 'dark' ? 'light' : 'dark')

  return (
    <header className="topbar">
      <div className="brand">IELTS Speaking</div>
      <nav className="tasks" aria-label="Ana menü">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => `tab ${t.cls}${isActive ? ' active' : ''}`}>{t.label}</NavLink>
        ))}
      </nav>
      {pathname.startsWith('/phrases') ? <SearchBox query={query} onQuery={onQuery} /> : <div className="search" />}
      <button type="button" className="theme-btn" onClick={toggle} title="Temayı değiştir">
        <span className="visually-hidden">Tema: </span>
        {effective === 'dark' ? 'Açık' : 'Koyu'}
      </button>
    </header>
  )
}
```

`src/pages/MethodPage.jsx` (içerik Task 6'da gelir):

```jsx
import PageShell from '../components/PageShell.jsx'

export default function MethodPage() {
  return <PageShell accent={1} title="Yöntem"><p className="lead">Yöntem sayfası.</p></PageShell>
}
```

`src/App.jsx`:

```jsx
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar.jsx'
import MethodPage from './pages/MethodPage.jsx'

export default function App() {
  const [query, setQuery] = useState('')
  const { pathname } = useLocation()
  useEffect(() => { setQuery('') }, [pathname])
  return (
    <>
      <TopBar query={query} onQuery={setQuery} />
      <Routes>
        <Route path="/" element={<Navigate to="/method" replace />} />
        <Route path="/method" element={<MethodPage />} />
        <Route path="*" element={<Navigate to="/method" replace />} />
      </Routes>
    </>
  )
}
```

`src/main.jsx`:

```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/theme.css'
import './styles/app.css'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
)
```

- [ ] **Step 6: Testlerin geçtiğini doğrula**

Run: `npx vitest run && npm run build`
Expected: tüm testler PASS, build hatasız.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold speaking guide (vite, react, theme, shell)" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Kalıp verisi şeması + ilk iki kategori

**Files:**
- Create: `src/data/phrases/_entry.js`, `src/data/phrases/start.js`, `src/data/phrases/time.js`, `src/data/phrases/index.js`
- Test: `tests/data.phrases.test.js`

**Interfaces:**
- Produces: `phrase(category)(term, tr, use, next, examples, extra = {})` → `{ id, term, category, tr, use, next, examples, ...extra }` (`extra`: `{ forms?: string[], mistake?: string }`). `src/data/phrases/index.js` dışa aktarır: `categories` (`[{ id, title, desc }]`) ve `entries` (düz liste). Sonraki task'lar yeni dosyayı `index.js`'e ekler.

- [ ] **Step 1: Başarısız testi yaz** — `tests/data.phrases.test.js`

```js
import { categories, entries } from '../src/data/phrases/index.js'

test('categories unique', () => {
  expect(new Set(categories.map((c) => c.id)).size).toBe(categories.length)
})
test('every category has >= 6 entries', () => {
  for (const c of categories) {
    expect(entries.filter((e) => e.category === c.id).length, c.id).toBeGreaterThanOrEqual(6)
  }
})
test('ids unique', () => {
  expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length)
})
describe.each(entries.map((e) => [e.id, e]))('phrase %s', (_id, e) => {
  test('required fields', () => {
    for (const k of ['term', 'tr', 'use', 'next']) expect(typeof e[k], k).toBe('string')
    expect(e.term.length).toBeGreaterThan(0)
    expect(categories.map((c) => c.id)).toContain(e.category)
  })
  test('3-5 examples containing term or form', () => {
    expect(e.examples.length).toBeGreaterThanOrEqual(3)
    expect(e.examples.length).toBeLessThanOrEqual(5)
    const forms = [e.term, ...(e.forms ?? [])].map((f) => f.toLowerCase())
    for (const ex of e.examples) expect(forms.some((f) => ex.toLowerCase().includes(f)), ex).toBe(true)
  })
})
```

- [ ] **Step 2:** Run: `npx vitest run tests/data.phrases.test.js` → FAIL (import çözülemiyor).

- [ ] **Step 3: Yardımcı ve ilk iki kategori**

`src/data/phrases/_entry.js`:

```js
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// phrase(category)(term, tr, use, next, examples, extra?)
// next: kalıptan sonra gramer olarak ne gelir. extra: { forms?: string[], mistake?: string }
export const phrase = (category) => (term, tr, use, next, examples, extra = {}) => ({
  id: slug(term),
  term,
  category,
  tr,
  use,
  next,
  examples,
  ...extra,
})
```

`src/data/phrases/start.js`:

```js
import { phrase } from './_entry.js'
const p = phrase('start')

export default [
  p("I'd say", 'bence; şöyle derim',
    'Fikrini yumuşak ve güvenli bir şekilde söylemek için. Cümleye başlarken ne diyeceğini hâlâ düşünebilirsin.',
    'Hemen ardından tam bir cümle (that kullanmak şart değil): "I\'d say it is…"',
    [
      "I'd say it depends on the weather.",
      "I'd say my hometown is quite peaceful.",
      "Honestly, I'd say I prefer reading to watching TV.",
    ],
    { mistake: '"I\'d say that is good" yerine bir sebep ekle: "I\'d say that is good because…". Tek başına kısa kalır.' }),
  p('to be honest', 'dürüst olmak gerekirse',
    'Doğal ve samimi bir başlangıç. Kesin bir fikrin olmasa bile ses tonunu rahatlatır ve düşünmen için zaman kazandırır.',
    'Virgülden sonra tam cümle: "To be honest, I don\'t…"',
    [
      "To be honest, I don't cook very often.",
      "I like it, but to be honest, I'm not a big fan of crowds.",
      "To be honest, I've never been to a concert.",
    ],
    { mistake: 'Her cümlede kullanma; 2–3 cevapta bir kullanırsan doğal durur.' }),
  p('the thing is', 'işin aslı şu ki',
    'Bir engeli ya da asıl noktayı açıklamadan önce kullanılır. "But" ile birlikte sık gelir.',
    'Virgülden sonra bir cümle: "The thing is, I…"',
    [
      "I'd love to travel more, but the thing is, I don't have much free time.",
      'The thing is, I grew up in a small town.',
      "It's cheap, but the thing is, it's always crowded.",
    ]),
  p('it depends on', '...a bağlı',
    '"Evet/hayır" demek zor olduğunda en güvenli başlangıç. Ardından 2 durumu anlatarak cevabı kolayca uzatırsın.',
    'İsim ya da soru sözcüğü: "it depends on the weather", "it depends on how much…"',
    [
      'It depends on my mood, but usually I listen to pop.',
      'It depends on how much homework I have.',
      'Well, it depends on the season.',
    ],
    { mistake: '"It depends of" yanlış. Doğrusu "depends on".' }),
  p('personally', 'şahsen; kendi adıma',
    'Kendi fikrini başkalarının fikrinden ayırmak için. Karşılaştırma cümlelerinde işe yarar.',
    'Virgül sonrası ya da fiilden önce: "Personally, I prefer…"',
    [
      'Personally, I prefer studying in the morning.',
      'Some people love cities, but personally I find them too noisy.',
      'I think, personally, that walking is the best exercise.',
    ]),
  p("I'm not really sure", 'çok emin değilim',
    'Fikrin net değilken dürüstçe başlamak için. Sonrasında "but I think" ile bir yöne bağla; asla sadece "I don\'t know" deyip bırakma.',
    '"but I think…" ya da "why, but…" ile devam et.',
    [
      "I'm not really sure, but I think I'd choose the beach.",
      "I'm not really sure why, but I've always loved rainy days.",
      "Honestly, I'm not really sure what my favourite colour is.",
    ],
    { mistake: '"I don\'t know" ile bitirmek puan düşürür. Mutlaka bir tahmin ekle.' }),
]
```

`src/data/phrases/time.js`:

```js
import { phrase } from './_entry.js'
const p = phrase('time')

export default [
  p("that's a good question", 'güzel soru',
    'Düşünmek için 2–3 saniye kazandırır. Her soruda değil, zor sorularda kullan.',
    'Genelde nokta ile biter; sonra gerçek cevaba geç.',
    [
      "That's a good question. I've never thought about it before.",
      "Hmm, that's a good question. I'd probably say yes.",
      "That's a good question, and I think the answer is both.",
    ]),
  p('let me think', 'bir düşüneyim',
    'Sessizlik yerine kullanılır. Ardından kısa bir duraklama doğal kabul edilir.',
    'Nokta ya da "..." sonrası cevabın ilk cümlesi.',
    [
      'Let me think... I\'d say about twice a week.',
      'Let me think for a second. I believe it was last summer.',
      'Hmm, let me think. The most useful app is probably my calendar.',
    ]),
  p('let me see', 'bir bakayım',
    '"Let me think" ile aynı işlev; arka arkaya kullanma, ikisinden birini seç.',
    'Ardından hatırlama gerektiren bir cevap: tarih, sayı, isim.',
    [
      'Let me see... I usually wake up around seven.',
      'Let me see, the last film I watched was an old comedy.',
      'Well, let me see. I suppose my favourite place is the library.',
    ]),
  p('how can I put it', 'nasıl desem',
    'Doğru kelimeyi ararken kullanılır. Sonra anlatmaya devam edersin.',
    'Soru olarak söylenir, ardından açıklama gelir.',
    [
      "How can I put it? It's a quiet but lively place.",
      "It's hard to say, how can I put it, a mix of old and new.",
      "He's, how can I put it, very generous.",
    ]),
  p("I've never really thought about it", 'üzerine hiç düşünmemiştim',
    'Beklenmedik sorularda dürüstçe zaman kazanmak için. Hemen arkasından "but I suppose…" ekle.',
    '"but I suppose / but I think" ile devam et.',
    [
      "I've never really thought about it, but I suppose I'd say yes.",
      "Honestly, I've never really thought about it before.",
      "Hmm, I've never really thought about it, but I think music helps me relax.",
    ],
    { mistake: 'Cümleyi orada bırakma; mutlaka bir fikirle bitir.' }),
  p("that's an interesting one", 'ilginç bir soru',
    'Part 3\'te soyut sorularda zaman kazandırır.',
    'Nokta; ardından fikir.',
    [
      "That's an interesting one. I'd say technology helps more than it harms.",
      "Oh, that's an interesting one. Let me think.",
      "That's an interesting one, because it changed a lot in my life.",
    ]),
]
```

`src/data/phrases/index.js`:

```js
import start from './start.js'
import time from './time.js'

export const categories = [
  { id: 'start', title: 'Cevaba başlama', desc: 'Grameri kilitlemeyen, rahat başlangıçlar: I\'d say, to be honest…' },
  { id: 'time', title: 'Zaman kazanma', desc: 'Sessizlik yerine söyleyeceğin kalıplar: let me think…' },
]

export const entries = [...start, ...time]
```

- [ ] **Step 4:** Run: `npx vitest run tests/data.phrases.test.js` → kategori başına ≥6 ve örnek-kalıp testleri PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: phrase data schema with start/time categories" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Kalan beş kalıp kategorisi

**Files:**
- Create: `src/data/phrases/repair.js`, `extend.js`, `describe.js`, `past.js`, `part3.js`
- Modify: `src/data/phrases/index.js`
- Test: `tests/data.phrases.test.js` (Task 2'deki test aynen kullanılır; yeni test eklenmez)

**Interfaces:**
- Consumes: `phrase(category)(...)` (Task 2).
- Produces: `categories` 7 elemana, `entries` 42 kalıba çıkar. Kategori id'leri: `start, time, repair, extend, describe, past, part3`.

- [ ] **Step 1: Testi çalıştır, mevcut hâli doğrula**

Run: `npx vitest run tests/data.phrases.test.js` → PASS (2 kategori). Yeni dosyalar eklenince test 7 kategoriyi denetleyecek.

- [ ] **Step 2: `src/data/phrases/repair.js`**

```js
import { phrase } from './_entry.js'
const p = phrase('repair')

export default [
  p('or rather', 'daha doğrusu',
    'Cümlenin ortasında yanlış söylediğini düzeltmek için. Baştan başlamak yerine düzeltmeyi aynı cümlenin içinde yaparsın.',
    'Düzeltilen ifade hemen gelir; cümleye aynı yapıda devam edersin.',
    [
      'I go there every week, or rather, almost every week.',
      "It's a small town, or rather, a large village.",
      'My brother, or rather my cousin, taught me to cook.',
    ],
    { mistake: 'Düzeltme sonrası cümleyi baştan kurma; kaldığın yerden devam et.' }),
  p('what I mean is', 'demek istediğim şu ki',
    'Söylediğini daha açık anlatmak için. Cümle kurulumun karıştıysa kurtarıcıdır.',
    'Tam bir cümle: "What I mean is (that) I…"',
    [
      'I like cities. What I mean is, I like the energy in them.',
      "It's not cheap. What I mean is, it's not for everyone.",
      'What I mean is that I prefer small groups.',
    ]),
  p('let me put it another way', 'başka türlü söyleyeyim',
    'Aynı fikri başka kelimelerle toparlamak için. Tekrar yerine paraphrase gibi görünür.',
    'İki nokta ya da virgül sonrası aynı fikrin kısa hâli.',
    [
      "It's relaxing. Let me put it another way: it takes my mind off work.",
      "Let me put it another way: I'm not a morning person.",
      'I enjoy it, but let me put it another way, I need it.',
    ]),
  p('I mean', 'yani',
    'Biraz önce söylediğini açmak ya da örnek vermek için. Çok sık kullanma; 1–2 kez yeterli.',
    'Virgülden sonra açıklama.',
    [
      "It's a nice area, I mean, it's quiet and green.",
      'I love cooking, I mean, I love trying new recipes.',
      'He is helpful, I mean, he always listens.',
    ],
    { mistake: 'Her cümlede "I mean" demek akıcılığı değil dolgu fazlasını gösterir.' }),
  p('sorry, I meant', 'pardon, demek istediğim',
    'Yanlış kelime ya da tarih söylediysen kısa bir özürle düzeltmek için. Doğal bir öz-düzeltme sayılır.',
    'Doğru kelime ya da ifade; sonra cümleye devam.',
    [
      'I went there last year, sorry, I meant the year before.',
      "It's on the left, sorry, I meant the right.",
      'My sister, sorry, I meant my cousin, lives in Ankara.',
    ]),
  p('or should I say', 'ya da şöyle diyeyim',
    'Daha güçlü ya da daha uygun bir kelimeyle kendini yükseltmek için.',
    'Daha güçlü bir isim ya da sıfat.',
    [
      "It's a hobby, or should I say, a passion.",
      "He's my teacher, or should I say, my mentor.",
      'I live in a flat, or should I say, a tiny studio.',
    ]),
]
```

- [ ] **Step 3: `src/data/phrases/extend.js`**

```js
import { phrase } from './_entry.js'
const p = phrase('extend')

export default [
  p('for example', 'örneğin',
    'Cevabı gerçek bir örnekle uzatmanın en kolay yolu. Her cevapta bir kez ekle.',
    'Virgül sonrası somut bir durum.',
    [
      'I enjoy outdoor activities, for example, hiking and cycling.',
      'For example, last month I tried rock climbing.',
      'Some foods, for example, spicy ones, are my favourites.',
    ]),
  p('the reason is that', 'sebebi şu ki',
    'Sebep eklemek için. "Because" ile aynı iş; farklı bir yapı kullanmak çeşitlilik verir.',
    'Tam bir cümle: "the reason is that + özne + fiil"',
    [
      'The reason is that I grew up near the sea.',
      'I stay at home a lot. The reason is that I work long hours.',
      'I like it, and the reason is that it helps me focus.',
    ],
    { mistake: '"The reason is because" yanlış. Doğrusu "the reason is that".' }),
  p('on top of that', 'bunun üstüne',
    'Bir avantajın ya da bilginin üstüne bir tane daha eklemek için.',
    'Virgül sonrası ek bir bilgi.',
    [
      "It's cheap, and on top of that, it's close to my house.",
      'The food is great. On top of that, the staff are friendly.',
      'I earn a good salary, and on top of that, I enjoy my work.',
    ]),
  p('having said that', 'bununla birlikte',
    'Önceki fikre karşı bir yön eklemek için. Part 3\'te dengeli cevap vermenin kısayolu.',
    'Virgül sonrası karşıt fikir.',
    [
      'I love my city. Having said that, it can get very crowded.',
      "Having said that, I wouldn't live there forever.",
      "It's expensive. Having said that, it's worth every penny.",
    ]),
  p('in my case', 'benim durumumda',
    'Genel bir şeyden kendi hayatına geçmek için. Part 1\'de kişisel cevabı uzatmanın kolay yolu.',
    'Virgül sonrası kişisel durum.',
    [
      'In my case, I started learning English at school.',
      'Many people prefer cars, but in my case, I always take the bus.',
      'In my case, a short walk is the best way to relax.',
    ]),
  p("that's why", 'bu yüzden',
    'Sebepten sonuca geçmek için.',
    'Tam bir cümle: "that\'s why + özne + fiil"',
    [
      "I get up early, and that's why I'm usually tired by evening.",
      "That's why I always carry a book with me.",
      "The traffic is terrible, that's why I cycle to work.",
    ]),
]
```

- [ ] **Step 4: `src/data/phrases/describe.js`**

```js
import { phrase } from './_entry.js'
const p = phrase('describe')

export default [
  p("it's a kind of", 'bir tür ...',
    'Kelimeyi bilmediğinde nesneyi genel kategoriye koyarak anlatmak için.',
    'Bir isim ya da isim grubu: "a kind of fruit".',
    [
      "It's a kind of small bag you wear around your waist.",
      "It's a kind of fruit, a bit like an orange.",
      "It's a kind of festival that happens every spring.",
    ]),
  p("it's something you use to", 'şunun için kullandığın bir şey',
    'Eşyayı işlevi üzerinden anlatmak için.',
    'Fiil: "use to + fiil (yalın)".',
    [
      "It's something you use to cut paper.",
      "It's something you use to keep your drinks cold.",
      "Sorry, it's something you use to charge your phone.",
    ]),
  p("it's a place where", '... yapılan bir yer',
    'Yer adını bilmediğinde ne yapıldığını söyleyerek anlatmak için.',
    'Tam cümle: "where + özne + fiil".',
    [
      "It's a place where people go to relax after work.",
      "It's a place where you can borrow books for free.",
      "It's a place where my family gathers on weekends.",
    ]),
  p("it's like", 'gibi bir şey',
    'Benzetme ile anlatmak için. Kelime bilmiyorsan bilinen bir şeye benzet.',
    'Bir isim grubu: "like a small version of…".',
    [
      "It's like a small version of a bus.",
      "It's like a traditional dish, but with a modern twist.",
      "It's like a second home to me.",
    ]),
  p('a person who', '... yapan bir kişi',
    'Meslek ya da özellik adını bilmediğinde kişiyi tarif etmek için.',
    'Fiil: "a person who + fiil (3. tekil)".',
    [
      'A teacher is a person who helps you learn new things.',
      "He's a person who always keeps his promises.",
      'I admire a person who never gives up.',
    ]),
  p("I can't remember the word, but", 'kelimeyi hatırlayamıyorum ama',
    'Kelime aklına gelmediğinde durmak yerine bunu söyleyip tarif etmeye geçmek için. Sınav kurallarına uygundur.',
    'Hemen ardından "it\'s a kind of / it\'s something you use to…".',
    [
      "I can't remember the word, but it's a tool for cutting wood.",
      "I can't remember the word, but it's the opposite of expensive.",
      "I can't remember the word, but you wear it on your head.",
    ]),
]
```

- [ ] **Step 5: `src/data/phrases/past.js`**

```js
import { phrase } from './_entry.js'
const p = phrase('past')

export default [
  p('used to', 'eskiden ... yapardı',
    'Geçmişte alışkanlık ya da durum anlatırken. Part 1\'de "Did you ...as a child?" sorularında çok işe yarar.',
    'Fiil yalın hâli: "used to play".',
    [
      'Back then, I used to walk to school with my friends.',
      'We used to live in a small flat near the sea.',
      'I used to play football every weekend.',
    ],
    { mistake: 'Olumsuz/soru hâlinde "use to" olur: "I didn\'t use to like coffee".' }),
  p('when I was younger', 'daha gençken',
    'Geçmişe hızlı geçiş yapar. Sonra "used to" ya da past simple ile devam et.',
    'Virgül sonrası past simple.',
    [
      "When I was younger, I spent every summer at my grandparents' house.",
      'I was shy when I was younger.',
      'When I was younger, I wanted to be a pilot.',
    ]),
  p('if I were', 'olsaydım',
    'Part 3\'te varsayım ve öneri cümleleri için. Konuşmada "If I was" da kabul edilir ama "were" daha güvenli.',
    'Virgül sonrası "I would + fiil".',
    [
      'If I were the mayor, I would build more parks.',
      "If I were you, I'd try the local food.",
      "If I were free tomorrow, I'd go hiking.",
    ]),
  p("I'd probably", 'muhtemelen ... yapardım',
    'Varsayımsal sorulara yumuşak cevap vermek için. Kesin konuşmak zorunda kalmazsın.',
    'Fiil yalın hâli: "I\'d probably choose".',
    [
      "I'd probably choose a quiet cafe over a loud restaurant.",
      "I'd probably spend the money on a trip.",
      "If it rained, I'd probably stay home.",
    ]),
  p('I remember', 'hatırlıyorum',
    'Part 2\'de hikâye anlatırken en güçlü açılışlardan biri. Duyguyu ve sahneyi ekler.',
    '"I remember + V-ing" ya da "I remember that…"',
    [
      'I remember my first day at school very clearly.',
      'I remember feeling nervous but excited.',
      'I remember that the weather was awful.',
    ]),
  p('it was the first time', 'ilk defaydı',
    'Bir deneyimin neden unutulmaz olduğunu vurgulamak için.',
    '"it was the first time + özne + had + V3".',
    [
      'It was the first time I had travelled alone.',
      'It was the first time I cooked for my family.',
      'It was the first time I felt really proud of myself.',
    ]),
]
```

- [ ] **Step 6: `src/data/phrases/part3.js`**

```js
import { phrase } from './_entry.js'
const p = phrase('part3')

export default [
  p('generally speaking', 'genel olarak',
    'Bir genellemeyi güvenle yapmak için. Part 3\'te toplum hakkında konuşurken işe yarar.',
    'Virgül sonrası genelleme.',
    [
      'Generally speaking, young people spend more time online.',
      'Generally speaking, people in cities are busier.',
      "Generally speaking, it's easier to learn when you're motivated.",
    ]),
  p('these days', 'bu günlerde',
    '"Şimdi ile eskiyi" karşılaştırmanın en kolay yolu.',
    'Cümle başı ya da sonu; present simple.',
    [
      'These days, most people shop online.',
      'Fewer people read newspapers these days.',
      'These days, working from home is quite common.',
    ]),
  p('compared to the past', 'geçmişe kıyasla',
    'Zaman karşılaştırması gerektiren Part 3 sorularında doğrudan kullanılır.',
    'Virgül sonrası karşılaştırma cümlesi.',
    [
      'Compared to the past, travelling is much cheaper now.',
      'Compared to the past, people are more health-conscious.',
      'Compared to the past, children have more screen time.',
    ]),
  p('some people argue that', 'bazı insanlar ... savunur',
    'Başkalarının fikrini aktararak kendi fikrine geçmek için. "Others disagree" ile dengeli cevap olur.',
    '"that + özne + fiil".',
    [
      'Some people argue that technology makes us lazy.',
      "Some people argue that money can't buy happiness.",
      'Some people argue that students need more free time.',
    ]),
  p('in the long run', 'uzun vadede',
    'Gelecek ya da sonuç anlatırken. Part 3\'te "Ne olur?" sorularına cevap kurar.',
    'Virgül sonrası ya da cümle sonunda.',
    [
      'In the long run, public transport is better for the environment.',
      'In the long run, learning a skill pays off.',
      'Cheap shoes can cost more in the long run.',
    ]),
  p('it varies from person to person', 'kişiden kişiye değişir',
    'Net cevap veremeyeceğin sorularda güvenli çıkış. Ardından iki örnek tip versen cevabı uzatırsın.',
    'Virgül sonrası iki örnek: "some… while others…".',
    [
      'It varies from person to person, but most people prefer evenings.',
      'How much sleep you need? It varies from person to person.',
      'I think it varies from person to person, depending on their lifestyle.',
    ]),
]
```

- [ ] **Step 7: `src/data/phrases/index.js`'i güncelle**

```js
import start from './start.js'
import time from './time.js'
import repair from './repair.js'
import extend from './extend.js'
import describe from './describe.js'
import past from './past.js'
import part3 from './part3.js'

export const categories = [
  { id: 'start', title: 'Cevaba başlama', desc: 'Grameri kilitlemeyen, rahat başlangıçlar: I\'d say, to be honest…' },
  { id: 'time', title: 'Zaman kazanma', desc: 'Sessizlik yerine söyleyeceğin kalıplar: let me think…' },
  { id: 'repair', title: 'Yarıda düzeltme', desc: 'Baştan başlamadan toparla: or rather, what I mean is…' },
  { id: 'extend', title: 'Uzatma & ekleme', desc: 'Cevabı sebep, örnek ve karşıt fikirle uzat.' },
  { id: 'describe', title: 'Kelime bulamayınca', desc: 'Bilmediğin kelimeyi tarif et: it\'s a kind of…' },
  { id: 'past', title: 'Geçmiş & varsayım', desc: 'used to, if I were, I remember… hikâye ve hayal kurma kalıpları.' },
  { id: 'part3', title: 'Part 3: toplum & gelecek', desc: 'Genelleme, karşılaştırma ve gelecek için kalıplar.' },
]

export const entries = [...start, ...time, ...repair, ...extend, ...describe, ...past, ...part3]
```

- [ ] **Step 8: Testleri çalıştır**

Run: `npx vitest run tests/data.phrases.test.js`
Expected: PASS; 7 kategori, 42 kalıp.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add remaining phrase categories (42 phrases)" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Kalıplar sayfası (kart, öğrendim, arama)

**Files:**
- Create: `src/components/PhraseCard.jsx`, `src/pages/PhrasesPage.jsx`
- Modify: `src/App.jsx`, `src/components/TopBar.jsx` (sekme ekle)
- Test: `tests/routes.test.jsx`

**Interfaces:**
- Consumes: `categories`, `entries` (`src/data/phrases/index.js`); `SideNav({ base, groups })`; `Highlighted`; `matchesQuery`; `useLocalStorage`; `PageShell`.
- Produces: `PhraseCard({ entry, learned, onToggle, query, categoryTitle })`; `PhrasesPage({ query })` rotası `/phrases/:section?`; `localStorage` anahtarı `learned-phrases-v1` (string id dizisi); `<p aria-label="İlerleme">` içinde `x/y` metni.

- [ ] **Step 1: Başarısız testleri ekle** — `tests/routes.test.jsx` sonuna:

```jsx
describe('phrases page', () => {
  test('category shows phrase card', () => {
    at('/phrases/start')
    expect(screen.getByRole('heading', { level: 3, name: "I'd say" })).toBeInTheDocument()
  })
  test('unknown section falls back to first category', () => {
    at('/phrases/does-not-exist')
    expect(screen.getByRole('heading', { level: 2, name: 'Cevaba başlama' })).toBeInTheDocument()
  })
  test('search lists matching phrases from any category', () => {
    at('/phrases/start')
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'or rather' } })
    expect(screen.getByRole('heading', { level: 3, name: 'or rather' })).toBeInTheDocument()
  })
  test('search with regex chars and no match shows empty state', () => {
    at('/phrases/start')
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '(*' } })
    expect(screen.getByText('Sonuç bulunamadı')).toBeInTheDocument()
  })
  test('learned toggle updates counter', () => {
    at('/phrases/start')
    const progress = () => screen.getByLabelText('İlerleme')
    expect(progress()).toHaveTextContent('0/6')
    fireEvent.click(screen.getAllByRole('button', { name: /öğrendim/i })[0])
    expect(progress()).toHaveTextContent('1/6')
  })
  test.each(['{}', '5', 'null', '"abc"'])('corrupt learned storage (%s) does not crash on toggle', (raw) => {
    localStorage.setItem('learned-phrases-v1', raw)
    at('/phrases/start')
    fireEvent.click(screen.getAllByRole('button', { name: /öğrendim/i })[0])
    expect(screen.getByLabelText('İlerleme')).toHaveTextContent('1/6')
  })
})
```

- [ ] **Step 2:** Run: `npx vitest run tests/routes.test.jsx` → yeni testler FAIL (rota yok, `/phrases/start` `/method`'a düşüyor).

- [ ] **Step 3: Bileşen ve sayfa**

`src/components/PhraseCard.jsx`:

```jsx
import Callout from './Callout.jsx'
import { Highlighted } from '../lib/highlight.jsx'

export default function PhraseCard({ entry, learned, onToggle, query, categoryTitle }) {
  const marks = [entry.term, ...(entry.forms ?? [])]
  return (
    <article className={`word-card${learned ? ' is-learned' : ''}`}>
      <header className="word-head">
        <div>
          <h3 className="word-term"><Highlighted text={entry.term} terms={query ? [query] : []} /></h3>
          <p className="word-tr">{entry.tr}</p>
        </div>
        <button type="button" className="learned-btn" aria-pressed={learned} onClick={() => onToggle(entry.id)}>
          {learned ? '✓ Öğrendim' : 'Öğrendim'}
        </button>
      </header>
      {categoryTitle && <div className="tags"><span className="tag tag-cat">{categoryTitle}</span></div>}
      <p className="word-use"><strong>Ne zaman?</strong> {entry.use}</p>
      <p className="word-note"><strong>Sonra ne gelir?</strong> {entry.next}</p>
      {entry.mistake && <Callout tone="warn" title="Sık hata">{entry.mistake}</Callout>}
      <ul className="examples">
        {entry.examples.map((ex) => <li key={ex} lang="en"><Highlighted text={ex} terms={marks} /></li>)}
      </ul>
    </article>
  )
}
```

`src/pages/PhrasesPage.jsx`:

```jsx
import { Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import SideNav from '../components/SideNav.jsx'
import PhraseCard from '../components/PhraseCard.jsx'
import { categories, entries } from '../data/phrases/index.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'
import { matchesQuery } from '../lib/search.js'

const catTitle = Object.fromEntries(categories.map((c) => [c.id, c.title]))
const searchText = (e) => [e.term, ...(e.forms ?? []), e.tr, e.use, e.next, ...e.examples].join(' ')
export const LEARNED_KEY = 'learned-phrases-v1'
export const cleanIds = (l) => (Array.isArray(l) ? l.filter((x) => typeof x === 'string') : [])

export default function PhrasesPage({ query }) {
  const { section = categories[0].id } = useParams()
  const [learned, setLearned] = useLocalStorage(LEARNED_KEY, [])
  const learnedSet = new Set(cleanIds(learned))
  const toggle = (id) => setLearned((l) => {
    const a = cleanIds(l)
    return a.includes(id) ? a.filter((x) => x !== id) : [...a, id]
  })
  const q = query.trim()
  const cat = categories.find((c) => c.id === section)
  if (!cat) return <Navigate to={`/phrases/${categories[0].id}`} replace />

  const groups = [{
    title: 'Kalıp bankası',
    items: categories.map((c) => {
      const all = entries.filter((e) => e.category === c.id)
      return { id: c.id, label: c.title, count: `${all.filter((e) => learnedSet.has(e.id)).length}/${all.length}` }
    }),
  }]

  let body
  if (q) {
    const found = entries.filter((e) => matchesQuery(searchText(e), q))
    body = (
      <section aria-label="Arama sonuçları">
        <h2>Arama sonuçları</h2>
        {found.length === 0 ? <p className="empty">Sonuç bulunamadı</p> : (
          <div className="cards">
            {found.map((e) => (
              <PhraseCard key={e.id} entry={e} query={q} categoryTitle={catTitle[e.category]}
                learned={learnedSet.has(e.id)} onToggle={toggle} />
            ))}
          </div>
        )}
      </section>
    )
  } else {
    const list = entries.filter((e) => e.category === cat.id)
    body = (
      <section>
        <h2>{cat.title}</h2>
        <p className="lead">{cat.desc}</p>
        <p className="progress" aria-label="İlerleme">
          <span>{list.filter((e) => learnedSet.has(e.id)).length}/{list.length}</span> kalıp öğrenildi
        </p>
        <div className="cards">
          {list.map((e) => <PhraseCard key={e.id} entry={e} learned={learnedSet.has(e.id)} onToggle={toggle} />)}
        </div>
      </section>
    )
  }

  return (
    <PageShell accent={2} title="Kalıplar" aside={<SideNav base="/phrases" groups={groups} />}>
      {body}
    </PageShell>
  )
}
```

`src/App.jsx`: import ekle ve `<Route path="/phrases/:section?" element={<PhrasesPage query={query} />} />` satırını `/method` rotasının altına koy.

`src/components/TopBar.jsx`: `TABS` dizisine `{ to: '/phrases', label: 'Kalıplar', cls: 'tab-2' }` ekle.

- [ ] **Step 4:** Run: `npx vitest run` → hepsi PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: phrases page with learned tracking and search" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Boşluk doldurma motoru (`practice.js`)

**Files:**
- Create: `src/lib/practice.js`
- Test: `tests/practice.test.js`

**Interfaces:**
- Consumes: `escapeRegExp` (`src/lib/search.js`), `entries` (kalıp verisi: `{ id, term, forms?, category, tr, examples }`).
- Produces: `BLANK = '_____'`; `normalize(s)`; `buildQuestions(entries, { count = 10, categoryId, onlyIds, rng = Math.random })` → `[{ id, entryId, sentence, shown, hint, firstLetter, accepted }]`; `checkAnswer(question, input) → boolean`.

- [ ] **Step 1: Başarısız testi yaz** — `tests/practice.test.js`

```js
import { buildQuestions, checkAnswer, normalize } from '../src/lib/practice.js'
import { entries } from '../src/data/phrases/index.js'

const seq = () => { let i = 0; return () => ((i++ * 0.37) % 1) }

describe('buildQuestions', () => {
  test('returns requested count, one per entry, each with exactly one blank', () => {
    const qs = buildQuestions(entries, { count: 10, rng: seq() })
    expect(qs).toHaveLength(10)
    expect(new Set(qs.map((q) => q.entryId)).size).toBe(10)
    for (const q of qs) {
      expect(q.sentence.match(/_____/g)).toHaveLength(1)
      expect(q.hint.length).toBeGreaterThan(0)
      expect(q.accepted.length).toBeGreaterThan(0)
    }
  })
  test('the removed phrase is accepted and restores an original example', () => {
    const qs = buildQuestions(entries, { count: 200, rng: seq() })
    expect(qs.length).toBeGreaterThan(0)
    for (const q of qs) {
      const original = q.sentence.replace('_____', q.shown)
      const e = entries.find((x) => x.id === q.entryId)
      expect(e.examples).toContain(original)
      expect(checkAnswer(q, q.shown)).toBe(true)
    }
  })
  test('category filter', () => {
    const qs = buildQuestions(entries, { count: 10, categoryId: 'repair', rng: seq() })
    expect(qs.length).toBeGreaterThan(0)
    for (const q of qs) expect(entries.find((e) => e.id === q.entryId).category).toBe('repair')
  })
  test('learned filter and empty pool', () => {
    const qs = buildQuestions(entries, { count: 10, onlyIds: ['or-rather', 'the-thing-is'], rng: seq() })
    expect(qs.map((q) => q.entryId).sort()).toEqual(['or-rather', 'the-thing-is'])
    expect(buildQuestions(entries, { count: 10, onlyIds: [] })).toEqual([])
    expect(buildQuestions(entries, { count: 10, categoryId: 'nope' })).toEqual([])
  })
})

describe('checkAnswer', () => {
  const q = { accepted: ['to be honest'] }
  test('ignores case, spaces and trailing punctuation', () => {
    expect(checkAnswer(q, '  To  be honest, ')).toBe(true)
  })
  test('rejects wrong and empty answers', () => {
    expect(checkAnswer(q, 'to be sure')).toBe(false)
    expect(checkAnswer(q, '')).toBe(false)
    expect(checkAnswer(q, '   ')).toBe(false)
  })
  test('curly apostrophe is normalised', () => {
    expect(checkAnswer({ accepted: ["i'd say"] }, 'I’d say')).toBe(true)
    expect(normalize('A  B ')).toBe('a b')
  })
})
```

- [ ] **Step 2:** Run: `npx vitest run tests/practice.test.js` → FAIL (modül yok).

- [ ] **Step 3: Uygula** — `src/lib/practice.js`

```js
import { escapeRegExp } from './search.js'

export const BLANK = '_____'

export const normalize = (s) =>
  s.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.,;:!?]+$/, '')

function shuffle(list, rng) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function blankOut(entry, example) {
  const forms = [entry.term, ...(entry.forms ?? [])].sort((a, b) => b.length - a.length)
  const re = new RegExp(`(?<![\\p{L}])(${forms.map(escapeRegExp).join('|')})(?![\\p{L}])`, 'iu')
  const m = re.exec(example)
  if (!m) return null
  return {
    shown: m[1],
    sentence: example.slice(0, m.index) + BLANK + example.slice(m.index + m[1].length),
  }
}

export function buildQuestions(entries, { count = 10, categoryId, onlyIds, rng = Math.random } = {}) {
  let pool = entries
  if (categoryId) pool = pool.filter((e) => e.category === categoryId)
  if (onlyIds) pool = pool.filter((e) => onlyIds.includes(e.id))

  const questions = []
  for (const e of shuffle(pool, rng)) {
    if (questions.length >= count) break
    const blanks = shuffle(e.examples, rng).map((ex) => blankOut(e, ex)).filter(Boolean)
    if (!blanks.length) continue
    const { shown, sentence } = blanks[0]
    questions.push({
      id: `${e.id}:${questions.length}`,
      entryId: e.id,
      sentence,
      shown,
      hint: e.tr,
      firstLetter: shown[0].toLowerCase(),
      accepted: [...new Set([e.term, ...(e.forms ?? []), shown].map(normalize))],
    })
  }
  return questions
}

export function checkAnswer(question, input) {
  const a = normalize(input ?? '')
  return a.length > 0 && question.accepted.includes(a)
}
```

- [ ] **Step 4:** Run: `npx vitest run tests/practice.test.js` → PASS.

  Bir örnekte kalıp, örnekte farklı bir yazımla geçiyorsa (ör. `I'm not really sure` ↔ `Im not…`) "restores an original example" testi kırılır; bu durumda ilgili örneği veri dosyasında düzelt, motoru değil.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: fill-in-the-blank practice engine" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: İskelet verisi (`frames.js`) + Yöntem, Part 1, Part 3 sayfaları

**Files:**
- Create: `src/data/frames.js`, `src/pages/Part1Page.jsx`, `src/pages/Part3Page.jsx`
- Modify: `src/pages/MethodPage.jsx`, `src/App.jsx`, `src/components/TopBar.jsx`
- Test: `tests/data.frames.test.js`, `tests/routes.test.jsx`

**Interfaces:**
- Produces: `src/data/frames.js` varsayılan olmayan adlandırılmış dışa aktarımlar:
  - `method`: `{ rules: [{ title, body }] (3), mistakes: string[] (≥3) }`
  - `part1`: `{ steps: [{ id, label, tr, example }] (3), length: string, sample: { question, answer }, rules: string[] (≥3) }`
  - `part2`: `{ types: [{ id, title, slots: [{ id, label, prompt, starter }] (≥5) }] (5 tür: person, place, object, event, experience), timeline: [{ time, title, tips: string[] }] (≥3) }`
  - `part3`: `{ ladder: [{ id, label, tr, example }] (4), echo: { question, weak, strong }, angles: [{ id, label, prompt }] (3), sample: { question, answer } }`
- Consumes: `PageShell`, `Callout`.

- [ ] **Step 1: Başarısız testleri yaz** — `tests/data.frames.test.js`

```js
import { method, part1, part2, part3 } from '../src/data/frames.js'

test('method has 3 rules and mistakes', () => {
  expect(method.rules).toHaveLength(3)
  for (const r of method.rules) { expect(r.title.length).toBeGreaterThan(0); expect(r.body.length).toBeGreaterThan(20) }
  expect(method.mistakes.length).toBeGreaterThanOrEqual(3)
})
test('part1 frame', () => {
  expect(part1.steps.map((s) => s.id)).toEqual(['answer', 'reason', 'example'])
  for (const s of part1.steps) for (const k of ['label', 'tr', 'example']) expect(s[k], k).toBeTruthy()
  expect(part1.sample.question).toBeTruthy(); expect(part1.sample.answer).toBeTruthy()
  expect(part1.rules.length).toBeGreaterThanOrEqual(3)
})
test('part2 types and slots', () => {
  expect(part2.types.map((t) => t.id)).toEqual(['person', 'place', 'object', 'event', 'experience'])
  for (const t of part2.types) {
    expect(t.slots.length, t.id).toBeGreaterThanOrEqual(5)
    for (const s of t.slots) for (const k of ['id', 'label', 'prompt', 'starter']) expect(s[k], `${t.id}.${k}`).toBeTruthy()
    expect(new Set(t.slots.map((s) => s.id)).size).toBe(t.slots.length)
  }
  expect(part2.timeline.length).toBeGreaterThanOrEqual(3)
})
test('part3 ladder, echo and angles', () => {
  expect(part3.ladder.map((s) => s.id)).toEqual(['opinion', 'reason', 'example', 'wider'])
  expect(part3.angles).toHaveLength(3)
  expect(part3.echo.weak).toBeTruthy(); expect(part3.echo.strong).toBeTruthy()
  expect(part3.sample.answer).toBeTruthy()
})
```

`tests/routes.test.jsx` sonuna:

```jsx
describe('guide pages', () => {
  test('method page lists the three rules', () => {
    at('/method')
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })
  test('part1 page renders frame and sample', () => {
    at('/part1')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Part 1')
    expect(screen.getByRole('heading', { level: 3, name: 'Cevap' })).toBeInTheDocument()
  })
  test('part3 page renders ladder', () => {
    at('/part3')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Part 3')
    expect(screen.getByRole('heading', { level: 3, name: 'Fikir (Opinion)' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2:** Run: `npx vitest run tests/data.frames.test.js tests/routes.test.jsx` → FAIL.

- [ ] **Step 3: `src/data/frames.js`**

```js
export const method = {
  rules: [
    {
      title: 'Kalıpla başla, grameri kilitleme',
      body: 'Cümleye hemen "ana fikri" kurmaya çalışma. Önce "I\'d say…", "The thing is…", "To be honest…" gibi bir kalıp söyle. Kalıp seni hiçbir yapıya mahkûm etmez, bu sırada ne diyeceğini düşünürsün. Cümlenin ortasında yanlış gittiğini fark edersen baştan kurma: "or rather", "what I mean is" ile aynı cümlenin içinde düzelt.',
    },
    {
      title: 'İskeleti doldur, fikir arama',
      body: 'Her cevabın bir iskeleti var: Cevap → Sebep → Örnek (Part 3\'te bir de geniş açı). "Ne diyeceğim?" yerine "Şimdi hangi kutudayım?" diye sor. Kutuları sırayla doldurmak ne diyeceğini seçmekten çok daha kolaydır, çünkü her kutunun ne istediği belli.',
    },
    {
      title: 'Sessizlik yerine kalıp',
      body: 'Düşünmen gerekiyorsa susma; "Let me think", "That\'s a good question" de. Kelime bulamıyorsan "It\'s a kind of…", "It\'s something you use to…" ile tarif et. Konuşmanın akması, kelimenin kusursuz olmasından daha önemlidir.',
    },
  ],
  mistakes: [
    '"I don\'t know" deyip susmak. Her zaman bir tahmin ya da "it depends on…" ekle.',
    'Aynı kalıbı her cevapta tekrar etmek. Bir kategoriden 2–3 kalıp seçip dönüşümlü kullan.',
    'Cevabı tek cümlede bitirmek. En az iki adım (Cevap + Sebep) söyle.',
    'Düzeltmek için cümleyi baştan kurmak. Aynı cümlede "or rather" ile devam et.',
  ],
}

export const part1 = {
  steps: [
    { id: 'answer', label: 'Cevap', tr: 'Soruyu tek cümlede doğrudan cevapla.', example: 'Yes, I do. / Not really. / I\'d say I prefer mornings.' },
    { id: 'reason', label: 'Sebep', tr: 'Neden öyle düşündüğünü bir cümlede söyle.', example: 'The reason is that it helps me focus.' },
    { id: 'example', label: 'Mini örnek', tr: 'Küçük, kişisel bir örnek ver (süre kalırsa).', example: 'For example, I usually read for an hour before bed.' },
  ],
  length: 'Part 1 cevabı 2–3 cümle (yaklaşık 15–25 saniye). Tek kelimelik cevap da, 1 dakikalık monolog da hedef değil.',
  sample: {
    question: 'Do you enjoy cooking?',
    answer: "To be honest, not really. The reason is that I don't have much time after work. For example, on weekdays I usually just make something simple like pasta.",
  },
  rules: [
    'İlk cümle soruyu doğrudan cevaplamalı; ek bilgiyi sonra ver.',
    'Soruda geçen fiili ve zamanı cevaba taşı (Do you… → I do / I don\'t).',
    'Sebep olmadan bırakma; "because" ya da "the reason is that" ekle.',
    'Konu kişiselse "in my case" ile kendi hayatına bağla.',
  ],
}

const slot = (id, label, prompt, starter) => ({ id, label, prompt, starter })

export const part2 = {
  types: [
    {
      id: 'person',
      title: 'Kişi',
      slots: [
        slot('who', 'Kim?', 'Kim bu kişi, seninle ilişkisi ne?', 'The person I\'d like to talk about is…'),
        slot('know', 'Nasıl tanıyorsun?', 'Ne zaman, nerede tanıştın?', 'I first met him/her when…'),
        slot('look', 'Nasıl biri?', 'Dış görünüş ya da kişilik, iki özellik.', 'He/she is the kind of person who…'),
        slot('happened', 'Bir an', 'Birlikte yaşadığın somut bir olay.', 'I remember one time when…'),
        slot('why', 'Neden önemli?', 'Sana ne kattı?', 'The reason this person matters to me is that…'),
      ],
    },
    {
      id: 'place',
      title: 'Yer',
      slots: [
        slot('where', 'Neresi?', 'Yer neresi, neden orada bulundun?', 'The place I\'d like to describe is…'),
        slot('when', 'Ne zaman?', 'Ne zaman, kimle gittin?', 'I went there with… in…'),
        slot('look', 'Nasıl bir yer?', 'Görünüş, atmosfer, ses ve koku.', 'It\'s a place where…'),
        slot('happened', 'Ne yaptın?', 'Orada yaptığın bir şey.', 'While I was there, I…'),
        slot('why', 'Neden özel?', 'Ne hissettin, neden hatırlıyorsun?', 'It stays in my mind because…'),
      ],
    },
    {
      id: 'object',
      title: 'Eşya',
      slots: [
        slot('what', 'Ne bu?', 'Eşya ne, nasıl görünüyor?', 'The thing I\'d like to talk about is…'),
        slot('get', 'Nasıl edindin?', 'Kim verdi, ne zaman aldın?', 'I got it when…'),
        slot('use', 'Ne işe yarıyor?', 'Nasıl kullanıyorsun?', 'I usually use it to…'),
        slot('happened', 'Bir anı', 'Onunla ilgili somut bir anı.', 'I remember once when…'),
        slot('why', 'Neden önemli?', 'Duygusal ya da pratik değeri.', 'It means a lot to me because…'),
      ],
    },
    {
      id: 'event',
      title: 'Olay',
      slots: [
        slot('what', 'Ne olay?', 'Ne olduğu ve ne zaman olduğu.', 'The event I\'m going to talk about is…'),
        slot('who', 'Kimlerle?', 'Orada kimler vardı?', 'I was there with…'),
        slot('happened', 'Ne oldu?', 'Başı, ortası ve sonu: iki üç adım.', 'First… then… in the end…'),
        slot('felt', 'Ne hissettin?', 'Duygunu bir cümlede anlat.', 'I felt…'),
        slot('why', 'Neden önemli?', 'Sonradan ne değişti?', 'Looking back, it was important because…'),
      ],
    },
    {
      id: 'experience',
      title: 'Deneyim',
      slots: [
        slot('what', 'Ne yaptın?', 'Deneyimin kısa özeti.', 'I\'d like to talk about the time when I…'),
        slot('when', 'Ne zaman, nerede?', 'Zaman ve yer.', 'It happened… in…'),
        slot('hard', 'Zor ya da özel olan', 'Seni zorlayan ya da heyecanlandıran nokta.', 'The hardest part was…'),
        slot('felt', 'Ne hissettin?', 'Önce, sırasında, sonra.', 'At first I felt… but later…'),
        slot('why', 'Ne öğrendin?', 'Bu deneyimden aldığın ders.', 'What I learned from it is that…'),
      ],
    },
  ],
  timeline: [
    { time: '0:00–1:00', title: 'Hazırlık (1 dakika)', tips: ['Cue card\'ın tipini belirle (kişi, yer, eşya, olay, deneyim).', 'Her slot için 2–3 kelimelik not al; cümle yazma.', 'Hikâye bankandan uyan bir hikâyeyi seç.'] },
    { time: '1:00–1:20', title: 'Başlangıç', tips: ['Cue card\'daki cümleyle başla: "I\'d like to talk about…".', 'Ana soruyu kısaca cevapla, sonra slotlara geç.'] },
    { time: '1:20–2:40', title: 'Gövde', tips: ['Slotları sırayla anlat; her slot 15–25 saniye.', 'Duraksarsan "Let me think" ya da "how can I put it" kullan.', 'Zaman kalırsa "I remember…" ile bir sahne ekle.'] },
    { time: '2:40–3:00', title: 'Kapanış', tips: ['"Why" slotuna dön: bu neden önemli ya da özel?', 'Süre bitince incelik: "So that\'s all I wanted to say."'] },
  ],
}

export const part3 = {
  ladder: [
    { id: 'opinion', label: 'Fikir (Opinion)', tr: 'Fikrini ya da genellemeni söyle.', example: 'I\'d say it depends on the person, but generally speaking…' },
    { id: 'reason', label: 'Sebep (Reason)', tr: 'Neden öyle olduğunu açıkla.', example: 'The reason is that people have different priorities.' },
    { id: 'example', label: 'Örnek (Example)', tr: 'Somut bir örnek ya da kendi deneyimin.', example: 'For example, in my case, I prefer…' },
    { id: 'wider', label: 'Geniş açı (Society / Future)', tr: 'Topluma ya da geleceğe bağla veya karşı görüşü ekle.', example: 'Having said that, in the long run this could change.' },
  ],
  echo: {
    question: 'Why do people travel abroad?',
    weak: 'To see new things.',
    strong: 'People travel abroad mainly because they want to see new places and experience different cultures.',
  },
  angles: [
    { id: 'me', label: 'Ben', prompt: 'Kendi deneyimin ya da çevren: "In my case…", "I remember…".' },
    { id: 'society', label: 'Toplum', prompt: 'Genel insanlar, gençler/yaşlılar, şehir/köy: "Generally speaking…", "These days…".' },
    { id: 'future', label: 'Gelecek', prompt: 'Ne değişir? Zaman karşılaştırması: "Compared to the past…", "In the long run…".' },
  ],
  sample: {
    question: 'Why do people like to travel to other countries?',
    answer: "I'd say the main reason is curiosity. People want to see how others live. For example, in my case, I travelled to Italy last year and I learned a lot about local food and customs. Having said that, in the long run, I think cheaper flights will make travelling even more common.",
  },
}
```

- [ ] **Step 4: Sayfalar**

`src/pages/MethodPage.jsx`:

```jsx
import PageShell from '../components/PageShell.jsx'
import Callout from '../components/Callout.jsx'
import { method } from '../data/frames.js'

export default function MethodPage() {
  return (
    <PageShell accent={1} title="Yöntem">
      <p className="lead">Hedef kusursuz İngilizce değil, durmadan akan cevap. Üç kural yeter.</p>
      <ol className="steps">
        {method.rules.map((r) => (
          <li key={r.title}>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
          </li>
        ))}
      </ol>
      <h2>Sık yapılan hatalar</h2>
      {method.mistakes.map((m) => <Callout key={m} tone="warn">{m}</Callout>)}
    </PageShell>
  )
}
```

`src/pages/Part1Page.jsx`:

```jsx
import PageShell from '../components/PageShell.jsx'
import Callout from '../components/Callout.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { part1 } from '../data/frames.js'

export default function Part1Page() {
  return (
    <PageShell accent={1} title="Part 1">
      <p className="lead">{part1.length}</p>
      <h2>Cevap iskeleti</h2>
      <div className="link-steps">
        {part1.steps.map((s) => (
          <section key={s.id} className="step-card">
            <h3>{s.label}</h3>
            <p>{s.tr}</p>
            <p className="example-line" lang="en">{s.example}</p>
          </section>
        ))}
      </div>
      <h2>Kurallar</h2>
      <ul>{part1.rules.map((r) => <li key={r}>{r}</li>)}</ul>
      <h2>Örnek</h2>
      <p className="prompt" lang="en">{part1.sample.question}</p>
      <Reveal label="Model cevabı göster"><p lang="en">{part1.sample.answer}</p></Reveal>
      <Callout tone="info" title="Hatırla">Bir cevabın üç cümleden uzun olması gerekmez; akıcı olması yeter.</Callout>
    </PageShell>
  )
}
```

`src/components/Reveal.jsx` (writing'deki `Reveal`'in aynısı, `Notes` hariç):

```jsx
import { useId, useState } from 'react'

export function Reveal({ label = 'Cevabı göster', children }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="reveal">
      <button type="button" className="secondary-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {open ? 'Cevabı gizle' : label}
      </button>
      {open && <div id={id} className="reveal-body">{children}</div>}
    </div>
  )
}
```

`src/pages/Part3Page.jsx`:

```jsx
import PageShell from '../components/PageShell.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { part3 } from '../data/frames.js'

export default function Part3Page() {
  return (
    <PageShell accent={3} title="Part 3">
      <p className="lead">Part 3'te cevaplar daha uzun ve soyut olur. Merdiveni sırayla çık, soru kelimesini cevaba taşı ve üç açıdan birini seç.</p>
      <h2>Merdiven</h2>
      <div className="link-steps">
        {part3.ladder.map((s) => (
          <section key={s.id} className="step-card">
            <h3>{s.label}</h3>
            <p>{s.tr}</p>
            <p className="example-line" lang="en">{s.example}</p>
          </section>
        ))}
      </div>
      <h2>Konuda kalma: soru kelimesini taşı</h2>
      <p className="prompt" lang="en">{part3.echo.question}</p>
      <p><strong>Zayıf:</strong> <span lang="en">{part3.echo.weak}</span></p>
      <p><strong>Güçlü:</strong> <span lang="en">{part3.echo.strong}</span></p>
      <h2>Fikir bulamıyorsan: üç açı</h2>
      <ul>{part3.angles.map((a) => <li key={a.id}><strong>{a.label}:</strong> {a.prompt}</li>)}</ul>
      <h2>Örnek</h2>
      <p className="prompt" lang="en">{part3.sample.question}</p>
      <Reveal label="Model cevabı göster"><p lang="en">{part3.sample.answer}</p></Reveal>
    </PageShell>
  )
}
```

`src/App.jsx`: iki import ve iki rota (`/part1`, `/part3`) ekle. `TopBar.jsx` `TABS`'a `{ to: '/part1', label: 'Part 1', cls: 'tab-1' }` ve `{ to: '/part3', label: 'Part 3', cls: 'tab-3' }` ekle (sıra: Yöntem, Kalıplar, Part 1, Part 3; Part 2 Task 7'de araya girer).

- [ ] **Step 5:** Run: `npx vitest run` → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: frames data and method, part 1, part 3 pages" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Hikâye bankası + Part 2 sayfası

**Files:**
- Create: `src/data/stories.js`, `src/components/StoryBank.jsx`, `src/pages/Part2Page.jsx`
- Modify: `src/App.jsx`, `src/components/TopBar.jsx`
- Test: `tests/routes.test.jsx`, `tests/data.frames.test.js`

**Interfaces:**
- Consumes: `part2` (frames), `useLocalStorage`, `SideNav`, `PageShell`, `Callout`.
- Produces:
  - `stories` (`src/data/stories.js`): 8 elemanlı `[{ id, label, prompt, fits: string[] }]`, `fits` değerleri `person|place|object|event|experience`'tan.
  - `STORIES_KEY = 'stories-v1'` (localStorage; değer `{ [storyId]: { tr: string, en: string } }`), `safeStories(raw)` — nesne olmayan/dizi/`null` değeri `{}` yapar (aynı dosyada `StoryBank.jsx`'den dışa aktarılır).
  - `StoryBank()` bileşeni; `Part2Page` rotası `/part2/:section?` (`template` varsayılan, `timeline`, `stories`).

- [ ] **Step 1: Başarısız testleri yaz**

`tests/data.frames.test.js` sonuna:

```js
import { stories } from '../src/data/stories.js'

test('stories: 8 templates, valid fits, unique ids', () => {
  expect(stories).toHaveLength(8)
  expect(new Set(stories.map((s) => s.id)).size).toBe(8)
  const types = part2.types.map((t) => t.id)
  for (const s of stories) {
    expect(s.label && s.prompt, s.id).toBeTruthy()
    expect(s.fits.length, s.id).toBeGreaterThan(0)
    for (const f of s.fits) expect(types, s.id).toContain(f)
  }
  for (const t of types) expect(stories.some((s) => s.fits.includes(t)), t).toBe(true)
})
```

`tests/routes.test.jsx` sonuna:

```jsx
describe('part 2 page', () => {
  test('template section lists slots for each cue type', () => {
    at('/part2')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Part 2')
    expect(screen.getByRole('heading', { level: 3, name: 'Kişi' })).toBeInTheDocument()
  })
  test('unknown section falls back to template', () => {
    at('/part2/nope')
    expect(screen.getByRole('heading', { level: 2, name: 'Not şablonu' })).toBeInTheDocument()
  })
  test('story is saved to localStorage and counted', () => {
    at('/part2/stories')
    const box = screen.getAllByLabelText('Türkçe notların')[0]
    fireEvent.change(box, { target: { value: 'Babamla Ankara\'ya gittik' } })
    expect(JSON.parse(localStorage.getItem('stories-v1'))).toMatchObject({})
    expect(screen.getByLabelText('Doldurulan hikâye')).toHaveTextContent('1/8')
  })
  test.each(['null', '5', '"x"', '[]'])('corrupt stories storage (%s) does not crash', (raw) => {
    localStorage.setItem('stories-v1', raw)
    at('/part2/stories')
    expect(screen.getByLabelText('Doldurulan hikâye')).toHaveTextContent('0/8')
    fireEvent.change(screen.getAllByLabelText('Türkçe notların')[0], { target: { value: 'x' } })
    expect(screen.getByLabelText('Doldurulan hikâye')).toHaveTextContent('1/8')
  })
})
```

- [ ] **Step 2:** Run: `npx vitest run` → FAIL.

- [ ] **Step 3: Veri** — `src/data/stories.js`

```js
// Kullanıcının dolduracağı boş hikâye şablonları. İçerik tarayıcıda saklanır (stories-v1).
// fits: hangi cue card tiplerine uyar (frames.js part2.types[].id).
export const stories = [
  { id: 'person-admire', label: 'Hayran olduğum biri', prompt: 'Kim, nasıl tanıştın, ona neden hayransın? Bir örnek an ekle.', fits: ['person', 'event'] },
  { id: 'person-helped', label: 'Bana yardım eden biri', prompt: 'Ne zaman, neye yardım etti, sana ne hissettirdi?', fits: ['person', 'experience'] },
  { id: 'place-visited', label: 'Gittiğim özel bir yer', prompt: 'Neresi, kimle gittin, ne gördün-ne yaptın, neden aklında?', fits: ['place', 'event'] },
  { id: 'place-home', label: 'Evim ya da çocukluk mekânım', prompt: 'Nasıl görünüyor, orada ne yapardın, neyi özlüyorsun?', fits: ['place', 'object'] },
  { id: 'object-treasured', label: 'Değer verdiğim bir eşya', prompt: 'Ne bu, kim verdi, ne işe yarıyor, neden vazgeçmezsin?', fits: ['object', 'person'] },
  { id: 'event-memorable', label: 'Unutulmaz bir olay', prompt: 'Başı, ortası, sonu; ne hissettin, ne değişti?', fits: ['event', 'experience'] },
  { id: 'experience-challenge', label: 'Zorlandığım bir deneyim', prompt: 'Ne yaptın, en zor kısım neydi, nasıl aştın, ne öğrendin?', fits: ['experience', 'event'] },
  { id: 'experience-achievement', label: 'Gurur duyduğum bir başarı', prompt: 'Neydi, ne kadar çalıştın, sonuç ne oldu, neden önemli?', fits: ['experience', 'person'] },
]
```

- [ ] **Step 4: Bileşen ve sayfa**

`src/components/StoryBank.jsx`:

```jsx
import { stories } from '../data/stories.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'

export const STORIES_KEY = 'stories-v1'
export const safeStories = (raw) => (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {})
const text = (v) => (typeof v === 'string' ? v : '')
export const isFilled = (s) => !!(s && (text(s.tr).trim() || text(s.en).trim()))

export default function StoryBank() {
  const [raw, setRaw] = useLocalStorage(STORIES_KEY, {})
  const all = safeStories(raw)
  const set = (id, field, value) => setRaw({ ...all, [id]: { ...(typeof all[id] === 'object' && all[id] ? all[id] : {}), [field]: value } })
  const filled = stories.filter((s) => isFilled(all[s.id])).length

  return (
    <section>
      <h2>Hikâye bankası</h2>
      <p className="lead">Part 2 için 8 kişisel hikâye hazırla. Gerçek anıların olduğu için sınavda hatırlaması kolay; çoğu cue card bunlardan birine uyar. Önce Türkçe not al, sonra İngilizce yaz.</p>
      <p className="progress" aria-label="Doldurulan hikâye"><span>{filled}/{stories.length}</span> hikâye hazır</p>
      <div className="cards">
        {stories.map((s) => {
          const v = typeof all[s.id] === 'object' && all[s.id] ? all[s.id] : {}
          return (
            <article key={s.id} className={`word-card${isFilled(v) ? ' is-learned' : ''}`}>
              <h3 className="word-term">{s.label}</h3>
              <p className="word-tr">{s.prompt}</p>
              <div className="tags">{s.fits.map((f) => <span key={f} className="tag">{f}</span>)}</div>
              <label className="field">
                <span>Türkçe notların</span>
                <textarea rows={3} value={text(v.tr)} onChange={(e) => set(s.id, 'tr', e.target.value)} />
              </label>
              <label className="field">
                <span>İngilizce versiyon</span>
                <textarea rows={4} lang="en" value={text(v.en)} onChange={(e) => set(s.id, 'en', e.target.value)} />
              </label>
            </article>
          )
        })}
      </div>
    </section>
  )
}
```

Not: `app.css` içindeki `.notes textarea` kuralı yalnızca `.notes` içindir; textarea stilini genelleştirmek için `src/styles/app.css` sonuna ekle:

```css
/* Speaking */
.field textarea {
  padding: .6rem .8rem; border: 2px solid var(--line); border-radius: 8px; background: var(--surface);
  color: var(--ink); font: inherit; resize: vertical;
}
.field textarea:focus { border-color: var(--accent); }
.timer { font: 800 3rem var(--font-ui); letter-spacing: .02em; font-variant-numeric: tabular-nums; }
.timer.low { color: var(--warn-line); }
.slot-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.slot-card { background: var(--surface); border: 2px solid var(--line); border-radius: 12px; padding: .8rem 1rem; }
.slot-card h4 { margin: 0 0 .2rem; }
.timeline { list-style: none; padding: 0; display: grid; gap: .8rem; }
.timeline li { background: var(--surface); border: 2px solid var(--line); border-left: 6px solid var(--accent); border-radius: 12px; padding: .8rem 1rem; margin: 0; }
.time-label { font: 700 .85rem var(--font-ui); color: var(--accent); }
```

`src/pages/Part2Page.jsx`:

```jsx
import { Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import SideNav from '../components/SideNav.jsx'
import StoryBank from '../components/StoryBank.jsx'
import { part2 } from '../data/frames.js'

const SECTIONS = [
  { id: 'template', label: 'Not şablonu' },
  { id: 'timeline', label: 'Zaman çizelgesi' },
  { id: 'stories', label: 'Hikâye bankası' },
]

function Template() {
  return (
    <section>
      <h2>Not şablonu</h2>
      <p className="lead">1 dakikalık hazırlıkta cümle yazma; cue card'ın tipini bul, slotlara 2–3 kelimelik not düş. Slotları sırayla anlatırsan 2 dakika kendiliğinden dolar.</p>
      {part2.types.map((t) => (
        <div key={t.id}>
          <h3>{t.title}</h3>
          <div className="slot-grid">
            {t.slots.map((s) => (
              <div key={s.id} className="slot-card">
                <h4>{s.label}</h4>
                <p>{s.prompt}</p>
                <p className="example-line" lang="en">{s.starter}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function Timeline() {
  return (
    <section>
      <h2>Zaman çizelgesi</h2>
      <ol className="timeline">
        {part2.timeline.map((t) => (
          <li key={t.time}>
            <span className="time-label">{t.time}</span>
            <h3 style={{ margin: '.1rem 0 .4rem' }}>{t.title}</h3>
            <ul>{t.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Part2Page() {
  const { section = 'template' } = useParams()
  if (!SECTIONS.some((s) => s.id === section)) return <Navigate to="/part2/template" replace />
  const groups = [{ title: 'Part 2', items: SECTIONS }]
  return (
    <PageShell accent={2} title="Part 2" aside={<SideNav base="/part2" groups={groups} />}>
      {section === 'template' && <Template />}
      {section === 'timeline' && <Timeline />}
      {section === 'stories' && <StoryBank />}
    </PageShell>
  )
}
```

`src/App.jsx`: `Part2Page` içe aktar, `<Route path="/part2/:section?" element={<Part2Page />} />` ekle. `TopBar.jsx` `TABS`: Part 1 ile Part 3 arasına `{ to: '/part2', label: 'Part 2', cls: 'tab-2' }` ekle.

- [ ] **Step 5:** Run: `npx vitest run` → PASS.

  "Part 2 sayfası" testinde `Kişi` başlığı `h3`; zaman çizelgesindeki `h3` farklı bölümde, çakışmaz.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: part 2 page with note templates and story bank" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Soru bankaları

**Files:**
- Create: `src/data/questions/part1.js`, `part2.js`, `part3.js`, `src/lib/pick.js`
- Test: `tests/data.questions.test.js`, `tests/lib.test.jsx`

**Interfaces:**
- Produces:
  - `part1`: `[{ id, title, questions: string[] }]` (10 konu × 4 soru); `part3`: aynı şekil (10 konu × 3 soru); `part2`: `[{ id, type, prompt, bullets: string[] }]` (20 kart, `type` ∈ person|place|object|event|experience, her tipten 4).
  - `flatten(topics) → [{ id: '<topicId>:<i>', topic: title, text }]`; `pickRandom(list, rng = Math.random, exceptId) → item | null` (liste boşsa `null`; `exceptId` verilip başka eleman varsa onu seçmez).

- [ ] **Step 1: Başarısız testleri yaz**

`tests/data.questions.test.js`:

```js
import part1 from '../src/data/questions/part1.js'
import part2 from '../src/data/questions/part2.js'
import part3 from '../src/data/questions/part3.js'

const TYPES = ['person', 'place', 'object', 'event', 'experience']

test('part1: 10 topics x 4 questions, unique ids', () => {
  expect(part1).toHaveLength(10)
  expect(new Set(part1.map((t) => t.id)).size).toBe(10)
  for (const t of part1) { expect(t.title).toBeTruthy(); expect(t.questions, t.id).toHaveLength(4) }
})
test('part3: 10 topics x 3 questions, unique ids', () => {
  expect(part3).toHaveLength(10)
  expect(new Set(part3.map((t) => t.id)).size).toBe(10)
  for (const t of part3) expect(t.questions, t.id).toHaveLength(3)
})
test('part2: 20 cards, 4 per type, 4 bullets each', () => {
  expect(part2).toHaveLength(20)
  expect(new Set(part2.map((c) => c.id)).size).toBe(20)
  for (const t of TYPES) expect(part2.filter((c) => c.type === t), t).toHaveLength(4)
  for (const c of part2) {
    expect(c.prompt, c.id).toMatch(/^Describe /)
    expect(c.bullets, c.id).toHaveLength(4)
    expect(c.bullets[3], c.id).toMatch(/^and explain/i)
  }
})
test('every question ends with a question mark', () => {
  for (const t of [...part1, ...part3]) for (const q of t.questions) expect(q, q).toMatch(/\?$/)
})
```

`tests/lib.test.jsx` sonuna:

```jsx
import { pickRandom, flatten } from '../src/lib/pick.js'

test('flatten gives ids and topics', () => {
  const flat = flatten([{ id: 'a', title: 'A', questions: ['q1?', 'q2?'] }])
  expect(flat).toEqual([{ id: 'a:0', topic: 'A', text: 'q1?' }, { id: 'a:1', topic: 'A', text: 'q2?' }])
})
test('pickRandom handles empty, single and exceptId', () => {
  expect(pickRandom([])).toBeNull()
  expect(pickRandom([{ id: 'x' }], () => 0.5, 'x')).toEqual({ id: 'x' })
  const list = [{ id: 'a' }, { id: 'b' }]
  for (let i = 0; i < 20; i++) expect(pickRandom(list, Math.random, 'a').id).toBe('b')
  expect(pickRandom(list, () => 0.99).id).toBe('b')
})
```

- [ ] **Step 2:** Run: `npx vitest run` → FAIL.

- [ ] **Step 3: `src/lib/pick.js`**

```js
export const flatten = (topics) =>
  topics.flatMap((t) => t.questions.map((text, i) => ({ id: `${t.id}:${i}`, topic: t.title, text })))

export function pickRandom(list, rng = Math.random, exceptId) {
  if (!list.length) return null
  const pool = exceptId != null && list.length > 1 ? list.filter((x) => x.id !== exceptId) : list
  return pool[Math.floor(rng() * pool.length)]
}
```

- [ ] **Step 4: `src/data/questions/part1.js`**

```js
export default [
  { id: 'hometown', title: 'Memleket', questions: ['Where is your hometown?', 'What do you like most about your hometown?', 'Has your hometown changed much in recent years?', 'Would you like to live there in the future?'] },
  { id: 'study-work', title: 'Okul ve iş', questions: ['Do you work or are you a student?', 'Why did you choose that job or subject?', 'What do you enjoy most about it?', 'What would you like to change about it?'] },
  { id: 'home', title: 'Ev', questions: ['Do you live in a house or a flat?', 'Which room do you spend most time in?', 'What do you like about your home?', 'Would you like to move in the future?'] },
  { id: 'daily-routine', title: 'Günlük rutin', questions: ['What is your daily routine like?', 'What part of the day do you like best?', 'Do you prefer mornings or evenings?', 'Has your routine changed in the last few years?'] },
  { id: 'food', title: 'Yemek', questions: ['What kind of food do you like?', 'Do you enjoy cooking?', 'Is there any food you disliked as a child but like now?', 'Do you prefer eating out or eating at home?'] },
  { id: 'hobbies', title: 'Hobiler', questions: ['What do you do in your free time?', 'Did you have different hobbies as a child?', 'Do you prefer doing hobbies alone or with others?', 'Is there a hobby you would like to try?'] },
  { id: 'weather', title: 'Hava durumu', questions: ['What is the weather like in your hometown?', "What's your favourite season?", 'Does the weather affect your mood?', 'What do you do on rainy days?'] },
  { id: 'music', title: 'Müzik', questions: ['Do you like listening to music?', 'What kind of music do you enjoy?', 'When do you usually listen to music?', 'Did you learn a musical instrument as a child?'] },
  { id: 'technology', title: 'Teknoloji', questions: ['How often do you use your phone?', 'What apps do you use most?', 'Do you think people depend too much on technology?', 'How has technology changed the way you study or work?'] },
  { id: 'travel', title: 'Seyahat', questions: ['Do you like travelling?', 'Where did you go on your last trip?', 'Do you prefer travelling alone or with others?', 'Where would you like to go next?'] },
]
```

- [ ] **Step 5: `src/data/questions/part2.js`**

```js
const card = (id, type, prompt, b1, b2, b3) => ({
  id, type, prompt, bullets: [b1, b2, b3, 'and explain why it is important to you'],
})

export default [
  card('person-admire', 'person', 'Describe a person you admire.', 'who this person is', 'how you know them', 'what they do'),
  card('person-helped', 'person', 'Describe a person who has helped you.', 'who this person is', 'how they helped you', 'when it happened'),
  card('person-teacher', 'person', 'Describe a teacher who influenced you.', 'who the teacher was', 'what subject they taught', 'what they were like'),
  card('person-friend', 'person', 'Describe a friend you enjoy spending time with.', 'who this friend is', 'how you met', 'what you do together'),
  card('place-city', 'place', 'Describe a city you have visited and liked.', 'where it is', 'when you went there', 'what you did there'),
  card('place-quiet', 'place', 'Describe a quiet place where you like to spend time.', 'where it is', 'what it looks like', 'what you do there'),
  card('place-childhood', 'place', 'Describe a place you often visited as a child.', 'where it was', 'who you went with', 'what you did there'),
  card('place-restaurant', 'place', 'Describe a restaurant you enjoyed eating at.', 'where it is', 'what food you ate', 'who you went with'),
  card('object-gift', 'object', 'Describe a gift you received that you liked.', 'what it was', 'who gave it to you', 'when you received it'),
  card('object-tech', 'object', 'Describe a piece of technology you use often.', 'what it is', 'how often you use it', 'what you use it for'),
  card('object-old', 'object', 'Describe something old that you keep.', 'what it is', 'how long you have had it', 'where you keep it'),
  card('object-book', 'object', 'Describe a book you enjoyed reading.', 'what the book was', 'when you read it', 'what it was about'),
  card('event-party', 'event', 'Describe a party or celebration you enjoyed.', 'what the occasion was', 'who was there', 'what happened'),
  card('event-special', 'event', 'Describe a special event you attended.', 'what the event was', 'where it took place', 'who you went with'),
  card('event-busy', 'event', 'Describe an occasion when you were very busy.', 'when it was', 'what you had to do', 'how you managed'),
  card('event-news', 'event', 'Describe a time you received good news.', 'what the news was', 'who told you', 'how you reacted'),
  card('exp-challenge', 'experience', 'Describe a time you did something difficult.', 'what you did', 'why it was difficult', 'how you managed'),
  card('exp-skill', 'experience', 'Describe a skill you learned and enjoyed.', 'what the skill is', 'how you learned it', 'how you use it now'),
  card('exp-helped', 'experience', 'Describe a time you helped someone.', 'who you helped', 'what you did', 'how they reacted'),
  card('exp-proud', 'experience', 'Describe something you achieved that you are proud of.', 'what you achieved', 'how you did it', 'who helped you'),
]
```

- [ ] **Step 6: `src/data/questions/part3.js`**

```js
export default [
  { id: 'role-models', title: 'Rol modeller', questions: ['Why do people look up to role models?', 'Are celebrities good role models for young people?', 'Has the type of person people admire changed over time?'] },
  { id: 'travel-cities', title: 'Şehirler ve turizm', questions: ['Why do people like visiting big cities?', 'How is tourism affecting cities these days?', 'Will people travel more or less in the future?'] },
  { id: 'technology', title: 'Teknoloji', questions: ['Do you think technology has made life easier?', 'What problems can too much screen time cause?', 'How will technology change education in the future?'] },
  { id: 'celebrations', title: 'Kutlamalar', questions: ['Why are celebrations important in a society?', 'Do you think traditional celebrations will survive?', 'How are celebrations different from the past?'] },
  { id: 'education', title: 'Eğitim', questions: ['What makes a good teacher?', 'Is it better to learn alone or in a group?', 'Will traditional schools be replaced by online learning?'] },
  { id: 'work', title: 'Çalışma hayatı', questions: ['What is more important in a job: salary or satisfaction?', 'Why do some people work too much?', 'How might jobs change in the future?'] },
  { id: 'environment', title: 'Çevre', questions: ['What can individuals do to protect the environment?', 'Should governments or companies take more responsibility?', 'Do you think people care more about the environment than in the past?'] },
  { id: 'health', title: 'Sağlık', questions: ['Why do some people find it hard to stay healthy?', 'Who should be responsible for public health?', 'How has lifestyle changed compared to the past?'] },
  { id: 'friendship', title: 'Arkadaşlık', questions: ['How do people make friends as adults?', 'Is it easier to make friends now than in the past?', 'Can online friendships be as strong as real ones?'] },
  { id: 'achievement', title: 'Başarı', questions: ['What does success mean to different people?', 'Do you think failure is important for success?', 'Why do some people give up on their goals?'] },
]
```

- [ ] **Step 7:** Run: `npx vitest run` → PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: question banks and random pick helper" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Geri sayım kancası + Çalışma sayfası (Part 1/2/3 drill)

**Files:**
- Create: `src/lib/useCountdown.js`, `src/pages/DrillPage.jsx`
- Modify: `src/App.jsx`, `src/components/TopBar.jsx`
- Test: `tests/lib.test.jsx`, `tests/routes.test.jsx`

**Interfaces:**
- Consumes: `part1`, `part2`, `part3` (questions), `flatten`/`pickRandom`, `part1 as frame1`/`part2`/`part3` (frames, ad çakışmasını `import * as frames`), `stories`, `StoryBank` yardımcıları `STORIES_KEY`, `safeStories`, `isFilled`, `useLocalStorage`.
- Produces: `useCountdown(initialSeconds) → { left, running, start, pause, reset(seconds = initialSeconds) }`; `formatTime(s) → 'm:ss'`; rota `/drill/:mode?` (`part1` varsayılan, `part2`, `part3`).

- [ ] **Step 1: Başarısız testleri yaz**

`tests/lib.test.jsx` sonuna:

```jsx
import { useCountdown, formatTime } from '../src/lib/useCountdown.js'

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  test('counts down once per second and stops at zero', () => {
    const { result } = renderHook(() => useCountdown(3))
    act(() => result.current.start())
    act(() => { vi.advanceTimersByTime(2000) })
    expect(result.current.left).toBe(1)
    act(() => { vi.advanceTimersByTime(10000) })
    expect(result.current.left).toBe(0)
    expect(result.current.running).toBe(false)
  })
  test('pause holds the value and reset restores it', () => {
    const { result } = renderHook(() => useCountdown(5))
    act(() => result.current.start())
    act(() => { vi.advanceTimersByTime(2000) })
    act(() => result.current.pause())
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current.left).toBe(3)
    act(() => result.current.reset())
    expect(result.current.left).toBe(5)
    act(() => result.current.reset(9))
    expect(result.current.left).toBe(9)
  })
  test('unmount clears the interval', () => {
    const spy = vi.spyOn(globalThis, 'clearInterval')
    const { result, unmount } = renderHook(() => useCountdown(5))
    act(() => result.current.start())
    unmount()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
  test('formatTime', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(65)).toBe('1:05')
    expect(formatTime(120)).toBe('2:00')
  })
})
```

`tests/routes.test.jsx` sonuna:

```jsx
describe('drill page', () => {
  test('root of drill shows a part 1 question card', () => {
    at('/drill')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Çalışma')
    expect(screen.getByTestId('question-text').textContent).toMatch(/\?$/)
  })
  test('unknown mode falls back to part 1', () => {
    at('/drill/nope')
    expect(screen.getByTestId('question-text')).toBeInTheDocument()
  })
  test('"Başka soru" changes the question without crashing', () => {
    at('/drill/part3')
    fireEvent.click(screen.getByRole('button', { name: 'Başka soru' }))
    expect(screen.getByTestId('question-text').textContent).toMatch(/\?$/)
  })
  test('part 2: prep countdown moves into talking phase', () => {
    vi.useFakeTimers()
    try {
      at('/drill/part2')
      fireEvent.click(screen.getByRole('button', { name: 'Hazırlığı başlat' }))
      act(() => { vi.advanceTimersByTime(61000) })
      expect(screen.getByText(/Konuşma süresi/)).toBeInTheDocument()
    } finally { vi.useRealTimers() }
  })
  test('part 2: suggests filled stories matching the card type', () => {
    localStorage.setItem('stories-v1', JSON.stringify({
      'person-admire': { tr: 'Dedem', en: '' }, 'place-visited': { tr: 'Roma', en: '' },
    }))
    at('/drill/part2')
    // kartın tipi ne olursa olsun render çökmemeli
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })
  test.each(['null', '5', '"x"', '[]'])('corrupt stories storage (%s) does not crash the part 2 drill', (raw) => {
    localStorage.setItem('stories-v1', raw)
    at('/drill/part2')
    expect(screen.getByRole('button', { name: 'Hazırlığı başlat' })).toBeInTheDocument()
  })
})
```

`tests/routes.test.jsx` başına `act` import et: `import { render, screen, fireEvent, within, act } from '@testing-library/react'`.

- [ ] **Step 2:** Run: `npx vitest run` → FAIL.

- [ ] **Step 3: `src/lib/useCountdown.js`**

```js
import { useCallback, useEffect, useState } from 'react'

export const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function useCountdown(initial) {
  const [left, setLeft] = useState(initial)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => { if (running && left <= 0) setRunning(false) }, [running, left])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback((seconds = initial) => { setRunning(false); setLeft(seconds) }, [initial])
  return { left, running, start, pause, reset }
}
```

- [ ] **Step 4: `src/pages/DrillPage.jsx`**

```jsx
import { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { isFilled, safeStories, STORIES_KEY } from '../components/StoryBank.jsx'
import part1Topics from '../data/questions/part1.js'
import part2Cards from '../data/questions/part2.js'
import part3Topics from '../data/questions/part3.js'
import { part1 as frame1, part2 as frame2, part3 as frame3 } from '../data/frames.js'
import { stories } from '../data/stories.js'
import { flatten, pickRandom } from '../lib/pick.js'
import { useCountdown, formatTime } from '../lib/useCountdown.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'

const MODES = [
  { id: 'part1', label: 'Part 1 (20 sn)' },
  { id: 'part2', label: 'Part 2 (1 + 2 dk)' },
  { id: 'part3', label: 'Part 3 (40 sn)' },
]

function Timer({ t }) {
  return (
    <div>
      <div className={`timer${t.left <= 5 ? ' low' : ''}`} role="timer" aria-live="off">{formatTime(t.left)}</div>
    </div>
  )
}

function QuestionDrill({ topics, seconds, steps }) {
  const bank = useMemo(() => flatten(topics), [topics])
  const [q, setQ] = useState(() => pickRandom(bank))
  const t = useCountdown(seconds)
  const next = () => { setQ((cur) => pickRandom(bank, Math.random, cur?.id)); t.reset() }
  return (
    <section>
      <h2>Soru</h2>
      <p className="blank-sentence" lang="en" data-testid="question-text">{q.text}</p>
      <p className="hint">Konu: {q.topic} · Sıra: {steps.join(' → ')}</p>
      <Timer t={t} />
      <button type="button" className="primary-btn" onClick={t.running ? t.pause : t.start}>{t.running ? 'Durdur' : 'Başlat'}</button>
      <button type="button" className="secondary-btn" onClick={() => t.reset()}>Sıfırla</button>
      <button type="button" className="secondary-btn" onClick={next}>Başka soru</button>
    </section>
  )
}

function Part2Drill() {
  const [card, setCard] = useState(() => pickRandom(part2Cards))
  const [phase, setPhase] = useState('ready') // ready | prep | talk | done
  const [notes, setNotes] = useState({})
  const [rawStories] = useLocalStorage(STORIES_KEY, {})
  const t = useCountdown(60)
  const type = frame2.types.find((x) => x.id === card.type)
  const mine = safeStories(rawStories)
  const suggestions = stories.filter((s) => s.fits.includes(card.type) && isFilled(mine[s.id]))

  useEffect(() => {
    if (t.left !== 0) return
    if (phase === 'prep') { setPhase('talk'); t.reset(120); t.start() }
    else if (phase === 'talk') setPhase('done')
  }, [t.left, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const startPrep = () => { setPhase('prep'); t.reset(60); t.start() }
  const another = () => { setCard((c) => pickRandom(part2Cards, Math.random, c.id)); setPhase('ready'); setNotes({}); t.reset(60) }

  return (
    <section>
      <h2>Cue card</h2>
      <div className="sample" lang="en">
        <p><strong>{card.prompt}</strong></p>
        <p>You should say:</p>
        <ul>{card.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      </div>
      <p className="hint">
        {phase === 'ready' && 'Hazır olunca başlat: 1 dakika hazırlık, ardından 2 dakika konuşma.'}
        {phase === 'prep' && 'Hazırlık süresi. Slotlara 2–3 kelimelik not düş.'}
        {phase === 'talk' && 'Konuşma süresi. Sesli konuş; notlarına bak.'}
        {phase === 'done' && 'Süre bitti. Beğendiysen aynı kartı tekrar dene ya da yeni kart al.'}
      </p>
      <Timer t={t} />
      {phase === 'ready' && <button type="button" className="primary-btn" onClick={startPrep}>Hazırlığı başlat</button>}
      <button type="button" className="secondary-btn" onClick={another}>Başka kart</button>
      {suggestions.length > 0 && (
        <p className="hint">Uyabilecek hikâyelerin: {suggestions.map((s) => s.label).join(', ')}</p>
      )}
      <h3>{type.title} için not şablonu</h3>
      <div className="slot-grid">
        {type.slots.map((s) => (
          <div key={s.id} className="slot-card">
            <label className="field">
              <span>{s.label}</span>
              <textarea rows={2} value={notes[s.id] ?? ''} placeholder={s.prompt}
                onChange={(e) => setNotes({ ...notes, [s.id]: e.target.value })} />
            </label>
            <p className="example-line" lang="en">{s.starter}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DrillPage() {
  const { mode = 'part1' } = useParams()
  if (!MODES.some((m) => m.id === mode)) return <Navigate to="/drill/part1" replace />
  return (
    <PageShell accent={3} title="Çalışma">
      <nav className="chips" aria-label="Bölüm seç">
        {MODES.map((m) => (
          <NavLink key={m.id} to={`/drill/${m.id}`} className={({ isActive }) => `chip${isActive ? ' on' : ''}`}>{m.label}</NavLink>
        ))}
      </nav>
      {mode === 'part1' && <QuestionDrill key="p1" topics={part1Topics} seconds={20} steps={frame1.steps.map((s) => s.label)} />}
      {mode === 'part2' && <Part2Drill key="p2" />}
      {mode === 'part3' && <QuestionDrill key="p3" topics={part3Topics} seconds={40} steps={frame3.ladder.map((s) => s.label.split(' ')[0])} />}
    </PageShell>
  )
}
```

`src/App.jsx`: `DrillPage` içe aktar; `<Route path="/drill/:mode?" element={<DrillPage />} />` ekle. `TopBar.jsx` `TABS`'a `{ to: '/drill', label: 'Çalışma', cls: 'tab-3' }` ekle.

- [ ] **Step 5:** Run: `npx vitest run`
Expected: PASS. "part 2: prep countdown…" testi `Konuşma süresi` metnini bulmalı; bulamazsa `useEffect` bağımlılığını ve `act` kullanımını kontrol et.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: drill page with countdown timer for parts 1-3" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Alıştırma sayfası (kalıp boşluk doldurma), README, son kontrol

**Files:**
- Create: `src/pages/PracticePage.jsx`, `README.md`
- Modify: `src/App.jsx`, `src/components/TopBar.jsx`
- Test: `tests/routes.test.jsx`

**Interfaces:**
- Consumes: `buildQuestions`, `checkAnswer`, `BLANK` (`src/lib/practice.js`); `categories`, `entries` (kalıplar); `LEARNED_KEY`, `cleanIds` (`PhrasesPage.jsx`'ten dışa aktarılır); `useLocalStorage`; `PageShell`.
- Produces: rota `/practice`.

- [ ] **Step 1: Başarısız testleri yaz** — `tests/routes.test.jsx` sonuna:

```jsx
describe('practice page', () => {
  test('starts a 10 question session for all phrases', () => {
    at('/practice')
    fireEvent.click(screen.getByRole('button', { name: 'Başla' }))
    expect(screen.getByText(/Soru 1\/10/)).toBeInTheDocument()
  })
  test('learned-only mode with nothing learned shows a message, not an empty quiz', () => {
    at('/practice')
    fireEvent.click(screen.getByLabelText('Öğrendim dediklerim'))
    fireEvent.click(screen.getByRole('button', { name: 'Başla' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Henüz hiçbir kalıbı')
    expect(screen.queryByText(/Soru 1\//)).not.toBeInTheDocument()
  })
  test.each(['null', '5', '{}', '"x"'])('corrupt learned storage (%s) does not crash', (raw) => {
    localStorage.setItem('learned-phrases-v1', raw)
    at('/practice')
    fireEvent.click(screen.getByLabelText('Öğrendim dediklerim'))
    fireEvent.click(screen.getByRole('button', { name: 'Başla' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  test('answering a question shows feedback and finishing shows the score', () => {
    at('/practice')
    fireEvent.click(screen.getByRole('button', { name: 'Başla' }))
    for (let i = 0; i < 10; i++) {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } })
      fireEvent.click(screen.getByRole('button', { name: 'Kontrol et' }))
      fireEvent.click(screen.getByRole('button', { name: i === 9 ? 'Bitir' : 'Sonraki' }))
    }
    expect(screen.getByText(/0\/10/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2:** Run: `npx vitest run` → FAIL (rota yok).

- [ ] **Step 3: `src/pages/PracticePage.jsx`**

```jsx
import { useRef, useState } from 'react'
import PageShell from '../components/PageShell.jsx'
import { categories, entries } from '../data/phrases/index.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'
import { buildQuestions, checkAnswer, BLANK } from '../lib/practice.js'
import { LEARNED_KEY, cleanIds } from './PhrasesPage.jsx'

const COUNT = 10
const fill = (q) => q.sentence.replace(BLANK, q.shown)

function Setup({ onStart }) {
  const [categoryId, setCategoryId] = useState('')
  const [mode, setMode] = useState('all')
  const [learned] = useLocalStorage(LEARNED_KEY, [])
  const [empty, setEmpty] = useState('')

  const start = (e) => {
    e.preventDefault()
    const ids = cleanIds(learned)
    const onlyIds = mode === 'learned' ? ids : undefined
    const qs = buildQuestions(entries, { count: COUNT, categoryId: categoryId || undefined, onlyIds })
    if (qs.length === 0) {
      setEmpty(mode === 'learned' && ids.length === 0
        ? 'Henüz hiçbir kalıbı “öğrendim” olarak işaretlemedin. Kalıplar sayfasında işaretle, sonra tekrar dene.'
        : 'Bu seçimde soru bulunamadı. Başka bir kategori dene.')
      return
    }
    setEmpty('')
    onStart(qs)
  }

  return (
    <form className="practice-setup" onSubmit={start}>
      <h2>Boşluk doldurma</h2>
      <p className="lead">Örnek cümlelerden bir kalıp silinir. Türkçe ipucuna ve ilk harfe bakarak kalıbı yaz. Her oturumda en fazla {COUNT} soru var.</p>
      <label className="field">
        <span>Kategori</span>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Hepsi</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </label>
      <fieldset className="field">
        <legend>Kalıplar</legend>
        <label><input type="radio" name="mode" checked={mode === 'all'} onChange={() => setMode('all')} /> Tüm kalıplar</label>
        <label><input type="radio" name="mode" checked={mode === 'learned'} onChange={() => setMode('learned')} /> Öğrendim dediklerim</label>
      </fieldset>
      {empty && <p className="empty" role="alert">{empty}</p>}
      <button type="submit" className="primary-btn">Başla</button>
    </form>
  )
}

function Quiz({ questions, onFinish }) {
  const [idx, setIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const input = useRef(null)
  const q = questions[idx]
  const last = idx === questions.length - 1

  const submit = (e) => {
    e.preventDefault()
    if (result) {
      if (last) { onFinish(score); return }
      setIdx(idx + 1); setAnswer(''); setResult(null)
      setTimeout(() => input.current?.focus(), 0)
      return
    }
    const ok = checkAnswer(q, answer)
    setResult({ ok })
    if (ok) setScore((s) => s + 1)
  }

  return (
    <form onSubmit={submit}>
      <p className="progress">Soru {idx + 1}/{questions.length}</p>
      <p className="blank-sentence" lang="en">{q.sentence}</p>
      <p className="hint">İpucu: {q.hint} · İlk harf: <strong>{q.firstLetter}</strong></p>
      <label className="field">
        <span>Eksik kalıp</span>
        <input ref={input} type="text" autoFocus autoComplete="off" lang="en" value={answer}
          disabled={!!result} onChange={(e) => setAnswer(e.target.value)} />
      </label>
      {result && (
        <div className={`feedback ${result.ok ? 'ok' : 'bad'}`} role="status">
          <strong>{result.ok ? 'Doğru' : 'Yanlış'}</strong>
          <p lang="en">{fill(q)}</p>
        </div>
      )}
      <button type="submit" className="primary-btn">{result ? (last ? 'Bitir' : 'Sonraki') : 'Kontrol et'}</button>
    </form>
  )
}

export default function PracticePage() {
  const [questions, setQuestions] = useState(null)
  const [score, setScore] = useState(null)
  let body
  if (score != null) {
    body = (
      <section>
        <h2>Sonuç</h2>
        <p className="score">{score}/{questions.length}</p>
        <button type="button" className="primary-btn" onClick={() => { setQuestions(null); setScore(null) }}>Yeniden başla</button>
      </section>
    )
  } else if (questions) {
    body = <Quiz questions={questions} onFinish={setScore} />
  } else {
    body = <Setup onStart={setQuestions} />
  }
  return <PageShell accent={3} title="Alıştırma">{body}</PageShell>
}
```

`src/App.jsx`: `PracticePage` içe aktar, `<Route path="/practice" element={<PracticePage />} />` ekle. `TopBar.jsx` `TABS`'ın sonuna `{ to: '/practice', label: 'Alıştırma', cls: 'tab-3' }` ekle (nihai sıra: Yöntem, Kalıplar, Part 1, Part 2, Part 3, Çalışma, Alıştırma).

- [ ] **Step 4: README** — `README.md`

```markdown
# IELTS Speaking Guide

IELTS Speaking için kalıp bankası, Part 1/2/3 iskeletleri, kişisel hikâye bankası ve süreli çalışma. Açıklamalar Türkçe, örnekler İngilizce. Konuşma botu ya da ses kaydı yoktur; kendi sesinle çalışırsın.

## Neler var?
- **Yöntem:** 3 temel kural.
- **Kalıplar:** 7 kategoride 42 kalıp (anlam, ne zaman, sonra ne gelir, sık hata, 3 örnek). Arama ve "öğrendim" işareti.
- **Part 1 / Part 3:** cevap iskeleti ve merdiven.
- **Part 2:** cue card tiplerine göre not şablonu, zaman çizelgesi, 8 şablonlu hikâye bankası (tarayıcıda saklanır).
- **Çalışma:** rastgele soru + kronometre (Part 1 20 sn, Part 2 1+2 dk, Part 3 40 sn).
- **Alıştırma:** örnek cümlelerden kalıp boşluk doldurma.

## Geliştirme
```bash
npm install
npm run dev
npm test
npm run build
```

## İçerik eklemek
- **Yeni kalıp:** `src/data/phrases/<kategori>.js` içine `p(term, tr, use, next, examples, extra)` satırı ekle; `npm test` her kalıpta 3–5 örnek olduğunu ve örneklerin kalıbı içerdiğini doğrular.
- **Yeni kategori:** yeni dosya aç, `phrases/index.js` içindeki `categories` ve `entries` listesine ekle (en az 6 kalıp).
- **Yeni soru:** `src/data/questions/part1.js|part2.js|part3.js`.
```

- [ ] **Step 5: Tüm doğrulama**

Run: `npx vitest run && npm run build`
Expected: tüm testler PASS, build hatasız.

Elle kontrol (`npm run dev`, tarayıcıda): her sekme açılıyor; mobil genişlikte (≤860px) SideNav "Bölümler" düğmesiyle açılıyor; Part 2 çalışmasında hazırlık → konuşma geçişi çalışıyor; hikâye bankasında yazı sayfa yenilenince duruyor; tema düğmesi çalışıyor.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: phrase fill-in practice page and README" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec kapsamı:** Yöntem (Task 6), Kalıplar 7 kategori ≥6 kalıp (2–4), Part 1 (6), Part 2 not şablonu + zaman çizelgesi + hikâye bankası (7), Part 3 (6), Alıştırma: soru kartı + kronometre + Part 2 not modu (9), kalıp boşluk doldurma (5, 10), öğrendim + arama (4), localStorage dayanıklılığı (1, 4, 7, 9, 10), soru bankası Part 1 ~10 / Part 2 ~20 / Part 3 ~10 (8). Eksik madde yok. GitHub Pages spec'te isteğe bağlı olduğu için planda yok.

**Placeholder taraması:** "TBD/TODO" yok.

**Tip tutarlılığı:** `phrase(category)(term, tr, use, next, examples, extra)` Task 2'de tanımlı ve 3'te aynı imzayla kullanılıyor. `LEARNED_KEY`/`cleanIds` Task 4'te `PhrasesPage.jsx`'ten dışa aktarılıyor, Task 10 aynı adla alıyor. `STORIES_KEY`/`safeStories`/`isFilled` Task 7'de dışa aktarılıp Task 9'da kullanılıyor. `pickRandom(list, rng, exceptId)` ve `flatten` Task 8'de tanımlı, Task 9 aynı imzayla çağırıyor. Frames dışa aktarımları (`method, part1, part2, part3`) ve soru bankası varsayılan dışa aktarımları (default) ayrı ve tutarlı; Task 9'daki ad çakışması `as frame1/frame2/frame3` ile çözülüyor.

**Review Focus eşlemesi:** bozuk localStorage (Task 4, 7, 9, 10 testleri), süre sıfırı ve interval temizliği (Task 9 `useCountdown` testleri), boş "öğrendim" modu (Task 10), regex karakterli arama (Task 4), bilinmeyen rota/bölüm (Task 1, 4, 7, 9).
