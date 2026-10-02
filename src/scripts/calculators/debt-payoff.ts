import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('debt-payoff-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const balance = r.num('balance', 'the debt balance', { min: 0, nonZero: true });
  const apr = r.num('apr', 'the annual interest rate', { min: 0, max: 100 });
  const payment = r.num('payment', 'the monthly payment', { min: 0, nonZero: true });

  const monthlyRate = apr / 100 / 12;

  if (monthlyRate > 0 && payment <= balance * monthlyRate) {
    throw new FieldError(
      'payment',
      `Your payment must be more than the monthly interest charge of ${money(balance * monthlyRate)}, or the balance will never go down`,
    );
  }

  // n = -ln(1 - r*B/PMT) / ln(1+r); with 0% interest it is just balance/payment.
  const rawMonths = monthlyRate === 0 ? balance / payment : -Math.log(1 - (monthlyRate * balance) / payment) / Math.log(1 + monthlyRate);
  const months = Math.ceil(rawMonths);

  // Simulate the amortization month by month so totals are exact.
  let remaining = balance;
  let totalPaid = 0;
  let paid = 0;
  while (remaining > 0 && paid < 1200) {
    const interest = remaining * monthlyRate;
    const thisPayment = Math.min(payment, remaining + interest);
    remaining = remaining + interest - thisPayment;
    totalPaid += thisPayment;
    paid += 1;
  }
  const totalInterest = totalPaid - balance;

  const yearsText = months >= 24 ? ` (about ${(months / 12).toFixed(1)} years)` : '';

  return {
    lines: [
      { label: 'Time to pay off', value: `${fmt(months)} months${yearsText}`, primary: true },
      { label: 'Total paid', value: money(totalPaid) },
      { label: 'Total interest', value: money(totalInterest) },
    ],
    steps:
      monthlyRate === 0
        ? [
            `With 0% interest, every payment cuts the balance directly: ${money(balance)} ÷ ${money(payment)} = ${fmt(rawMonths)} months`,
            `Rounded up to whole months: ${fmt(months)} months${yearsText}`,
          ]
        : [
            `Monthly interest rate: ${fmt(apr)}% ÷ 100 ÷ 12 = ${fmt(monthlyRate)}`,
            `First month's interest: ${money(balance)} × ${fmt(monthlyRate)} = ${money(balance * monthlyRate)}`,
            `Months to pay off = −ln(1 − ${fmt(monthlyRate)} × ${money(balance)} ÷ ${money(payment)}) ÷ ln(1 + ${fmt(monthlyRate)}) ≈ ${fmt(rawMonths)}`,
            `Rounded up to whole months: ${fmt(months)} months${yearsText}`,
            `Total paid ≈ ${money(totalPaid)}, so total interest ≈ ${money(totalPaid)} − ${money(balance)} = ${money(totalInterest)}`,
          ],
  };
});
