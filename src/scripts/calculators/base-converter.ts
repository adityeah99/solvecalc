import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('base-converter-form') as HTMLFormElement;
const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

mountForm(form, (r) => {
  const raw = r.text('number', 'a number').toUpperCase().replace(/[\s_]/g, '');
  const fromBase = r.num('fromBase', 'the from base', { min: 2, max: 36, integer: true });
  const toBase = r.num('toBase', 'the to base', { min: 2, max: 36, integer: true });

  if (!raw) throw new FieldError('number', 'Type the number you want to convert');
  for (const ch of raw) {
    const d = DIGITS.indexOf(ch);
    if (d < 0 || d >= fromBase) {
      throw new FieldError('number', `"${ch}" is not a valid digit in base ${fmt(fromBase)}`);
    }
  }

  // Step 1: convert to decimal via place values.
  let decimal = 0;
  const terms: string[] = [];
  for (let i = 0; i < raw.length; i++) {
    const d = DIGITS.indexOf(raw[i]);
    const power = raw.length - 1 - i;
    terms.push(power === 0 ? `${d}` : `${d} × ${fmt(fromBase)}^${power}`);
    decimal += d * Math.pow(fromBase, power);
  }
  if (!Number.isSafeInteger(decimal)) {
    throw new FieldError('number', 'That number is too large to convert exactly — try a shorter one');
  }

  const steps: string[] = [
    `Expand by place value in base ${fmt(fromBase)}: ${raw} = ${terms.join(' + ')}`,
    `Add the place values: ${fmt(decimal)} in base 10`,
  ];

  // Step 2: convert from decimal to the target base by repeated division.
  let result: string;
  if (fromBase === toBase) {
    result = raw;
    steps.push('Both bases are the same, so the digits do not change.');
  } else {
    const rems: string[] = [];
    let q = decimal;
    if (q === 0) {
      rems.push('0');
      steps.push('0 is 0 in every base.');
    }
    while (q > 0) {
      const nq = Math.floor(q / toBase);
      const rem = q - nq * toBase;
      steps.push(`${fmt(q)} ÷ ${fmt(toBase)} = ${fmt(nq)}, remainder ${DIGITS[rem]}`);
      rems.push(DIGITS[rem]);
      q = nq;
    }
    result = rems.reverse().join('');
    steps.push(`Read the remainders from bottom to top: ${result}`);
  }

  return {
    lines: [
      { label: `${raw} (base ${fmt(fromBase)}) =`, value: `${result} (base ${fmt(toBase)})`, primary: true },
      { label: 'As a decimal', value: fmt(decimal) },
    ],
    steps,
  };
});
