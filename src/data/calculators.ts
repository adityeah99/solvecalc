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
  {
    slug: 'roman-numerals',
    name: 'Roman Numeral Converter',
    short: 'Roman Numerals',
    title: 'Roman Numeral Converter: Number to Roman and Back',
    description:
      'Convert any number from 1 to 3999 into Roman numerals, or turn a Roman numeral back into digits, with step-by-step working.',
    topic: 'arithmetic',
    glyph: 'Ⅻ',
    related: ['scientific', 'unit-converter', 'base-converter'],
    articles: ['roman-numerals'],
  },
  {
    slug: 'base-converter',
    name: 'Number Base Converter',
    short: 'Base Converter',
    title: 'Number Base Converter: Binary, Octal, Decimal, Hex',
    description:
      'Convert numbers between any bases from 2 to 36: binary, octal, decimal, hexadecimal and beyond, with every step shown.',
    topic: 'arithmetic',
    glyph: '₂→₁₆',
    related: ['scientific', 'exponents', 'roman-numerals'],
    articles: ['scientific-notation', 'factors-and-multiples'],
  },
  {
    slug: 'logarithm',
    name: 'Logarithm Calculator',
    short: 'Logarithms',
    title: 'Logarithm Calculator: log, ln and Any Base',
    description:
      'Calculate common logarithms, natural logarithms (ln) and logs in any base, with change-of-base steps shown for every answer.',
    topic: 'arithmetic',
    glyph: 'log',
    related: ['scientific', 'exponents', 'compound-interest'],
    articles: ['scientific-notation', 'order-of-operations'],
  },
  {
    slug: 'triangle-solver',
    name: 'Triangle Solver',
    short: 'Triangle Solver',
    title: 'Triangle Solver: SSS, SAS and ASA with Steps',
    description:
      'Enter three sides, two sides and the included angle, or two angles and a side to get every side, angle, perimeter and area with steps.',
    topic: 'geometry',
    glyph: '△',
    related: ['geometry', 'trigonometry', 'scientific'],
    articles: ['pythagorean-theorem', 'area-of-a-circle'],
  },
  {
    slug: 'trigonometry',
    name: 'Trigonometry Calculator',
    short: 'Trigonometry',
    title: 'Trigonometry Calculator: SOH-CAH-TOA Right Triangles',
    description:
      'Solve right triangles with SOH-CAH-TOA: find missing sides from an angle and one side, or find the angle from two known sides, with steps.',
    topic: 'trigonometry',
    glyph: 'θ',
    related: ['triangle-solver', 'scientific', 'geometry'],
    articles: ['degrees-vs-radians', 'pythagorean-theorem'],
  },
  {
    slug: 'graphing-calculator',
    name: 'Graphing Calculator',
    short: 'Graphing',
    title: 'Graphing Calculator: Plot Any Function of x',
    description:
      'Type any function of x, like x^2 - 3 or sin(x), and see it drawn instantly on a labelled grid with axes, plus exact values at key points.',
    topic: 'algebra',
    glyph: '📈',
    related: ['scientific', 'equation', 'quadratic'],
    articles: ['what-is-a-linear-equation', 'what-is-a-quadratic-equation'],
  },
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    short: 'Tip',
    title: 'Tip Calculator: Split the Bill and Tip Right',
    description:
      'Work out the tip, total bill, and each person’s share when splitting. Enter the bill, pick a percent, and split it fairly.',
    topic: 'arithmetic',
    glyph: '$',
    related: ['percentage', 'fractions', 'ratio'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    short: 'GPA',
    title: 'GPA Calculator: 4.0 Scale Grade Point Average',
    description:
      'Calculate your GPA on the standard 4.0 scale. Enter one course per line as grade and credits, like “A 3”.',
    topic: 'arithmetic',
    glyph: 'A+',
    related: ['average', 'statistics', 'percentage'],
    articles: ['how-to-find-the-mean', 'mean-vs-median'],
  },
  {
    slug: 'mortgage',
    name: 'Mortgage Calculator',
    short: 'Mortgage',
    title: 'Mortgage Calculator: Monthly Payment and Total Interest',
    description:
      'Estimate your monthly mortgage payment, total paid, and total interest. Enter the loan amount, rate, and term in years.',
    topic: 'arithmetic',
    glyph: '⌂',
    related: ['percentage', 'exponents', 'compound-interest'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'compound-interest',
    name: 'Compound Interest Calculator',
    short: 'Compound',
    title: 'Compound Interest Calculator: Growth Over Time',
    description:
      'See how savings grow with compound interest. Enter a starting amount, rate, and years, and compare compounding frequencies.',
    topic: 'arithmetic',
    glyph: '📈',
    related: ['percentage', 'exponents', 'mortgage'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'student-loan',
    name: 'Student Loan Calculator',
    short: 'Student Loan',
    title: 'Student Loan Calculator: Monthly Payment and Total Interest',
    description:
      'Work out the monthly payment, total paid, and total interest on a student loan. Enter the amount, rate, and repayment term in years.',
    topic: 'arithmetic',
    glyph: '🎓',
    related: ['mortgage', 'compound-interest', 'percentage'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'college-savings',
    name: 'College Savings Calculator',
    short: 'College Savings',
    title: 'College Savings Calculator: Project Growth Over Time',
    description:
      'See how college savings grow with monthly contributions and compound returns. Enter current savings, monthly amount, return, and years.',
    topic: 'arithmetic',
    glyph: '🎒',
    related: ['compound-interest', 'mortgage', 'percentage'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'family-budget',
    name: 'Family Budget Calculator',
    short: 'Budget',
    title: 'Family Budget Calculator: The 50/30/20 Rule',
    description:
      'Split your monthly take-home pay with the 50/30/20 budget rule: 50% needs, 30% wants, 20% savings. See each amount instantly.',
    topic: 'arithmetic',
    glyph: '🏠',
    related: ['percentage', 'tip-calculator', 'average'],
    articles: ['how-to-calculate-a-percentage', 'ratios-and-proportions'],
  },
  {
    slug: 'personal-loan',
    name: 'Personal Loan Calculator',
    short: 'Personal Loan',
    title: 'Personal Loan Calculator: Monthly Payment and Total Interest',
    description:
      'Work out the monthly payment on a personal loan, plus total paid and total interest. Enter the amount, rate, and term.',
    topic: 'arithmetic',
    glyph: '$',
    related: ['mortgage', 'compound-interest', 'percentage'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'salary-converter',
    name: 'Salary Converter',
    short: 'Salary',
    title: 'Salary Converter: Hourly Wage to Annual Salary',
    description:
      'Convert an hourly wage to an annual salary or back. Enter your pay and hours per week to compare job offers.',
    topic: 'arithmetic',
    glyph: '💵',
    related: ['percentage', 'average', 'tip-calculator'],
    articles: ['how-to-calculate-a-percentage', 'how-to-find-the-mean'],
  },
  {
    slug: 'debt-payoff',
    name: 'Debt Payoff Calculator',
    short: 'Debt Payoff',
    title: 'Debt Payoff Calculator: Time and Interest Cost',
    description:
      'See how long it takes to pay off a debt and how much interest it costs. Enter the balance, APR, and monthly payment.',
    topic: 'arithmetic',
    glyph: '−$',
    related: ['compound-interest', 'mortgage', 'personal-loan'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    short: 'Discount',
    title: 'Discount Calculator: Sale Price and Savings',
    description:
      'Work out sale prices in seconds. Enter the original price and percent off to see your savings and what you pay.',
    topic: 'arithmetic',
    glyph: '🏷',
    related: ['percentage', 'tip-calculator', 'fractions'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'retirement-savings',
    name: 'Retirement Savings Calculator',
    short: 'Retirement',
    title: 'Retirement Savings Calculator: Project Your Nest Egg',
    description:
      'Project how much your retirement savings will grow. Enter your ages, current savings, monthly contribution, and expected annual return.',
    topic: 'arithmetic',
    glyph: '🏖',
    related: ['compound-interest', 'mortgage', 'percentage'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'savings-goal',
    name: 'Savings Goal Calculator',
    short: 'Savings Goal',
    title: 'Savings Goal Calculator: Monthly Deposit Needed',
    description:
      'Find the monthly deposit needed to reach a savings goal. Enter your target, current savings, expected return, and years to save.',
    topic: 'arithmetic',
    glyph: '🎯',
    related: ['compound-interest', 'mortgage', 'percentage'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
  {
    slug: 'credit-card-payoff',
    name: 'Credit Card Payoff Calculator',
    short: 'Card Payoff',
    title: 'Credit Card Payoff Calculator: Debt-Free Date & Cost',
    description:
      'See how long it takes to pay off a credit card and what it costs. Enter your balance, APR, and monthly payment for the full payoff plan.',
    topic: 'arithmetic',
    glyph: '💳',
    related: ['percentage', 'mortgage', 'compound-interest'],
    articles: ['how-to-calculate-a-percentage', 'percentage-increase'],
  },
];

export const calculatorBySlug = (slug: string) => CALCULATORS.find((c) => c.slug === slug);
