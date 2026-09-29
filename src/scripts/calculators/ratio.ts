import { mountForm, FieldError, fmt } from '../calc-form.ts';
import { gcd } from '../../lib/math/number.ts';

function parseRatio(text: string): number[] {
  const parts = text.split(/\s*[:∶]\s*|\s+to\s+/i).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2 || parts.length > 3) throw new FieldError('ratio', 'Write the ratio with 2 or 3 parts, like 12 : 18');
  return parts.map((p) => {
    const v = Number(p);
    if (!Number.isFinite(v)) throw new FieldError('ratio', `"${p}" is not a number`);
    if (v <= 0) throw new FieldError('ratio', 'Each part of the ratio must be greater than 0');
    return v;
  });
}

// Scale decimals up to whole numbers, then divide by the GCD.
function simplify(parts: number[]) {
  const places = Math.max(...parts.map((p) => (String(p).split('.')[1] ?? '').length));
  const scale = 10 ** Math.min(places, 9);
  const ints = parts.map((p) => Math.round(p * scale));
  const g = ints.reduce((a, b) => gcd(a, b));
  return { scale, ints, g, simple: ints.map((n) => n / g) };
}

const form = document.getElementById('ratio-form') as HTMLFormElement;
mountForm(form, (r) => {
  const mode = r.value('mode');
  if (mode === 'simplify') {
    const parts = parseRatio(r.text('ratio', 'a ratio'));
    const { scale, ints, g, simple } = simplify(parts);
    const steps: string[] = [];
    if (scale > 1) steps.push(`Multiply every part by ${scale} to clear the decimals: ${ints.join(' : ')}`);
    steps.push(g > 1 ? `Divide every part by their GCD, ${g}: ${simple.join(' : ')}` : `The parts share no common factor, so it is already as simple as it gets.`);
    return {
      lines: [
        { label: 'Simplest form', value: simple.join(' : '), primary: true },
        ...(simple.length === 2 ? [{ label: 'As a fraction', value: `${simple[0]}/${simple[1]}` }] : []),
      ],
      steps,
    };
  }
  if (mode === 'solve') {
    const a = r.num('a', 'a', { nonZero: true });
    const b = r.num('b', 'b');
    const c = r.num('c', 'c');
    const x = (b * c) / a;
    return {
      lines: [{ label: 'x =', value: fmt(x), primary: true }, { label: 'Proportion', value: `${fmt(a)} : ${fmt(b)} = ${fmt(c)} : ${fmt(x)}` }],
      steps: [`Cross-multiply: ${fmt(a)} × x = ${fmt(b)} × ${fmt(c)} = ${fmt(b * c)}`, `Divide by ${fmt(a)}: x = ${fmt(b * c)} ÷ ${fmt(a)} = ${fmt(x)}`],
    };
  }
  const amount = r.num('amount', 'an amount');
  const parts = parseRatio(r.text('ratio', 'a ratio'));
  const total = parts.reduce((s, p) => s + p, 0);
  const shares = parts.map((p) => (amount * p) / total);
  return {
    lines: [
      { label: 'Shares', value: shares.map((v) => fmt(v)).join(' : '), primary: true },
      ...shares.map((s, i) => ({ label: `Part ${i + 1} (${fmt(parts[i])} of ${fmt(total)})`, value: fmt(s) })),
    ],
    steps: [
      `Add the parts of the ratio: ${parts.map((v) => fmt(v)).join(' + ')} = ${fmt(total)}`,
      `One part is worth ${fmt(amount)} ÷ ${fmt(total)} = ${fmt(amount / total)}`,
      `Multiply by each part: ${parts.map((p, i) => `${fmt(p)} × ${fmt(amount / total)} = ${fmt(shares[i])}`).join(', ')}`,
    ],
  };
});
