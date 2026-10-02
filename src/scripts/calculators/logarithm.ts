import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('logarithm-form') as HTMLFormElement;

mountForm(form, (r) => {
  const mode = r.value('mode');
  const x = r.num('x', 'x', { positive: true });

  if (mode === 'log10') {
    const v = Math.log10(x);
    return {
      lines: [
        { label: `log₁₀(${fmt(x)}) =`, value: fmt(v), primary: true },
        { label: 'As a power of 10', value: `10^${fmt(v)}` },
      ],
      steps: [
        `log₁₀(${fmt(x)}) asks: 10 raised to what power equals ${fmt(x)}?`,
        `The answer is ${fmt(v)}, because 10^${fmt(v)} ≈ ${fmt(Math.pow(10, v))}`,
      ],
    };
  }

  if (mode === 'ln') {
    const v = Math.log(x);
    return {
      lines: [
        { label: `ln(${fmt(x)}) =`, value: fmt(v), primary: true },
        { label: 'As a power of e', value: `e^${fmt(v)}` },
      ],
      steps: [
        `ln(${fmt(x)}) asks: e (≈ 2.71828) raised to what power equals ${fmt(x)}?`,
        `The answer is ${fmt(v)}, because e^${fmt(v)} ≈ ${fmt(Math.E ** v)}`,
      ],
    };
  }

  const b = r.num('base', 'the base', { positive: true });
  if (b === 1) throw new FieldError('base', 'The base cannot be 1, because 1 raised to any power is always 1');
  const lnx = Math.log(x);
  const lnb = Math.log(b);
  const v = lnx / lnb;
  return {
    lines: [{ label: `log base ${fmt(b)} of ${fmt(x)} =`, value: fmt(v), primary: true }],
    steps: [
      'Use the change-of-base formula: log_b(x) = ln(x) ÷ ln(b)',
      `ln(${fmt(x)}) = ${fmt(lnx)} and ln(${fmt(b)}) = ${fmt(lnb)}`,
      `Divide: ${fmt(lnx)} ÷ ${fmt(lnb)} = ${fmt(v)}`,
    ],
  };
});
