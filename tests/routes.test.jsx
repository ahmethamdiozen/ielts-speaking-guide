import { render, screen, fireEvent, within, act } from '@testing-library/react'
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
    fireEvent.change(box, { target: { value: "Babamla Ankara'ya gittik" } })
    expect(JSON.parse(localStorage.getItem('stories-v1'))['person-admire'].tr).toBe("Babamla Ankara'ya gittik")
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
  test('part 2: renders with filled stories in storage', () => {
    localStorage.setItem('stories-v1', JSON.stringify({
      'person-admire': { tr: 'Dedem', en: '' }, 'place-visited': { tr: 'Roma', en: '' },
    }))
    at('/drill/part2')
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })
  test.each(['null', '5', '"x"', '[]'])('corrupt stories storage (%s) does not crash the part 2 drill', (raw) => {
    localStorage.setItem('stories-v1', raw)
    at('/drill/part2')
    expect(screen.getByRole('button', { name: 'Hazırlığı başlat' })).toBeInTheDocument()
  })
})
