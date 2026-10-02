import { mountForm, fmt } from '../calc-form.ts';

const form = document.getElementById('mortgage-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const principal = r.num('loan', 'the loan amount', { min: 0 });
  const annualRate = r.num('annualRate', 'the annual interest rate', { min: 0, max: 100 });
  const years = r.num('years', 'the loan term in years', { min: 1, integer: true });

  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;
  // M = P*r / (1 - (1+r)^-n); with a 0% rate the payment is just P/n.
  const payment = monthlyRate === 0 ? principal / n : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  const totalPaid = payment * n;
  const totalInterest = totalPaid - principal;

  return {
    lines: [
      { label: 'Monthly payment', value: money(payment), primary: true },
      { label: `Total paid over ${fmt(years)} years`, value: money(totalPaid) },
      { label: 'Total interest', value: money(totalInterest) },
    ],
    steps: [
      `Convert the annual rate to a monthly rate: ${fmt(annualRate)}% ÷ 100 ÷ 12 = ${fmt(monthlyRate)}`,
      `Number of monthly payments: ${fmt(years)} × 12 = ${fmt(n)}`,
      monthlyRate === 0
        ? `With a 0% rate the payment is simply principal ÷ payments: ${money(principal)} ÷ ${fmt(n)} = ${money(payment)}`
        : `Monthly payment = ${money(principal)} × ${fmt(monthlyRate)} ÷ (1 − (1 + ${fmt(monthlyRate)})^−${fmt(n)}) = ${money(payment)}`,
      `Total paid: ${money(payment)} × ${fmt(n)} = ${money(totalPaid)}`,
      `Total interest: ${money(totalPaid)} − ${money(principal)} = ${money(totalInterest)}`,
    ],
  };
});
