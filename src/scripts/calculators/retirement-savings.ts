import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('retirement-savings-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const currentAge = r.num('currentAge', 'your current age', { min: 0, max: 120, integer: true });
  const retireAge = r.num('retireAge', 'your retirement age', { min: 1, max: 120, integer: true });
  if (retireAge <= currentAge) {
    throw new FieldError('retireAge', 'Retirement age must be greater than your current age');
  }
  const savings = r.num('savings', 'your current savings', { min: 0 });
  const monthly = r.num('monthly', 'your monthly contribution', { min: 0 });
  const annualRate = r.num('annualRate', 'the annual return', { min: 0, max: 100 });

  const years = retireAge - currentAge;
  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;
  // FV of the lump sum plus FV of the monthly contributions (ordinary annuity).
  // With a 0% return the answer is just what you put in.
  const growth = Math.pow(1 + monthlyRate, n);
  const fvSavings = savings * growth;
  const fvContrib = monthlyRate === 0 ? monthly * n : monthly * ((growth - 1) / monthlyRate);
  const total = fvSavings + fvContrib;
  const contributed = savings + monthly * n;
  const investmentGrowth = total - contributed;

  return {
    lines: [
      { label: `Projected nest egg at ${fmt(retireAge)}`, value: money(total), primary: true },
      { label: 'Total you will have contributed', value: money(contributed) },
      { label: 'Growth from investment returns', value: money(investmentGrowth) },
    ],
    steps: [
      `Years of saving: ${fmt(retireAge)} − ${fmt(currentAge)} = ${fmt(years)} years, or ${fmt(n)} monthly contributions.`,
      `Monthly return rate: ${fmt(annualRate)}% ÷ 100 ÷ 12 = ${fmt(monthlyRate)}.`,
      monthlyRate === 0
        ? `With a 0% return there is no growth: ${money(savings)} + ${money(monthly)} × ${fmt(n)} = ${money(total)}.`
        : `Your current ${money(savings)} grows to ${money(savings)} × (1 + ${fmt(monthlyRate)})^${fmt(n)} = ${money(fvSavings)}.`,
      monthlyRate === 0
        ? ''
        : `Your ${money(monthly)} monthly contributions grow to ${money(monthly)} × (((1 + ${fmt(monthlyRate)})^${fmt(n)} − 1) ÷ ${fmt(monthlyRate)}) = ${money(fvContrib)}.`,
      `Projected total: ${money(fvSavings)} + ${money(fvContrib)} = ${money(total)}.`,
      `Of that, ${money(contributed)} is money you put in and ${money(investmentGrowth)} is investment growth.`,
    ].filter((s) => s !== ''),
  };
});
