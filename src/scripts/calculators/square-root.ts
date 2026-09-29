import { mountForm, FieldError, fmt, type Line } from '../calc-form.ts';
import { formatFactors, primeFactors, simplifySqrt } from '../../lib/math/number.ts';

const form = document.getElementById('sqrt-form') as HTMLFormElement;
mountForm(form, (r) => {
  const x = r.num('x', 'a number');
  if (Math.abs(x) > 1e15) throw new FieldError('x', 'That number is too large (limit 10¹⁵)');
  const lines: Line[] = [];
  const steps: string[] = [];
  const abs = Math.abs(x);
  const whole = Number.isInteger(x);
  const i = x < 0 ? 'i' : '';

  let simplified: string | null = null;
  if (whole && abs > 0) {
    const { outside, inside } = simplifySqrt(abs);
    if (inside === 1) simplified = `${outside}${i}`;
    else if (outside > 1) simplified = `${outside}${i}√${inside}`;
    else if (x < 0) simplified = `i√${inside}`;
    if (abs > 1) steps.push(`Prime factors: ${abs} = ${formatFactors(primeFactors(abs))}`);
    if (outside > 1 && inside > 1) steps.push(`Take out each pair of equal factors: √${abs} = √(${outside * outside} × ${inside}) = ${outside}√${inside}`);
    if (inside === 1) steps.push(`Every factor pairs up, so ${abs} is a perfect square: ${outside} × ${outside} = ${abs}`);
  }

  const root = Math.sqrt(abs);
  lines.push({ label: `√${fmt(x)} =`, value: simplified ?? `${fmt(root, 12)}${i}`, primary: true });
  if (simplified && !Number.isInteger(root)) lines.push({ label: 'Decimal', value: `≈ ${fmt(root, 12)}${i}` });
  if (x < 0) steps.push(`A negative number has no real square root. Using i = √−1: √${fmt(x)} = √${fmt(abs)} × i`);
  lines.push({ label: 'Perfect square?', value: whole && x >= 0 && Number.isInteger(root) ? 'Yes' : 'No' });
  const cube = Math.cbrt(x);
  lines.push({ label: `∛${fmt(x)} =`, value: fmt(cube, 12) });
  if (!steps.length) steps.push(`√${fmt(x)} is the number that multiplies by itself to give ${fmt(x)}: ${fmt(root, 12)} × ${fmt(root, 12)} ≈ ${fmt(x)}`);
  return { lines, steps };
});
