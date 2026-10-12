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
