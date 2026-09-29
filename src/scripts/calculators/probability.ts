import { mountForm, FieldError, fmt, type Reader } from '../calc-form.ts';
import { combinations, gcd, parseNumber, permutations } from '../../lib/math/number.ts';
import { approximate, toString } from '../../lib/math/rational.ts';

function readProb(r: Reader, name: string, label: string): number {
  const raw = r.text(name, label);
  let v: number;
  try {
    v = raw.endsWith('%') ? parseNumber(raw.slice(0, -1), label) / 100 : parseNumber(raw, label);
  } catch (e) {
    throw new FieldError(name, (e as Error).message);
  }
  if (v < 0 || v > 1) throw new FieldError(name, `${label} must be between 0 and 1 (or 0% and 100%)`);
  return v;
}

const pct = (p: number) => `${fmt(p * 100)}%`;
/** A simple fraction for p when one exists (denominator up to 10,000). */
const frac = (p: number) => {
  const f = approximate(p, 10000);
  return Math.abs(f.n / f.d - p) < 1e-10 ? toString(f) : '';
};
const big = (n: bigint) => n.toLocaleString('en-US');

const form = document.getElementById('prob-form') as HTMLFormElement;
mountForm(form, (r) => {
  const mode = r.value('mode');
  if (mode === 'single') {
    const fav = r.num('fav', 'the favorable outcomes', { integer: true, min: 0 });
    const total = r.num('total', 'the total outcomes', { integer: true, positive: true });
    if (fav > total) throw new FieldError('fav', 'Favorable outcomes cannot be more than the total');
    const g = gcd(fav, total) || 1;
    const p = fav / total;
    const not = total - fav;
    return {
      lines: [
        { label: 'P(event)', value: `${fav / g}/${total / g}`, primary: true },
        { label: 'Decimal / percent', value: `${fmt(p)} / ${pct(p)}` },
        { label: 'P(not the event)', value: `${not / (gcd(not, total) || 1)}/${total / (gcd(not, total) || 1)} = ${pct(1 - p)}` },
        { label: 'Odds for', value: `${fav / (gcd(fav, not) || 1)} : ${not / (gcd(fav, not) || 1)}` },
        { label: 'Odds against', value: `${not / (gcd(fav, not) || 1)} : ${fav / (gcd(fav, not) || 1)}` },
      ],
      steps: [
        `P = favorable ÷ total = ${fav} ÷ ${total}${g > 1 ? ` = ${fav / g}/${total / g}` : ''}`,
        `P(not) = 1 − P = ${total - fav} ÷ ${total}`,
      ],
    };
  }
  if (mode === 'two') {
    const a = readProb(r, 'pa', 'P(A)');
    const b = readProb(r, 'pb', 'P(B)');
    const and = a * b;
    const or = a + b - and;
    const neither = (1 - a) * (1 - b);
    const one = a * (1 - b) + (1 - a) * b;
    const show = (p: number) => {
      const f = frac(p);
      return f && f !== fmt(p) ? `${f} = ${pct(p)}` : pct(p);
    };
    return {
      lines: [
        { label: 'P(A and B)', value: show(and), primary: true },
        { label: 'P(A or B)', value: show(or) },
        { label: 'P(neither)', value: show(neither) },
        { label: 'P(exactly one)', value: show(one) },
      ],
      steps: [
        `A and B: multiply, because the events are independent: ${fmt(a)} × ${fmt(b)} = ${fmt(and)}`,
        `A or B: add, then take away the overlap counted twice: ${fmt(a)} + ${fmt(b)} − ${fmt(and)} = ${fmt(or)}`,
        `Neither: (1 − ${fmt(a)}) × (1 − ${fmt(b)}) = ${fmt(neither)}`,
      ],
    };
  }
  const n = r.num('n', 'n', { integer: true, min: 0, max: 10000 });
  const k = r.num('r', 'r', { integer: true, min: 0 });
  if (k > n) throw new FieldError('r', 'r cannot be bigger than n');
  const c = combinations(n, k);
  const p = permutations(n, k);
  return {
    lines: [
      { label: `Combinations C(${n}, ${k})`, value: big(c), primary: true },
      { label: `Permutations P(${n}, ${k})`, value: big(p) },
    ],
    steps: [
      `Permutations count ordered choices: ${n}!/(${n} − ${k})! = ${big(p)}`,
      `Combinations ignore order, so divide by ${k}! (the ways to arrange the chosen ${k}): ${big(p)} ÷ ${k}! = ${big(c)}`,
    ],
  };
});
