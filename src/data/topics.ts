// Topics tie calculators, lessons, articles, quizzes and games together.
// Every cross-link on the site is derived from this file and calculators.ts,
// so adding a topic here is enough to wire it into the navigation.

export type TopicId =
  | 'arithmetic'
  | 'fractions'
  | 'algebra'
  | 'geometry'
  | 'statistics'
  | 'probability'
  | 'trigonometry';

export interface Topic {
  id: TopicId;
  name: string;
  blurb: string;
  /** Has a /learn/<id> lesson page */
  lesson: boolean;
  /** Has a /quizzes/<id> quiz */
  quiz: boolean;
  /** Calculator to suggest when none is filed under this topic */
  calculator?: string;
  /** The math game that practices this topic (see src/data/math-games.ts) */
  games: { label: string; href: string };
}

export const TOPICS: Topic[] = [
  {
    id: 'arithmetic',
    name: 'Arithmetic',
    blurb: 'Percentages, ratios, factors and the everyday number skills everything else builds on.',
    lesson: false,
    quiz: true,
    games: { label: 'Sum Sprint', href: '/games/sum-sprint' },
  },
  {
    id: 'fractions',
    name: 'Fractions',
    blurb: 'Adding, simplifying and converting fractions, decimals and percentages.',
    lesson: true,
    quiz: true,
    games: { label: 'Fraction Face-off', href: '/games/fraction-faceoff' },
  },
  {
    id: 'algebra',
    name: 'Algebra',
    blurb: 'Letters that stand for numbers, and how to solve for them.',
    lesson: true,
    quiz: true,
    games: { label: 'Solve for X', href: '/games/solve-for-x' },
  },
  {
    id: 'geometry',
    name: 'Geometry',
    blurb: 'Shapes, angles, area, perimeter and volume.',
    lesson: true,
    quiz: true,
    games: { label: 'Angle Hunter', href: '/games/angle-hunter' },
  },
  {
    id: 'statistics',
    name: 'Statistics',
    blurb: 'Averages, spread and what a set of numbers is telling you.',
    lesson: true,
    quiz: true,
    games: { label: 'Average Aim', href: '/games/average-aim' },
  },
  {
    id: 'probability',
    name: 'Probability',
    blurb: 'How likely something is, from coin flips to card draws.',
    lesson: true,
    quiz: true,
    games: { label: 'Odds On', href: '/games/odds-on' },
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry',
    blurb: 'Sine, cosine and tangent: the math of triangles and turning.',
    calculator: 'scientific',
    lesson: true,
    quiz: false,
    games: { label: 'Angle Hunter', href: '/games/angle-hunter' },
  },
];

export const topicById = (id: TopicId) => TOPICS.find((t) => t.id === id)!;
