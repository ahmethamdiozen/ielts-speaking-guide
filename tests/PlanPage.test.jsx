import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'

const at = () => render(<MemoryRouter initialEntries={['/plan']}><App /></MemoryRouter>)
const progress = () => screen.getByLabelText('Plan ilerlemesi')

test('plan tab is in the main menu and page shows 0/28', () => {
  at()
  expect(within(screen.getByRole('navigation', { name: 'Ana menü' })).getByRole('link', { name: 'Plan' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Plan')
  expect(progress()).toHaveTextContent('0/28')
})
test('checking a day updates the counter and is stored', () => {
  at()
  fireEvent.click(screen.getAllByRole('checkbox')[0])
  expect(progress()).toHaveTextContent('1/28')
  expect(JSON.parse(localStorage.getItem('plan-done-v1'))).toEqual({ d01: true })
})
test('next day card points to the first unchecked day', () => {
  at()
  expect(screen.getByLabelText('Sıradaki gün')).toHaveTextContent('Yöntem ve zaman kazanma')
  fireEvent.click(screen.getAllByRole('checkbox')[0])
  expect(screen.getByLabelText('Sıradaki gün')).toHaveTextContent('Cevaba başlama')
})
test('saved progress is restored', () => {
  localStorage.setItem('plan-done-v1', JSON.stringify({ d01: true, d02: true }))
  at()
  expect(progress()).toHaveTextContent('2/28')
  expect(screen.getAllByRole('checkbox')[1]).toBeChecked()
})
test.each(['null', '5', '"x"', '[]'])('corrupt storage (%s) does not crash', (raw) => {
  localStorage.setItem('plan-done-v1', raw)
  at()
  expect(progress()).toHaveTextContent('0/28')
  fireEvent.click(screen.getAllByRole('checkbox')[0])
  expect(progress()).toHaveTextContent('1/28')
})
test('reset button clears progress', () => {
  localStorage.setItem('plan-done-v1', JSON.stringify({ d01: true }))
  at()
  fireEvent.click(screen.getByRole('button', { name: 'İlerlemeyi sıfırla' }))
  expect(progress()).toHaveTextContent('0/28')
})
test('all done shows completion message', () => {
  const all = Object.fromEntries(Array.from({ length: 28 }, (_, i) => [`d${String(i + 1).padStart(2, '0')}`, true]))
  localStorage.setItem('plan-done-v1', JSON.stringify(all))
  at()
  expect(screen.getByLabelText('Sıradaki gün')).toHaveTextContent('Plan tamamlandı')
})
