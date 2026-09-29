import { mountForm, FieldError, fmt, type Reader } from '../calc-form.ts';
import { add, div, mul, rat, sub, toMixed, toNumber, toString, type Rational } from '../../lib/math/rational.ts';
import { gcd, lcm } from '../../lib/math/number.ts';

const SYMBOL: Record<string, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function readFraction(r: Reader, i: 1 | 2): { value: Rational; text: string; mixed: boolean } {
  const whole = r.optNum(`w${i}`, 'the whole number');
  const n = r.num(`n${i}`, 'a numerator', { integer: true });
  const d = r.num(`d${i}`, 'a denominator', { integer: true });
  if (d === 0) throw new FieldError(`d${i}`, 'The denominator cannot be 0');
  if (whole !== null && !Number.isInteger(whole)) throw new FieldError(`w${i}`, 'The whole number must be a whole number');
  if (whole !== null && whole !== 0) {
    if (n < 0 || d < 0) throw new FieldError(`n${i}`, 'With a whole number, keep the fraction part positive');
    const sign = whole < 0 ? -1 : 1;
    const value = rat(sign * (Math.abs(whole) * d + n), d);
    return { value, text: `${whole} ${n}/${d}`, mixed: true };
  }
  return { value: rat(n, d), text: `${n}/${d}`, mixed: false };
}

const form = document.getElementById('frac-form') as HTMLFormElement;
mountForm(form, (r) => {
  const a = readFraction(r, 1);
  const b = readFraction(r, 2);
  const op = r.value('op');
  const steps: string[] = [];

  // Mixed numbers become improper fractions first.
  const imp = (f: typeof a) => (f.mixed ? `${f.text} = ${toString(f.value)}` : null);
  [imp(a), imp(b)].forEach((s) => s && steps.push(`Change the mixed number to an improper fraction: ${s}`));

  const A = a.value;
  const B = b.value;
  let result: Rational;
  if (op === '+' || op === '-') {
    const common = lcm(A.d, B.d);
    const an = A.n * (common / A.d);
    const bn = B.n * (common / B.d);
    if (A.d !== B.d) {
      steps.push(`Find a common denominator: LCM(${A.d}, ${B.d}) = ${common}`);
      steps.push(`Rewrite both: ${toString(A)} = ${an}/${common} and ${toString(B)} = ${bn}/${common}`);
    }
    const top = op === '+' ? an + bn : an - bn;
    steps.push(`${op === '+' ? 'Add' : 'Subtract'} the numerators: ${an} ${SYMBOL[op]} ${bn < 0 ? `(${bn})` : bn} = ${top}, so the answer is ${top}/${common}`);
    result = op === '+' ? add(A, B) : sub(A, B);
    const g = gcd(top, common);
    if (g > 1) steps.push(`Simplify by dividing top and bottom by ${g}: ${toString(result)}`);
  } else if (op === '*') {
    const top = A.n * B.n;
    const bottom = A.d * B.d;
    steps.push(`Multiply the tops and the bottoms: (${A.n} × ${B.n}) / (${A.d} × ${B.d}) = ${top}/${bottom}`);
    result = mul(A, B);
    const g = gcd(top, bottom);
    if (g > 1) steps.push(`Simplify by dividing top and bottom by ${g}: ${toString(result)}`);
  } else {
    if (B.n === 0) throw new FieldError('n2', "You can't divide by zero");
    const flipped = rat(B.d, B.n);
    steps.push(`Flip the second fraction: ${toString(B)} becomes ${toString(flipped)}`);
    const top = A.n * flipped.n;
    const bottom = A.d * flipped.d;
    steps.push(`Multiply: (${A.n} × ${flipped.n}) / (${A.d} × ${flipped.d}) = ${top}/${bottom}`);
    result = div(A, B);
    const g = gcd(top, bottom);
    if (g > 1) steps.push(`Simplify by dividing top and bottom by ${g}: ${toString(result)}`);
  }

  const lines = [
    { label: `${a.text} ${SYMBOL[op]} ${b.text} =`, value: toString(result), primary: true },
    { label: 'Mixed number', value: toMixed(result) },
    { label: 'Decimal', value: fmt(toNumber(result)) },
  ];
  return { lines, steps };
});
