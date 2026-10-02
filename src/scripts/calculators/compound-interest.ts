import { mountForm, fmt } from '../calc-form.ts';

const form = document.getElementById('ci-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

const FREQ_LABEL: Record<string, string> = { 1: 'yearly', 4: 'quarterly', 12: 'monthly', 365: 'daily' };

mountForm(form, (r) => {
  const principal = r.num('principal', 'the starting amount', { min: 0 });
  const annualRate = r.num('annualRate', 'the annual interest rate', { min: 0, max: 100 });
  const years = r.num('years', 'the number of years', { min: 0 });
  const n = Number(r.value('freq'));

  const rate = annualRate / 100;
  // A = P(1 + r/n)^(n*t)
  const amount = principal * Math.pow(1 + rate / n, n * years);
  const interest = amount - principal;
  // Effective annual rate: (1 + r/n)^n − 1
  const ear = (Math.pow(1 + rate / n, n) - 1) * 100;

  return {
    lines: [
      { label: 'Final amount', value: money(amount), primary: true },
      { label: 'Interest earned', value: money(interest) },
      { label: 'Effective annual rate', value: `${fmt(Math.round(ear * 100) / 100)}%` },
    ],
    steps: [
      `Rate as a decimal: ${fmt(annualRate)}% ÷ 100 = ${fmt(rate)}`,
      `Compounding ${FREQ_LABEL[String(n)]}, so each period's rate is ${fmt(rate)} ÷ ${fmt(n)} = ${fmt(rate / n)}`,
      `Number of periods: ${fmt(n)} × ${fmt(years)} = ${fmt(n * years)}`,
      `Final amount = ${money(principal)} × (1 + ${fmt(rate / n)})^${fmt(n * years)} = ${money(amount)}`,
      `Interest earned = ${money(amount)} − ${money(principal)} = ${money(interest)}`,
    ],
  };
});
