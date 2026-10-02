import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('savings-goal-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const goal = r.num('goal', 'your savings goal', { min: 0 });
  const savings = r.num('savings', 'your current savings', { min: 0 });
  const annualRate = r.num('annualRate', 'the annual return', { min: 0, max: 100 });
  const years = r.num('years', 'the years to save', { min: 0.1 });

  const monthlyRate = annualRate / 100 / 12;
  const n = Math.round(years * 12);
  const growth = Math.pow(1 + monthlyRate, n);
  const fvSavings = savings * growth;
  if (fvSavings >= goal) {
    throw new FieldError('goal', 'Your current savings will already reach the goal with investment growth — no monthly deposit needed');
  }
  // Solve FV = P(1+r)^n + PMT*(((1+r)^n − 1)/r) for PMT.
  const monthly =
    monthlyRate === 0 ? (goal - savings) / n : (goal - fvSavings) / ((growth - 1) / monthlyRate);
  const totalDeposited = monthly * n;
  const growthCovers = goal - savings - totalDeposited;

  return {
    lines: [
      { label: 'Monthly deposit needed', value: money(monthly), primary: true },
      { label: `Total you will deposit over ${fmt(n)} months`, value: money(totalDeposited) },
      { label: 'Investment growth covers the rest', value: money(growthCovers) },
    ],
    steps: [
      `Monthly return rate: ${fmt(annualRate)}% ÷ 100 ÷ 12 = ${fmt(monthlyRate)}, over ${fmt(n)} months.`,
      `Your current ${money(savings)} grows on its own to ${money(savings)} × (1 + ${fmt(monthlyRate)})^${fmt(n)} = ${money(fvSavings)}.`,
      monthlyRate === 0
        ? `With a 0% return the monthly deposit is simply the shortfall ÷ months: (${money(goal)} − ${money(savings)}) ÷ ${fmt(n)} = ${money(monthly)}.`
        : `Still needed from monthly deposits: ${money(goal)} − ${money(fvSavings)} = ${money(goal - fvSavings)}. Each dollar deposited monthly grows by a factor of (((1 + ${fmt(monthlyRate)})^${fmt(n)} − 1) ÷ ${fmt(monthlyRate)}) = ${fmt((growth - 1) / monthlyRate)}, so the monthly deposit is ${money(goal - fvSavings)} ÷ ${fmt((growth - 1) / monthlyRate)} = ${money(monthly)}.`,
      `Total deposited: ${money(monthly)} × ${fmt(n)} = ${money(totalDeposited)}.`,
      `Investment growth covers the rest: ${money(goal)} − ${money(savings)} − ${money(totalDeposited)} = ${money(growthCovers)}.`,
    ],
  };
});
