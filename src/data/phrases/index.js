import start from './start.js'
import time from './time.js'

export const categories = [
  { id: 'start', title: 'Cevaba başlama', desc: 'Grameri kilitlemeyen, rahat başlangıçlar: I\'d say, to be honest…' },
  { id: 'time', title: 'Zaman kazanma', desc: 'Sessizlik yerine söyleyeceğin kalıplar: let me think…' },
]

export const entries = [...start, ...time]
