import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('salary-converter-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const mode = r.value('mode');
  const hoursPerWeek = r.num('hours', 'hours per week', { min: 0, max: 168 });
  if (hoursPerWeek === 0) {
    throw new FieldError('hours', 'Hours per week must be more than 0 to convert a wage');
  }

  if (mode === 'to-annual') {
    const hourly = r.num('hourly', 'the hourly wage', { min: 0 });
    const weekly = hourly * hoursPerWeek;
    const annual = weekly * 52;
    const monthly = annual / 12;
    return {
      lines: [
        { label: 'Annual salary', value: money(annual), primary: true },
        { label: 'Weekly pay', value: money(weekly) },
        { label: 'Monthly pay (average)', value: money(monthly) },
      ],
      steps: [
        `Weekly pay: ${money(hourly)} × ${fmt(hoursPerWeek)} hours = ${money(weekly)}`,
        `Annual salary: ${money(weekly)} × 52 weeks = ${money(annual)}`,
        `Average monthly pay: ${money(annual)} ÷ 12 = ${money(monthly)}`,
      ],
    };
  }

  const annual = r.num('annual', 'the annual salary', { min: 0 });
  const weekly = annual / 52;
  const hourly = weekly / hoursPerWeek;
  const monthly = annual / 12;
  return {
    lines: [
      { label: 'Hourly wage', value: money(hourly), primary: true },
      { label: 'Weekly pay', value: money(weekly) },
      { label: 'Monthly pay (average)', value: money(monthly) },
    ],
    steps: [
      `Weekly pay: ${money(annual)} ÷ 52 weeks = ${money(weekly)}`,
      `Hourly wage: ${money(weekly)} ÷ ${fmt(hoursPerWeek)} hours = ${money(hourly)}`,
      `Average monthly pay: ${money(annual)} ÷ 12 = ${money(monthly)}`,
    ],
  };
});
