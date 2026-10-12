export const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export const matchesQuery = (haystack, query) =>
  !query || haystack.toLowerCase().includes(query.toLowerCase())
