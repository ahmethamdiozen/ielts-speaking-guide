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
