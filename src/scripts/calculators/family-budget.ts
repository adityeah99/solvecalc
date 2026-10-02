import { mountForm, fmt } from '../calc-form.ts';

const form = document.getElementById('family-budget-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const pay = r.num('pay', 'your monthly take-home pay', { min: 0 });

  const needs = pay * 0.5;
  const wants = pay * 0.3;
  const savings = pay * 0.2;

  return {
    lines: [
      { label: 'Needs (50%)', value: money(needs) },
      { label: 'Wants (30%)', value: money(wants) },
      { label: 'Savings (20%)', value: money(savings), primary: true },
    ],
    steps: [
      `Needs: 50% of ${money(pay)} = 0.50 × ${money(pay)} = ${money(needs)}`,
      `Wants: 30% of ${money(pay)} = 0.30 × ${money(pay)} = ${money(wants)}`,
      `Savings: 20% of ${money(pay)} = 0.20 × ${money(pay)} = ${money(savings)}`,
      `Check: ${money(needs)} + ${money(wants)} + ${money(savings)} = ${money(needs + wants + savings)}`,
    ],
  };
});
