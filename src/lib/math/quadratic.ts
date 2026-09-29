import { MathError, formatNumber } from './expression.ts';
import { fromDecimal, toString, type Rational } from './rational.ts';

export interface QuadraticResult {
  discriminant: number;
  kind: 'two-real' | 'one-real' | 'complex';
  roots: string[]; // display strings
  rootValues: number[]; // real roots only
  vertex: { x: number; y: number };
  factored: string | null;
  steps: string[];
}

const f = (n: number) => formatNumber(n, 10);

function isPerfectSquare(n: number) {
  if (n < 0 || !Number.isSafeInteger(n)) return false;
  const r = Math.round(Math.sqrt(n));
  return r * r === n;
}

/** Rational roots when a, b, c are rational and b² − 4ac is a perfect square of a rational. */
function rationalRoots(a: Rational, b: Rational, c: Rational): [Rational, Rational] | null {
  // Scale to integer coefficients: A x² + B x + C with A = a·L etc.
  const L = [a.d, b.d, c.d].reduce((m, d) => (m * d) / gcdN(m, d));
  const A = a.n * (L / a.d);
  const B = b.n * (L / b.d);
  const C = c.n * (L / c.d);
  const D = B * B - 4 * A * C;
  if (!Number.isSafeInteger(D) || !isPerfectSquare(D)) return null;
  const s = Math.round(Math.sqrt(D));
  const mk = (num: number, den: number): Rational => {
    const g = gcdN(Math.abs(num), Math.abs(den)) || 1;
    const sign = den < 0 ? -1 : 1;
    return { n: (sign * num) / g, d: Math.abs(den) / g };
  };
  return [mk(-B + s, 2 * A), mk(-B - s, 2 * A)];
}
const gcdN = (a: number, b: number): number => (b ? gcdN(b, a % b) : Math.abs(a));

function factorTerm(r: Rational): string {
  // (x − p/q) written as (qx − p)
  const coef = r.d === 1 ? 'x' : `${r.d}x`;
  if (r.n === 0) return coef === 'x' ? 'x' : `${coef}`;
  return r.n > 0 ? `(${coef} − ${r.n})` : `(${coef} + ${-r.n})`;
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  if (![a, b, c].every(Number.isFinite)) throw new MathError('Enter numbers for a, b and c');
  if (a === 0) throw new MathError('a cannot be 0, otherwise it is a linear equation. Try the equation solver.');
  const D = b * b - 4 * a * c;
  const steps: string[] = [];
  steps.push(`Write down a = ${f(a)}, b = ${f(b)}, c = ${f(c)}.`);
  steps.push(`Discriminant: b² − 4ac = (${f(b)})² − 4 × ${f(a)} × ${f(c)} = ${f(D)}`);
  const vx = -b / (2 * a);
  const vertex = { x: vx === 0 ? 0 : vx, y: a * vx * vx + b * vx + c };
  const twoA = 2 * a;

  let kind: QuadraticResult['kind'];
  let roots: string[];
  let rootValues: number[] = [];
  if (Math.abs(D) < 1e-12) {
    kind = 'one-real';
    rootValues = [vx];
    roots = [f(vx)];
    steps.push(`The discriminant is 0, so there is one repeated root: x = −b ÷ 2a = ${f(-b)} ÷ ${f(twoA)} = ${f(vx)}`);
  } else if (D > 0) {
    kind = 'two-real';
    const sq = Math.sqrt(D);
    const x1 = (-b + sq) / twoA;
    const x2 = (-b - sq) / twoA;
    rootValues = [x1, x2].sort((p, q) => q - p);
    roots = rootValues.map(f);
    steps.push(`The discriminant is positive, so there are two real roots.`);
    steps.push(`x = (−b ± √D) ÷ 2a = (${f(-b)} ± √${f(D)}) ÷ ${f(twoA)}`);
    steps.push(`√${f(D)} ≈ ${f(sq)}, so x = ${roots[0]} or x = ${roots[1]}`);
  } else {
    kind = 'complex';
    const re = -b / twoA;
    const im = Math.abs(Math.sqrt(-D) / twoA);
    const reS = re === 0 ? '' : `${f(re)} `;
    roots = [`${reS}${re === 0 ? '' : '+ '}${f(im)}i`, `${reS}− ${f(im)}i`].map((s) => s.trim());
    steps.push(`The discriminant is negative, so there are no real roots. The roots are complex numbers.`);
    steps.push(`x = (−b ± √D) ÷ 2a = (${f(-b)} ± √(${f(D)})) ÷ ${f(twoA)} = ${f(re)} ± ${f(im)}i`);
  }

  let factored: string | null = null;
  if (kind !== 'complex') {
    const ra = fromDecimal(a);
    const rr = rationalRoots(ra, fromDecimal(b), fromDecimal(c));
    if (rr) {
      // a(x − r1)(x − r2), pulling each root's denominator into its bracket.
      const [r1, r2] = rr;
      const lead = a / (r1.d * r2.d);
      const leadStr = lead === 1 ? '' : lead === -1 ? '−' : `${toString(fromDecimal(lead))}`;
      factored = r1.n === r2.n && r1.d === r2.d ? `${leadStr}${factorTerm(r1)}²` : `${leadStr}${factorTerm(r1)}${factorTerm(r2)}`;
    }
  }

  return { discriminant: D, kind, roots, rootValues, vertex, factored, steps };
}
