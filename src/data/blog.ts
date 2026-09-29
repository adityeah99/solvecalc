// Blog categories: labels and the palette colour used for their section dot.
export const BLOG_CATEGORIES = [
  { id: 'study-tips', label: 'Study tips', color: 'var(--blue)' },
  { id: 'math-basics', label: 'Math basics', color: 'var(--ok)' },
  { id: 'for-parents', label: 'For parents', color: 'var(--red)' },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]['id'];

export const blogCategory = (id: string) => BLOG_CATEGORIES.find((c) => c.id === id);
