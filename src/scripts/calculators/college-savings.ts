import { mountForm, fmt } from '../calc-form.ts';

const form = document.getElementById('college-savings-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const current = r.num('current', 'your current savings', { min: 0 });
  const monthly = r.num('monthly', 'your monthly contribution', { min: 0 });
  const annualRate = r.num('annualRate', 'the expected annual return', { min: 0, max: 100 });
  const years = r.num('years', 'the years until college', { min: 1, integer: true });

  const i = annualRate / 100 / 12;
  const n = years * 12;
  // FV = P(1+i)^n + PMT * (((1+i)^n − 1) / i); with a 0% return it is just P + PMT*n.
  const growth = Math.pow(1 + i, n);
  const futureValue = i === 0 ? current + monthly * n : current * growth + (monthly * (growth - 1)) / i;
  const contributions = current + monthly * n;
  const growthAmount = futureValue - contributions;

  return {
    lines: [
      { label: `Projected savings in ${fmt(years)} years`, value: money(futureValue), primary: true },
      { label: 'Total contributions', value: money(contributions) },
      { label: 'Growth from returns', value: money(growthAmount) },
    ],
    steps: [
      `Monthly rate: ${fmt(annualRate)}% ÷ 100 ÷ 12 = ${fmt(i)}, over ${fmt(years)} × 12 = ${fmt(n)} months`,
      i === 0
        ? `With a 0% return there is no growth: ${money(current)} + ${money(monthly)} × ${fmt(n)} = ${money(futureValue)}`
        : `Growth factor: (1 + ${fmt(i)})^${fmt(n)} = ${fmt(growth)}`,
      ...(i === 0
        ? []
        : [
            `Current savings grow to: ${money(current)} × ${fmt(growth)} = ${money(current * growth)}`,
            `Monthly contributions grow to: ${money(monthly)} × (${fmt(growth)} − 1) ÷ ${fmt(i)} = ${money((monthly * (growth - 1)) / i)}`,
          ]),
      `Projected total: ${money(current * growth)} + ${money(i === 0 ? monthly * n : (monthly * (growth - 1)) / i)} = ${money(futureValue)}`,
      `Growth from returns: ${money(futureValue)} − ${money(contributions)} = ${money(growthAmount)}`,
    ],
  };
});
