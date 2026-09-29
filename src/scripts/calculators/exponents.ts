import { mountForm, FieldError, fmt } from '../calc-form.ts';
import { parseRational, toString, type Rational } from '../../lib/math/rational.ts';
import { MathError } from '../../lib/math/expression.ts';

const form = document.getElementById('exp-form') as HTMLFormElement;
mountForm(form, (r) => {
  const a = r.num('base', 'a base');
  const expText = r.text('exp', 'an exponent');
  let n: Rational;
  try {
    n = parseRational(expText);
  } catch (e) {
    throw new FieldError('exp', e instanceof MathError ? e.message : 'The exponent is not a number');
  }
  const nv = n.n / n.d;
  const nStr = toString(n);
  // Brackets keep the meaning clear: (−8)^(1/3), not −8^1/3.
  const baseStr = a < 0 ? `(${fmt(a)})` : fmt(a);
  const expStr = n.d !== 1 || n.n < 0 ? `(${nStr})` : nStr;
  const steps: string[] = [];

  if (a === 0 && nv < 0) throw new FieldError('base', '0 to a negative power is undefined (it would mean dividing by 0)');
  if (a === 0 && nv === 0) {
    return {
      lines: [{ label: '0⁰ =', value: '1', primary: true }],
      steps: ['By convention 0⁰ is taken as 1 in algebra and on most calculators.'],
      note: 'Some areas of math leave 0⁰ undefined.',
    };
  }

  let value: number;
  if (a < 0 && n.d !== 1) {
    // Negative base, fractional exponent: real only when the root is odd.
    if (n.d % 2 === 0) throw new FieldError('exp', `(${fmt(a)})^(${nStr}) is not a real number: it needs an even root of a negative number`);
    const root = -Math.pow(-a, 1 / n.d);
    value = Math.pow(root, n.n);
    steps.push(`The exponent ${nStr} means: take the ${ordinal(n.d)} root, then raise to the power ${n.n}`);
    steps.push(`${ordinal(n.d)} root of ${fmt(a)} = ${fmt(root)} (an odd root of a negative number is negative)`);
    steps.push(`(${fmt(root)})^${n.n} = ${fmt(value)}`);
  } else {
    value = Math.pow(a, nv);
    if (n.d === 1 && nv > 0 && nv <= 12 && Number.isInteger(nv)) {
      steps.push(`Multiply ${baseStr} by itself ${nv} time${nv === 1 ? '' : 's'}: ${Array(nv).fill(baseStr).join(' × ')} = ${fmt(value)}`);
    } else if (n.d === 1 && nv > 12) {
      steps.push(`${baseStr}^${nv} means ${nv} copies of ${baseStr} multiplied together = ${fmt(value)}`);
    } else if (nv === 0) {
      steps.push('Any non-zero number to the power 0 is 1.');
    } else if (n.d === 1 && nv < 0) {
      const pos = Math.pow(a, -nv);
      steps.push(`A negative exponent means "one over": ${baseStr}^${expStr} = 1 ÷ ${baseStr}^${-nv}`);
      steps.push(`${baseStr}^${-nv} = ${fmt(pos)}, so the answer is 1 ÷ ${fmt(pos)} = ${fmt(value)}`);
    } else {
      const absN = Math.abs(n.n);
      const root = Math.pow(a, 1 / n.d);
      steps.push(`The exponent ${nStr} means: take the ${ordinal(n.d)} root, then raise to the power ${absN}${n.n < 0 ? ', then take one over it' : ''}`);
      steps.push(`${ordinal(n.d)} root of ${fmt(a)} = ${fmt(root)}`);
      steps.push(`${fmt(root)}^${absN} = ${fmt(Math.pow(root, absN))}${n.n < 0 ? `, and 1 ÷ that = ${fmt(value)}` : ''}`);
    }
  }
  if (!Number.isFinite(value)) throw new FieldError('exp', 'The answer is too large to show');
  return {
    lines: [
      { label: `${baseStr}^${expStr} =`, value: fmt(value, 12), primary: true },
      ...(Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-3 && value !== 0) ? [{ label: 'Scientific notation', value: sci(value) }] : []),
    ],
    steps,
  };
});

function sci(v: number) {
  const [m, e] = v.toExponential(6).split('e');
  const mant = m.replace(/\.?0+$/, '');
  return `${mant} × 10^${Number(e)}`;
}

function ordinal(k: number) {
  if (k === 2) return 'square';
  if (k === 3) return 'cube';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = k % 100;
  return `${k}${s[(v - 20) % 10] || s[v] || s[0]}`;
}
