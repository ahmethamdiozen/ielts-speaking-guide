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
