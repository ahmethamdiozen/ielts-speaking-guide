export const flatten = (topics) =>
  topics.flatMap((t) => t.questions.map((text, i) => ({ id: `${t.id}:${i}`, topic: t.title, text })))

export function pickRandom(list, rng = Math.random, exceptId) {
  if (!list.length) return null
  const pool = exceptId != null && list.length > 1 ? list.filter((x) => x.id !== exceptId) : list
  return pool[Math.floor(rng() * pool.length)]
}
