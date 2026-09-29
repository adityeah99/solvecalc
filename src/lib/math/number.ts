// Whole-number helpers shared by the fraction, GCD/LCM, ratio, root and
// probability calculators.
import { MathError } from './expression.ts';

export function assertSafeInt(n: number, label = 'number') {
  if (!Number.isSafeInteger(n)) throw new MathError(`That ${label} is too large to work with exactly`);
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  const r = Math.abs((a / gcd(a, b)) * b);
  assertSafeInt(r, 'result');
  return r;
}

export interface EuclidStep {
  a: number;
  b: number;
  q: number;
  r: number;
}

/** Steps of the Euclidean algorithm: a = q × b + r until r = 0. */
export function euclidSteps(a: number, b: number): EuclidStep[] {
  a = Math.abs(a);
  b = Math.abs(b);
  if (a < b) [a, b] = [b, a];
  const steps: EuclidStep[] = [];
  while (b) {
    const q = Math.floor(a / b);
    const r = a % b;
    steps.push({ a, b, q, r });
    [a, b] = [b, r];
  }
  return steps;
}

/** Prime factorisation as [prime, power] pairs, e.g. 72 -> [[2,3],[3,2]]. */
export function primeFactors(n: number): [number, number][] {
  assertSafeInt(n);
  n = Math.abs(n);
  const out: [number, number][] = [];
  for (let p = 2; p * p <= n; p += p === 2 ? 1 : 2) {
    let k = 0;
    while (n % p === 0) {
      n /= p;
      k++;
    }
    if (k) out.push([p, k]);
  }
  if (n > 1) out.push([n, 1]);
  return out;
}

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
export const superscript = (n: number | string) => String(n).replace(/[0-9-]/g, (c) => SUP[c]);

export function formatFactors(f: [number, number][]): string {
  if (f.length === 0) return '1';
  return f.map(([p, k]) => (k === 1 ? `${p}` : `${p}${superscript(k)}`)).join(' × ');
}

/** √n for a whole n as outside·√inside, e.g. 72 -> { outside: 6, inside: 2 }. */
export function simplifySqrt(n: number): { outside: number; inside: number } {
  assertSafeInt(n);
  let outside = 1;
  let inside = 1;
  for (const [p, k] of primeFactors(n)) {
    outside *= p ** Math.floor(k / 2);
    inside *= p ** (k % 2);
  }
  return { outside, inside };
}

/** Exact nCr / nPr with BigInt, returned as a decimal string. */
export function combinations(n: number, r: number): bigint {
  checkCount(n, r);
  if (r > n - r) r = n - r;
  let num = 1n;
  let den = 1n;
  for (let i = 0; i < r; i++) {
    num *= BigInt(n - i);
    den *= BigInt(i + 1);
  }
  return num / den;
}

export function permutations(n: number, r: number): bigint {
  checkCount(n, r);
  let out = 1n;
  for (let i = 0; i < r; i++) out *= BigInt(n - i);
  return out;
}

function checkCount(n: number, r: number) {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0)
    throw new MathError('n and r must be whole numbers 0 or bigger');
  if (r > n) throw new MathError('r cannot be bigger than n');
  if (n > 10000) throw new MathError('n is too large (max 10,000)');
}

/** Parses "3, 4.5 7\n-2" into numbers, reporting the first bad entry. */
export function parseNumberList(text: string): number[] {
  const parts = text
    .split(/[\s,;]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.map((p) => {
    const v = Number(p.replace(/−/g, '-'));
    if (!Number.isFinite(v)) throw new MathError(`"${p}" is not a number`);
    return v;
  });
}

/** Parses a user-typed number, allowing a fraction like "3/4" and a leading minus sign. */
export function parseNumber(text: string, label = 'value'): number {
  const t = text.trim().replace(/−/g, '-').replace(/,/g, '');
  if (!t) throw new MathError(`Enter a ${label}`);
  const frac = t.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (frac) {
    const d = Number(frac[2]);
    if (d === 0) throw new MathError(`The ${label} has a zero denominator`);
    return Number(frac[1]) / d;
  }
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) throw new MathError(`The ${label} "${text.trim()}" is not a number`);
  return Number(t);
}

export const isWhole = (n: number) => Number.isInteger(n);
