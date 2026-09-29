// Exact fractions n/d (d > 0, always reduced) for the fraction calculator,
// the equation solver and ratio work.
import { MathError } from './expression.ts';
import { assertSafeInt, gcd } from './number.ts';

export interface Rational {
  n: number;
  d: number;
}

export function rat(n: number, d = 1): Rational {
  if (d === 0) throw new MathError('A fraction cannot have 0 as its denominator');
  if (!Number.isInteger(n) || !Number.isInteger(d)) return fromDecimal(n / d);
  assertSafeInt(n);
  assertSafeInt(d);
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
}

/** Converts a finite decimal to an exact fraction: 0.375 -> 3/8. */
export function fromDecimal(x: number): Rational {
  if (!Number.isFinite(x)) throw new MathError('That number is too large');
  if (Number.isInteger(x)) return rat(x, 1);
  const s = x.toString();
  if (s.includes('e')) {
    // Very small/large numbers: fall back to a close fraction.
    return approximate(x);
  }
  const places = s.split('.')[1]?.length ?? 0;
  if (places > 12) return approximate(x);
  const d = 10 ** places;
  return rat(Math.round(x * d), d);
}

/** Continued-fraction approximation with a bounded denominator. */
export function approximate(x: number, maxDen = 1_000_000): Rational {
  let [h0, h1, k0, k1] = [0, 1, 1, 0];
  let v = x;
  for (let i = 0; i < 64; i++) {
    const a = Math.floor(v);
    const h2 = a * h1 + h0;
    const k2 = a * k1 + k0;
    if (k2 > maxDen) break;
    [h0, h1, k0, k1] = [h1, h2, k1, k2];
    if (Math.abs(x - h1 / k1) < 1e-12) break;
    v = 1 / (v - a);
    if (!Number.isFinite(v)) break;
  }
  return rat(h1, k1);
}

export const add = (a: Rational, b: Rational) => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Rational, b: Rational) => rat(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Rational, b: Rational) => rat(a.n * b.n, a.d * b.d);
export function div(a: Rational, b: Rational) {
  if (b.n === 0) throw new MathError("Can't divide by zero");
  return rat(a.n * b.d, a.d * b.n);
}
export const neg = (a: Rational): Rational => ({ n: -a.n, d: a.d });
export const isZero = (a: Rational) => a.n === 0;
export const eq = (a: Rational, b: Rational) => a.n === b.n && a.d === b.d;
export const toNumber = (a: Rational) => a.n / a.d;

export function toString(a: Rational): string {
  return a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`;
}

/** Mixed-number form: -7/3 -> "-2 1/3". */
export function toMixed(a: Rational): string {
  if (a.d === 1 || Math.abs(a.n) < a.d) return toString(a);
  const sign = a.n < 0 ? '-' : '';
  const whole = Math.floor(Math.abs(a.n) / a.d);
  const rest = Math.abs(a.n) % a.d;
  return `${sign}${whole} ${rest}/${a.d}`;
}

/** Parses "3", "-2.5", "3/4" or "1 1/2" into an exact fraction. */
export function parseRational(text: string): Rational {
  const t = text.trim().replace(/−/g, '-');
  let m = t.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (m) {
    const whole = Number(m[2]);
    const r = add(rat(whole), rat(Number(m[3]), Number(m[4])));
    return m[1] ? neg(r) : r;
  }
  m = t.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (m) return rat(Number(m[1]), Number(m[2]));
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return fromDecimal(Number(t));
  throw new MathError(`"${text.trim()}" is not a number or fraction`);
}
