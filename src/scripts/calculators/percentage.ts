import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('pct-form') as HTMLFormElement;
mountForm(form, (r) => {
  const mode = r.value('mode');
  if (mode === 'of') {
    const p = r.num('p', 'a percent');
    const n = r.num('n', 'a number');
    const v = (p / 100) * n;
    return {
      lines: [
        { label: `${fmt(p)}% of ${fmt(n)} =`, value: fmt(v), primary: true },
        { label: `${fmt(p)}% as a decimal`, value: fmt(p / 100) },
      ],
      steps: [`Change the percent to a decimal: ${fmt(p)} ÷ 100 = ${fmt(p / 100)}`, `Multiply: ${fmt(p / 100)} × ${fmt(n)} = ${fmt(v)}`],
    };
  }
  if (mode === 'what') {
    const a = r.num('a', 'the part');
    const b = r.num('b', 'the whole');
    if (b === 0) throw new FieldError('b', 'B cannot be 0, because you cannot divide by 0');
    const v = (a / b) * 100;
    return {
      lines: [
        { label: `${fmt(a)} is this much of ${fmt(b)}`, value: `${fmt(v)}%`, primary: true },
        { label: 'As a decimal', value: fmt(a / b) },
      ],
      steps: [`Divide the part by the whole: ${fmt(a)} ÷ ${fmt(b)} = ${fmt(a / b)}`, `Multiply by 100 to get a percent: ${fmt(a / b)} × 100 = ${fmt(v)}%`],
    };
  }
  const oldV = r.num('old', 'the old value');
  const newV = r.num('new', 'the new value');
  if (oldV === 0) throw new FieldError('old', 'The old value cannot be 0, because the change is measured against it');
  const diff = newV - oldV;
  const pct = (diff / Math.abs(oldV)) * 100;
  const word = diff > 0 ? 'increase' : diff < 0 ? 'decrease' : 'change';
  return {
    lines: [
      { label: `Percentage ${word}`, value: `${fmt(Math.abs(pct))}%`, primary: true },
      { label: 'Difference', value: fmt(diff) },
      { label: 'New value as % of old', value: `${fmt((newV / oldV) * 100)}%` },
    ],
    steps: [
      `Find the difference: ${fmt(newV)} − ${fmt(oldV)} = ${fmt(diff)}`,
      `Divide by the old value: ${fmt(diff)} ÷ ${fmt(Math.abs(oldV))} = ${fmt(diff / Math.abs(oldV))}`,
      `Multiply by 100: ${fmt(pct)}%, so it is a ${fmt(Math.abs(pct))}% ${word}`,
    ],
  };
});
