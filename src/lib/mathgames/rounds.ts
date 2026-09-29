// Question generators for the timed math games. Pure functions of a random
// source, so they can be unit tested with a seeded generator.
import { gcd } from '../math/number.ts';

export type Rng = () => number;

export type Visual =
  | { kind: 'fractions'; left: [number, number]; right: [number, number] }
  | { kind: 'marbles'; counts: { red: number; blue: number; green: number } }
  | { kind: 'numbers'; values: number[] };

export interface Round {
  /** Plain-text question */
  prompt: string;
  visual?: Visual;
  /** Correct answer: a number as text (input mode) or one of `choices` */
  answer: string;
  choices?: string[];
  /** Shown after a wrong answer */
  explain: string;
}

export type Level = 1 | 2 | 3;

export const randInt = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
export const pick = <T>(rng: Rng, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)];
export function shuffle<T>(rng: Rng, xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Small seeded generator (mulberry32) for tests and repeatable puzzles. */
export function seeded(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const neg = (n: number) => (n < 0 ? `−${-n}` : `${n}`);
const paren = (n: number) => (n < 0 ? `(−${-n})` : `${n}`);

// ── Sum Sprint ────────────────────────────────────────────────
export function sumSprint(rng: Rng, level: Level): Round {
  const op = pick(rng, ['+', '−', '×', '÷'] as const);
  let a: number;
  let b: number;
  let ans: number;
  const ranges = {
    1: { add: [1, 20], mul: [2, 6] },
    2: { add: [10, 99], mul: [2, 12] },
    3: { add: [100, 999], mul: [6, 19] },
  }[level];
  switch (op) {
    case '+':
      a = randInt(rng, ranges.add[0], ranges.add[1]);
      b = randInt(rng, ranges.add[0], ranges.add[1]);
      ans = a + b;
      break;
    case '−':
      a = randInt(rng, ranges.add[0], ranges.add[1]);
      b = randInt(rng, ranges.add[0], ranges.add[1]);
      if (b > a) [a, b] = [b, a];
      ans = a - b;
      break;
    case '×':
      a = randInt(rng, ranges.mul[0], ranges.mul[1]);
      b = randInt(rng, 2, level === 3 ? 12 : ranges.mul[1]);
      ans = a * b;
      break;
    default:
      b = randInt(rng, 2, level === 1 ? 6 : 12);
      ans = randInt(rng, 2, level === 3 ? 25 : level === 2 ? 12 : 6);
      a = ans * b;
  }
  return { prompt: `${a} ${op} ${b}`, answer: String(ans), explain: `${a} ${op} ${b} = ${ans}` };
}

// ── Solve for X ───────────────────────────────────────────────
export function solveForX(rng: Rng, level: Level): Round {
  const x = level === 1 ? randInt(rng, 1, 12) : randInt(rng, -9, 15);
  const form = level === 1 ? randInt(rng, 0, 2) : level === 2 ? randInt(rng, 3, 4) : randInt(rng, 5, 6);
  let prompt: string;
  let steps: string[];
  switch (form) {
    case 0: {
      const a = randInt(rng, 1, 15);
      prompt = `x + ${a} = ${x + a}`;
      steps = [`Take ${a} from both sides: x = ${x + a} − ${a}`];
      break;
    }
    case 1: {
      const a = randInt(rng, 1, x);
      prompt = `x − ${a} = ${x - a}`;
      steps = [`Add ${a} to both sides: x = ${x - a} + ${a}`];
      break;
    }
    case 2: {
      const a = randInt(rng, 2, 9);
      prompt = `${a}x = ${a * x}`;
      steps = [`Divide both sides by ${a}: x = ${a * x} ÷ ${a}`];
      break;
    }
    case 3: {
      const a = randInt(rng, 2, 9);
      const b = randInt(rng, 1, 20);
      const c = a * x + b;
      prompt = `${a}x + ${b} = ${neg(c)}`;
      steps = [`Take ${b} from both sides: ${a}x = ${neg(c - b)}`, `Divide by ${a}`];
      break;
    }
    case 4: {
      const a = randInt(rng, 2, 9);
      const b = randInt(rng, 1, 20);
      const c = a * x - b;
      prompt = `${a}x − ${b} = ${neg(c)}`;
      steps = [`Add ${b} to both sides: ${a}x = ${neg(c + b)}`, `Divide by ${a}`];
      break;
    }
    case 5: {
      // ax + b = cx + d
      const c = randInt(rng, 1, 6);
      const a = c + randInt(rng, 1, 5);
      const b = randInt(rng, -10, 10);
      const d = (a - c) * x + b;
      const cx = c === 1 ? 'x' : `${c}x`;
      prompt = `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${cx} ${d < 0 ? '−' : '+'} ${Math.abs(d)}`;
      steps = [`Take ${cx} from both sides: ${a - c === 1 ? '' : a - c}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${neg(d)}`, `Then solve: ${a - c === 1 ? '' : a - c}x = ${neg(d - b)}`];
      break;
    }
    default: {
      // a(x + b) = c
      const a = randInt(rng, 2, 6);
      const b = randInt(rng, 1, 9);
      const c = a * (x + b);
      prompt = `${a}(x + ${b}) = ${neg(c)}`;
      steps = [`Divide both sides by ${a}: x + ${b} = ${neg(c / a)}`, `Take ${b} from both sides`];
    }
  }
  return { prompt, answer: String(x), explain: `${steps.join('. ')}. So x = ${neg(x)}.` };
}

// ── Fraction Face-off ─────────────────────────────────────────
export const FACEOFF_CHOICES = ['Left is bigger', 'Equal', 'Right is bigger'];

export function fractionFaceoff(rng: Rng): Round {
  let left: [number, number];
  let right: [number, number];
  if (rng() < 0.2) {
    // equivalent fractions
    const d = randInt(rng, 2, 6);
    const n = randInt(rng, 1, d - 1);
    const k = randInt(rng, 2, 4);
    left = [n, d];
    right = [n * k, d * k];
    if (rng() < 0.5) [left, right] = [right, left];
  } else {
    do {
      const d1 = randInt(rng, 2, 12);
      const d2 = randInt(rng, 2, 12);
      left = [randInt(rng, 1, d1 - 1), d1];
      right = [randInt(rng, 1, d2 - 1), d2];
    } while (left[0] * right[1] === right[0] * left[1]);
  }
  const l = left[0] * right[1];
  const r = right[0] * left[1];
  const answer = l > r ? FACEOFF_CHOICES[0] : l < r ? FACEOFF_CHOICES[2] : FACEOFF_CHOICES[1];
  const [a, b] = left;
  const [c, d] = right;
  const cmp = l > r ? '>' : l < r ? '<' : '=';
  return {
    prompt: 'Which fraction is bigger?',
    visual: { kind: 'fractions', left, right },
    answer,
    choices: FACEOFF_CHOICES,
    explain: `Cross-multiply: ${a} × ${d} = ${l} and ${c} × ${b} = ${r}. ${l} ${cmp} ${r}, so ${a}/${b} ${cmp} ${c}/${d}.`,
  };
}

// ── Prime Time ────────────────────────────────────────────────
export const PRIME_CHOICES = ['Prime', 'Not prime'];

export function isPrime(n: number) {
  if (n < 2) return false;
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return false;
  return true;
}
export function smallestFactor(n: number) {
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return p;
  return n;
}

export function primeTime(rng: Rng): Round {
  let n: number;
  const wantPrime = rng() < 0.45;
  do n = randInt(rng, 1, 120);
  while (isPrime(n) !== wantPrime);
  const prime = isPrime(n);
  let explain: string;
  if (n === 1) explain = '1 is not prime: a prime needs exactly two factors, and 1 has only one.';
  else if (prime) explain = `${n} is prime: nothing between 2 and ${Math.floor(Math.sqrt(n))} divides it.`;
  else {
    const p = smallestFactor(n);
    explain = `${n} = ${p} × ${n / p}, so it is not prime.`;
  }
  return { prompt: `Is ${n} prime?`, visual: { kind: 'numbers', values: [n] }, answer: prime ? PRIME_CHOICES[0] : PRIME_CHOICES[1], choices: PRIME_CHOICES, explain };
}

// ── Average Aim ───────────────────────────────────────────────
function distinctChoices(rng: Rng, correct: number, candidates: number[]): string[] {
  const set = new Set<number>([correct]);
  for (const c of candidates) if (set.size < 4 && Number.isInteger(c) && c >= 0) set.add(c);
  let spread = 1;
  while (set.size < 4) {
    const c = correct + (rng() < 0.5 ? -spread : spread);
    if (c >= 0) set.add(c);
    spread++;
  }
  return shuffle(rng, [...set].map(String));
}

export function averageAim(rng: Rng): Round {
  const values = Array.from({ length: 5 }, () => randInt(rng, 1, 20));
  // Make the mean a whole number by nudging the last value.
  const rem = values.reduce((a, b) => a + b, 0) % 5;
  values[4] = values[4] - rem >= 1 ? values[4] - rem : values[4] + (5 - rem);
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / 5;
  const median = sorted[2];
  const range = sorted[4] - sorted[0];
  const ask = pick(rng, ['mean', 'median', 'range'] as const);
  const answer = { mean, median, range }[ask];
  const others = [mean, median, range, sorted[4], sum].filter((v) => v !== answer);
  const explain = {
    mean: `Add them: ${values.join(' + ')} = ${sum}. Divide by 5: ${sum} ÷ 5 = ${mean}.`,
    median: `In order: ${sorted.join(', ')}. The middle value is ${median}.`,
    range: `Largest − smallest = ${sorted[4]} − ${sorted[0]} = ${range}.`,
  }[ask];
  return {
    prompt: `What is the ${ask}?`,
    visual: { kind: 'numbers', values },
    answer: String(answer),
    choices: distinctChoices(rng, answer, others),
    explain,
  };
}

// ── Odds On ───────────────────────────────────────────────────
const frac = (n: number, d: number) => {
  const g = gcd(n, d) || 1;
  return `${n / g}/${d / g}`;
};

export function oddsOn(rng: Rng): Round {
  const counts = { red: randInt(rng, 1, 5), blue: randInt(rng, 1, 5), green: randInt(rng, 0, 4) };
  const total = counts.red + counts.blue + counts.green;
  const colors = (Object.keys(counts) as (keyof typeof counts)[]).filter((c) => counts[c] > 0);
  const color = pick(rng, colors);
  const not = rng() < 0.3;
  const k = counts[color];
  const hits = not ? total - k : k;
  const answer = frac(hits, total);
  // Distractors come from real slips: odds instead of probability, the complement,
  // and counting one colour wrong.
  const candidates = [frac(total - hits, total), hits < total - hits ? frac(hits, total - hits) : '', frac(Math.max(1, hits - 1), total), frac(Math.min(total, hits + 1), total), frac(hits, total + 1)];
  const seen = new Set([answer]);
  const choices = [answer];
  for (const c of candidates) {
    if (!c || c.endsWith('/0') || seen.has(c)) continue;
    const [n, d] = c.split('/').map(Number);
    if ([...seen].some((s) => { const [a, b] = s.split('/').map(Number); return a * d === n * b; })) continue;
    seen.add(c);
    choices.push(c);
    if (choices.length === 4) break;
  }
  for (let d = total + 2; choices.length < 4; d++) {
    const c = frac(hits, d);
    if (!seen.has(c)) {
      seen.add(c);
      choices.push(c);
    }
  }
  const name = not ? `not ${color}` : color;
  return {
    prompt: `You pick one marble without looking. What is P(${name})?`,
    visual: { kind: 'marbles', counts },
    answer,
    choices: shuffle(rng, choices),
    explain: `${hits} of the ${total} marbles are ${name}, so P(${name}) = ${hits}/${total}${frac(hits, total) !== `${hits}/${total}` ? ` = ${answer}` : ''}.`,
  };
}

export const ROUND_MAKERS: Record<string, (rng: Rng, level: Level) => Round> = {
  'sum-sprint': sumSprint,
  'solve-for-x': solveForX,
  'fraction-faceoff': (rng) => fractionFaceoff(rng),
  'prime-time': (rng) => primeTime(rng),
  'average-aim': (rng) => averageAim(rng),
  'odds-on': (rng) => oddsOn(rng),
};

export { paren };
