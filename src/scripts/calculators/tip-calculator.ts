import { mountForm, fmt } from '../calc-form.ts';

const form = document.getElementById('tip-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const bill = r.num('bill', 'the bill amount', { min: 0 });
  const tipPct = r.num('tipPercent', 'the tip percent', { min: 0, max: 100 });
  const split = r.num('split', 'the number of people', { min: 1, integer: true });

  const tip = (bill * tipPct) / 100;
  const total = bill + tip;
  const perPerson = total / split;

  return {
    lines: [
      { label: 'Tip amount', value: money(tip) },
      { label: 'Total to pay', value: money(total), primary: true },
      ...(split > 1 ? [{ label: `Each of ${fmt(split)} pays`, value: money(perPerson) }] : []),
    ],
    steps: [
      `Find the tip: ${money(bill)} × ${fmt(tipPct)}% = ${money(bill)} × ${fmt(tipPct / 100)} = ${money(tip)}`,
      `Add it to the bill: ${money(bill)} + ${money(tip)} = ${money(total)}`,
      ...(split > 1
        ? [`Split it ${fmt(split)} ways: ${money(total)} ÷ ${fmt(split)} = ${money(perPerson)} each`]
        : []),
    ],
  };
});
