// Top navigation. Flat list of links shown in the header.
export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: 'Calculators', href: '/calculators' },
  { label: 'Lessons', href: '/learn' },
  { label: 'Guides', href: '/articles' },
  { label: 'Blog', href: '/blog' },
  { label: 'Quizzes', href: '/quizzes' },
  { label: 'Games', href: '/games' },
];
