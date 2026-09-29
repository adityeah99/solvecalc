import { mountForm, FieldError, fmt } from '../calc-form.ts';
import { solveLinear } from '../../lib/math/linear.ts';
import { toNumber, toString } from '../../lib/math/rational.ts';
import { MathError } from '../../lib/math/expression.ts';

const form = document.getElementById('eq-form') as HTMLFormElement;

form.querySelectorAll<HTMLButtonElement>('[data-example]').forEach((b) =>
  b.addEventListener('click', () => {
    const input = form.elements.namedItem('eq') as HTMLInputElement;
    input.value = b.dataset.example!;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  }),
);

mountForm(form, (r) => {
  const text = r.text('eq', 'an equation');
  let res;
  try {
    res = solveLinear(text);
  } catch (e) {
    throw new FieldError('eq', e instanceof MathError ? e.message : 'That equation could not be read');
  }
  if (res.kind === 'none') {
    return { lines: [{ label: 'Solution', value: 'No solution', primary: true }], steps: res.steps };
  }
  if (res.kind === 'all') {
    return { lines: [{ label: 'Solution', value: `Every value of ${res.variable} works`, primary: true }], steps: res.steps };
  }
  const exact = toString(res.value);
  const lines = [{ label: `${res.variable} =`, value: exact, primary: true }];
  if (res.value.d !== 1) lines.push({ label: 'As a decimal', value: fmt(toNumber(res.value)) });
  return { lines, steps: res.steps, note: `Check: put ${res.variable} = ${exact} back into both sides and they match.` };
});
