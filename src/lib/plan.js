export const allDays = (plan) => plan.weeks.flatMap((w) => w.days)

export const cleanDone = (raw) => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return Object.fromEntries(Object.entries(raw).filter(([, v]) => v === true))
}

export const countDone = (plan, done) => allDays(plan).filter((d) => done[d.id] === true).length

export const nextDay = (plan, done) => allDays(plan).find((d) => done[d.id] !== true) ?? null
