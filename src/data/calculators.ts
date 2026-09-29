import type { TopicId } from './topics.ts';

// One entry per calculator page. The page file lives at
// src/pages/calculators/<slug>.astro and its long-form copy (formula, example,
// mistakes, FAQ) at src/data/calculator-content/<slug>.json.

export interface CalculatorMeta {
  slug: string;
  name: string;
  /** Short label for tiles and menus */
  short: string;
  /** <title> text (brand is appended automatically) */
  title: string;
  /** Meta description, <= 155 characters */
  description: string;
  topic: TopicId;
  /** Symbol shown on the tile's key cap */
  glyph: string;
  /** Other calculator slugs worth suggesting */
  related: string[];
  /** Article slugs worth suggesting */
  articles: string[];
  popular?: boolean;
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: 'scientific',
    name: 'Scientific Calculator',
    short: 'Scientific',
    title: 'Scientific Calculator with History',
    description:
      'A free scientific calculator with trig, logs, powers, roots and factorials. Type expressions from your keyboard and keep a history.',
    topic: 'arithmetic',
    glyph: 'sin',
    related: ['exponents', 'square-root', 'fractions', 'percentage'],
    articles: ['degrees-vs-radians', 'how-to-calculate-a-percentage'],
    popular: true,
  },
  {
    slug: 'fractions',
    name: 'Fraction Calculator',
    short: 'Fractions',
    title: 'Fraction Calculator: Add, Subtract, Multiply, Divide',
    description:
      'Add, subtract, multiply and divide fractions and mixed numbers. See the answer simplified, as a mixed number and as a decimal, with steps.',
    topic: 'fractions',
    glyph: '½',
    related: ['gcd', 'lcm', 'percentage', 'ratio'],
    articles: ['how-to-add-fractions', 'how-to-simplify-fractions', 'fraction-to-decimal'],
    popular: true,
  },
  {
    slug: 'percentage',
    name: 'Percentage Calculator',
    short: 'Percentage',
    title: 'Percentage Calculator: Percent Of, Change and More',
    description:
      'Find a percentage of a number, what percent one number is of another, and the percentage increase or decrease between two values.',
    topic: 'arithmetic',
    glyph: '%',
    related: ['fractions', 'ratio', 'average'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
    popular: true,
  },
  {
    slug: 'equation',
    name: 'Equation Solver',
    short: 'Equations',
    title: 'Linear Equation Solver with Steps',
    description:
      'Solve linear equations in one variable, like 3x + 5 = 20 or 2(x - 1) = x + 4, and see each step of the working.',
    topic: 'algebra',
    glyph: 'x=',
    related: ['quadratic', 'exponents', 'ratio'],
    articles: ['what-is-a-linear-equation', 'how-to-solve-a-linear-equation'],
    popular: true,
  },
  {
    slug: 'quadratic',
    name: 'Quadratic Equation Solver',
    short: 'Quadratic',
    title: 'Quadratic Equation Solver (Quadratic Formula)',
    description:
      'Solve ax² + bx + c = 0 with the quadratic formula. Get real or complex roots, the discriminant, the vertex and the working.',
    topic: 'algebra',
    glyph: 'x²',
    related: ['equation', 'square-root', 'exponents'],
    articles: ['what-is-a-quadratic-equation'],
    popular: true,
  },
  {
    slug: 'geometry',
    name: 'Geometry Calculator',
    short: 'Geometry',
    title: 'Geometry Calculator: Area, Perimeter and Volume',
    description:
      'Area and perimeter of circles, rectangles, triangles and more, plus volume and surface area of common solids, with the formula shown.',
    topic: 'geometry',
    glyph: '△',
    related: ['unit-converter', 'square-root', 'scientific'],
    articles: ['area-of-a-circle', 'perimeter-of-a-rectangle', 'pythagorean-theorem'],
    popular: true,
  },
  {
    slug: 'statistics',
    name: 'Statistics Calculator',
    short: 'Statistics',
    title: 'Statistics Calculator: Mean, Median, Mode, Std Dev',
    description:
      'Paste a list of numbers to get the mean, median, mode, range, quartiles, variance and standard deviation.',
    topic: 'statistics',
    glyph: 'σ',
    related: ['average', 'probability', 'percentage'],
    articles: ['how-to-find-the-mean', 'mean-vs-median'],
  },
  {
    slug: 'ratio',
    name: 'Ratio Calculator',
    short: 'Ratio',
    title: 'Ratio Calculator: Simplify, Scale and Split',
    description:
      'Simplify a ratio, solve a proportion like 3 : 4 = x : 20, or share an amount in a given ratio.',
    topic: 'arithmetic',
    glyph: '∶',
    related: ['fractions', 'percentage', 'gcd'],
    articles: ['how-to-simplify-fractions'],
  },
  {
    slug: 'average',
    name: 'Average Calculator',
    short: 'Average',
    title: 'Average Calculator (Mean and Weighted Average)',
    description:
      'Find the average of a list of numbers, or a weighted average such as a course grade, with the sum and count shown.',
    topic: 'statistics',
    glyph: 'x̄',
    related: ['statistics', 'percentage'],
    articles: ['how-to-find-the-mean', 'mean-vs-median'],
  },
  {
    slug: 'gcd',
    name: 'GCD Calculator',
    short: 'GCD',
    title: 'GCD Calculator (Greatest Common Divisor)',
    description:
      'Find the greatest common divisor of two or more whole numbers, with the Euclidean algorithm steps.',
    topic: 'arithmetic',
    glyph: 'gcd',
    related: ['lcm', 'fractions', 'ratio'],
    articles: ['how-to-simplify-fractions'],
  },
  {
    slug: 'lcm',
    name: 'LCM Calculator',
    short: 'LCM',
    title: 'LCM Calculator (Least Common Multiple)',
    description:
      'Find the least common multiple of two or more whole numbers and see how it is worked out from the GCD.',
    topic: 'arithmetic',
    glyph: 'lcm',
    related: ['gcd', 'fractions'],
    articles: ['how-to-add-fractions'],
  },
  {
    slug: 'exponents',
    name: 'Exponent Calculator',
    short: 'Exponents',
    title: 'Exponent Calculator: Powers, Negative and Fractional',
    description:
      'Raise any number to a power, including negative and fractional exponents, and see what the exponent means in steps.',
    topic: 'algebra',
    glyph: 'xⁿ',
    related: ['square-root', 'scientific', 'quadratic'],
    articles: ['what-is-a-quadratic-equation'],
  },
  {
    slug: 'square-root',
    name: 'Square Root Calculator',
    short: 'Square root',
    title: 'Square Root Calculator with Simplified Radicals',
    description:
      'Find the square root or cube root of a number, and simplify radicals like √72 = 6√2.',
    topic: 'arithmetic',
    glyph: '√',
    related: ['exponents', 'quadratic', 'geometry'],
    articles: ['pythagorean-theorem'],
  },
  {
    slug: 'probability',
    name: 'Probability Calculator',
    short: 'Probability',
    title: 'Probability Calculator: Events, And, Or, Combinations',
    description:
      'Work out the chance of an event, its complement, two events together, and counts of combinations and permutations.',
    topic: 'probability',
    glyph: 'P',
    related: ['statistics', 'fractions', 'percentage'],
    articles: ['how-to-calculate-probability'],
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    short: 'Units',
    title: 'Unit Converter: Length, Mass, Temperature and More',
    description:
      'Convert length, mass, temperature, area, volume, speed and time between metric and imperial units.',
    topic: 'geometry',
    glyph: '⇄',
    related: ['geometry', 'percentage'],
    articles: ['area-of-a-circle'],
  },
];

export const calculatorBySlug = (slug: string) => CALCULATORS.find((c) => c.slug === slug);
