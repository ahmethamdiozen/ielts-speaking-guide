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
