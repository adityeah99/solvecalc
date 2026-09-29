import type { TopicId } from './topics.ts';

// The public math games. Each one is built into this site (no third-party
// content) and has a page at /games/<slug>. `code` is the 4-digit code that
// opens it from the calculator's Code Mode.

export type MathGameKind = 'rapid' | 'angle' | 'make24';

export interface MathGame {
  slug: string;
  code: string;
  name: string;
  topic: TopicId;
  kind: MathGameKind;
  /** One line for cards and the meta description */
  blurb: string;
  /** Short text drawn on the card cover */
  cover: string;
  /** Cover background: one of the palette tones in math-games.css */
  tone: 'blue' | 'hi' | 'ink' | 'lcd' | 'red' | 'green';
  howTo: string[];
  /** "The math behind it": plain-English paragraphs */
  math: string[];
  calculator: string;
  /** rapid games only */
  rapid?: { mode: 'input' | 'choice'; seconds: number; levels: boolean };
}

export const MATH_GAMES: MathGame[] = [
  {
    slug: 'sum-sprint',
    code: '1001',
    name: 'Sum Sprint',
    topic: 'arithmetic',
    kind: 'rapid',
    blurb: 'Answer as many sums as you can in 60 seconds.',
    cover: '7×8',
    tone: 'blue',
    rapid: { mode: 'input', seconds: 60, levels: true },
    howTo: [
      'Pick a level and press Start.',
      'Type the answer with your keyboard or the number pad, then press Enter.',
      'A wrong answer shows the right one and moves on. The clock keeps running.',
    ],
    math: [
      'Quick mental arithmetic comes from knowing a few facts by heart and building on them. If you know 7 × 8 = 56, then 70 × 8 = 560 and 56 ÷ 8 = 7 come for free.',
      'For subtraction, it often helps to count up. To work out 83 − 47, go from 47 to 50 (3), then 50 to 83 (33), so the answer is 36.',
    ],
    calculator: 'scientific',
  },
  {
    slug: 'make-24',
    code: '1002',
    name: 'Make 24',
    topic: 'arithmetic',
    kind: 'make24',
    blurb: 'Combine four numbers with + − × ÷ to make exactly 24.',
    cover: '24',
    tone: 'hi',
    howTo: [
      'Tap a number, tap an operation, then tap a second number. The two combine into one.',
      'Keep going until one number is left. If it is 24, you solved it.',
      'Use Undo to step back, or Show a solution if you are stuck. Every puzzle has at least one answer.',
    ],
    math: [
      'Every puzzle uses each number exactly once. Order of operations does not matter here, because you choose which pair to combine first.',
      'Look for factor pairs of 24: 3 × 8, 4 × 6, 2 × 12 and 1 × 24. If two of the numbers make one half of a pair and the other two make the other half, you are done. With 2, 3, 4 and 6: 6 × 4 = 24 and 3 − 2 = 1, so 24 × 1 = 24.',
    ],
    calculator: 'scientific',
  },
  {
    slug: 'fraction-faceoff',
    code: '1003',
    name: 'Fraction Face-off',
    topic: 'fractions',
    kind: 'rapid',
    blurb: 'Two fractions, one second to decide: which is bigger?',
    cover: '¾ ⋚ ⅝',
    tone: 'green',
    rapid: { mode: 'choice', seconds: 60, levels: false },
    howTo: [
      'Two fractions appear. Choose the bigger one, or Equal if they are the same size.',
      'Use the buttons, or the keys 1, 2 and 3.',
      'You have 60 seconds.',
    ],
    math: [
      'To compare a/b with c/d, cross-multiply: compare a × d with c × b. For 3/4 and 5/7, 3 × 7 = 21 and 5 × 4 = 20, so 3/4 is bigger.',
      'Shortcuts help too. If the tops are the same, the smaller bottom wins (1/3 > 1/5). If each fraction is one piece short of a whole, the one with more pieces is bigger (7/8 > 5/6).',
    ],
    calculator: 'fractions',
  },
  {
    slug: 'solve-for-x',
    code: '1004',
    name: 'Solve for X',
    topic: 'algebra',
    kind: 'rapid',
    blurb: 'Find x in quick-fire equations before the clock runs out.',
    cover: 'x = ?',
    tone: 'ink',
    rapid: { mode: 'input', seconds: 60, levels: true },
    howTo: [
      'Pick a level and press Start.',
      'Each equation has a whole-number answer. Type x and press Enter. Use − for negative answers.',
      'Wrong answers show the steps, then the next equation appears.',
    ],
    math: [
      'Whatever you do to one side of an equation, do to the other. To solve 3x + 4 = 19, take 4 from both sides (3x = 15), then divide both sides by 3 (x = 5).',
      'When x is on both sides, move all the x terms to one side first: 5x + 2 = 2x + 14 becomes 3x + 2 = 14.',
    ],
    calculator: 'equation',
  },
  {
    slug: 'angle-hunter',
    code: '1005',
    name: 'Angle Hunter',
    topic: 'geometry',
    kind: 'angle',
    blurb: 'Guess the size of an angle by eye. Closer guesses score more.',
    cover: '∠ 47°',
    tone: 'lcd',
    howTo: [
      'An angle appears. Estimate its size in degrees with the slider or by typing a number.',
      'Press Lock in to see the real angle and your score for that round.',
      'Ten rounds, up to 100 points each.',
    ],
    math: [
      'Use landmarks: a square corner is 90°, a straight line is 180°, and a full turn is 360°. Half a right angle is 45°, a third of one is 30°.',
      'An angle bigger than 180° is a reflex angle. Estimate the smaller angle on the other side and take it away from 360°.',
    ],
    calculator: 'geometry',
  },
  {
    slug: 'prime-time',
    code: '1006',
    name: 'Prime Time',
    topic: 'arithmetic',
    kind: 'rapid',
    blurb: 'Prime or not prime? Sort as many numbers as you can.',
    cover: '97?',
    tone: 'red',
    rapid: { mode: 'choice', seconds: 45, levels: false },
    howTo: ['A number appears. Choose Prime or Not prime.', 'Use the buttons, or the keys 1 and 2.', 'You have 45 seconds.'],
    math: [
      'A prime number has exactly two factors: 1 and itself. 1 is not prime, and 2 is the only even prime.',
      'To test a number, try dividing by the primes up to its square root. For 91, check 2, 3, 5 and 7: 91 = 7 × 13, so it is not prime.',
    ],
    calculator: 'gcd',
  },
  {
    slug: 'average-aim',
    code: '1007',
    name: 'Average Aim',
    topic: 'statistics',
    kind: 'rapid',
    blurb: 'Find the mean, median or range of five numbers, fast.',
    cover: 'x̄',
    tone: 'blue',
    rapid: { mode: 'choice', seconds: 60, levels: false },
    howTo: [
      'Five numbers appear with a question: mean, median or range.',
      'Pick the right answer from four choices, or press 1 to 4.',
      'You have 60 seconds.',
    ],
    math: [
      'Mean: add them up and divide by how many there are. Median: put them in order and take the middle one. Range: largest minus smallest.',
      'For the mean, look for pairs that make round numbers. 7 + 13 = 20 is quicker than adding left to right.',
    ],
    calculator: 'statistics',
  },
  {
    slug: 'odds-on',
    code: '1008',
    name: 'Odds On',
    topic: 'probability',
    kind: 'rapid',
    blurb: 'A bag of marbles, one pick: what is the probability?',
    cover: 'P(●)',
    tone: 'hi',
    rapid: { mode: 'choice', seconds: 60, levels: false },
    howTo: [
      'Look at the marbles in the bag and read the question.',
      'Pick the correct probability, written as a simplified fraction, or press 1 to 4.',
      'You have 60 seconds.',
    ],
    math: [
      'Probability = the number of ways it can happen ÷ the total number of outcomes. With 3 red marbles out of 8, P(red) = 3/8.',
      'P(not red) is everything else: 1 − 3/8 = 5/8. A common slip is to compare red with the others (3 to 5); that is the odds, not the probability.',
    ],
    calculator: 'probability',
  },
];

export const mathGameBySlug = (slug: string) => MATH_GAMES.find((g) => g.slug === slug);
export const mathGameByCode = (code: string) => MATH_GAMES.find((g) => g.code === code);
export const mathGamesForTopic = (topic: TopicId) => MATH_GAMES.filter((g) => g.topic === topic);
