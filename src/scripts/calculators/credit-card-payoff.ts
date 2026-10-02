import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('credit-card-payoff-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const balance = r.num('balance', 'the card balance', { min: 0 });
  const apr = r.num('apr', 'the APR', { min: 0, max: 100 });
  const payment = r.num('payment', 'the monthly payment', { min: 0 });

  const monthlyRate = apr / 100 / 12;
  if (payment <= monthlyRate * balance) {
    throw new FieldError(
      'payment',
      `Your payment must be more than the monthly interest (${money(monthlyRate * balance)}), or the balance never shrinks`,
    );
  }

  // n = −ln(1 − r·B/PMT) / ln(1 + r); with a 0% APR it is just B/PMT.
  const exactMonths = monthlyRate === 0 ? balance / payment : -Math.log(1 - (monthlyRate * balance) / payment) / Math.log(1 + monthlyRate);
  const months = Math.ceil(exactMonths);

  // Simulate month by month for exact totals (the last payment is smaller).
  let remaining = balance;
  let totalPaid = 0;
  for (let i = 0; i < months && remaining > 0; i++) {
    const interest = remaining * monthlyRate;
    const pay = Math.min(payment, remaining + interest);
    remaining = remaining + interest - pay;
    totalPaid += pay;
  }
  const totalInterest = totalPaid - balance;

  return {
    lines: [
      { label: 'Months to debt-free', value: `${fmt(months)} months`, primary: true },
      { label: 'Total you will pay', value: money(totalPaid) },
      { label: 'Total interest', value: money(totalInterest) },
    ],
    steps: [
      `Monthly interest rate: ${fmt(apr)}% ÷ 100 ÷ 12 = ${fmt(monthlyRate)}.`,
      `Monthly interest on the balance: ${money(balance)} × ${fmt(monthlyRate)} = ${money(monthlyRate * balance)}. Your ${money(payment)} payment covers this and reduces the balance by ${money(payment - monthlyRate * balance)}.`,
      monthlyRate === 0
        ? `With a 0% APR the payoff time is simply balance ÷ payment: ${money(balance)} ÷ ${money(payment)} = ${fmt(exactMonths)} months.`
        : `Payoff time: −ln(1 − (${fmt(monthlyRate)} × ${money(balance)} ÷ ${money(payment)})) ÷ ln(1 + ${fmt(monthlyRate)}) = ${fmt(exactMonths)} months, rounded up to ${fmt(months)} payments.`,
      `Total paid over ${fmt(months)} payments: ${money(totalPaid)}.`,
      `Total interest: ${money(totalPaid)} − ${money(balance)} = ${money(totalInterest)}.`,
    ],
  };
});
