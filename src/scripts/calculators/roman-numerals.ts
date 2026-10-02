import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('roman-numerals-form') as HTMLFormElement;

// Greedy table: largest value first, including the subtractive pairs.
const ROMAN: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const VALUES: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

// Properly formed Roman numerals in the standard range 1–3999.
const PROPER = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

function toRoman(n: number): { roman: string; steps: string[] } {
  let rest = n;
  const parts: string[] = [];
  const steps: string[] = [];
  for (const [value, sym] of ROMAN) {
    const before = rest;
    let count = 0;
    while (rest >= value) {
      rest -= value;
      count++;
    }
    if (count > 0) {
      parts.push(sym.repeat(count));
      steps.push(
        `Take ${fmt(value)} (${sym}) out of ${fmt(before)} ${count === 1 ? 'once' : `${count} times`}: write ${sym.repeat(count)}, remainder ${fmt(rest)}`,
      );
    }
  }
  steps.push(`Reading the symbols left to right gives ${parts.join('')}`);
  return { roman: parts.join(''), steps };
}

function fromRoman(s: string): { value: number; steps: string[] } {
  const syms = s.split('');
  const steps: string[] = [`Replace each symbol with its value: ${syms.map((c) => `${c} = ${VALUES[c]}`).join(', ')}`];
  let total = 0;
  const parts: string[] = [];
  let i = 0;
  while (i < syms.length) {
    const cur = VALUES[syms[i]];
    const next = i + 1 < syms.length ? VALUES[syms[i + 1]] : 0;
    if (next > cur) {
      steps.push(`${syms[i]}${syms[i + 1]} is a subtractive pair: ${next} − ${cur} = ${next - cur}`);
      parts.push(`(${next} − ${cur})`);
      total += next - cur;
      i += 2;
    } else {
      parts.push(`${cur}`);
      total += cur;
      i++;
    }
  }
  steps.push(`Add everything: ${parts.join(' + ')} = ${fmt(total)}`);
  return { value: total, steps };
}

mountForm(form, (r) => {
  const mode = r.value('mode');
  if (mode === 'to-roman') {
    const n = r.num('n', 'a number', { min: 1, max: 3999, integer: true });
    const { roman, steps } = toRoman(n);
    return {
      lines: [{ label: `${fmt(n)} in Roman numerals =`, value: roman, primary: true }],
      steps,
    };
  }
  const raw = r.text('roman', 'a Roman numeral').toUpperCase().replace(/\s+/g, '');
  if (!raw) throw new FieldError('roman', 'Type a Roman numeral using the letters I, V, X, L, C, D and M');
  if (!/^[IVXLCDM]+$/.test(raw)) {
    throw new FieldError('roman', 'Only the letters I, V, X, L, C, D and M are allowed');
  }
  if (!PROPER.test(raw)) {
    throw new FieldError('roman', `"${raw}" is not a properly formed Roman numeral — write 4 as IV, not IIII`);
  }
  const { value, steps } = fromRoman(raw);
  return {
    lines: [{ label: `${raw} as a number =`, value: fmt(value), primary: true }],
    steps,
  };
});
