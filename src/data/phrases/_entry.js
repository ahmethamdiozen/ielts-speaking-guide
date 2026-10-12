const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// phrase(category)(term, tr, use, next, examples, extra?)
// next: kalıptan sonra gramer olarak ne gelir. extra: { forms?: string[], mistake?: string }
export const phrase = (category) => (term, tr, use, next, examples, extra = {}) => ({
  id: slug(term),
  term,
  category,
  tr,
  use,
  next,
  examples,
  ...extra,
})
