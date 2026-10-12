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
