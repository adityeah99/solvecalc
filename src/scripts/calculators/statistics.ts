import { mountForm, FieldError, fmt } from '../calc-form.ts';
import { parseNumberList } from '../../lib/math/number.ts';
import { summarize } from '../../lib/math/stats.ts';
import { MathError } from '../../lib/math/expression.ts';

const form = document.getElementById('stats-form') as HTMLFormElement;
mountForm(form, (r) => {
  const text = r.text('data', 'some numbers');
  let values: number[];
  try {
    values = parseNumberList(text);
  } catch (e) {
    throw new FieldError('data', e instanceof MathError ? e.message : 'Some of those are not numbers');
  }
  const s = summarize(values);
  const list = (xs: number[]) => (xs.length > 20 ? `${xs.slice(0, 20).map((v) => fmt(v)).join(', ')}, …` : xs.map((v) => fmt(v)).join(', '));
  const mid = s.count % 2 ? `the middle value` : `the mean of the two middle values`;
  return {
    lines: [
      { label: 'Mean (average)', value: fmt(s.mean), primary: true },
      { label: 'Median', value: fmt(s.median) },
      { label: 'Mode', value: s.modes.length ? s.modes.map((v) => fmt(v)).join(', ') : 'No mode (no value repeats)' },
      { label: 'Range', value: fmt(s.range) },
      { label: 'Count', value: String(s.count) },
      { label: 'Sum', value: fmt(s.sum) },
      { label: 'Minimum / Maximum', value: `${fmt(s.min)} / ${fmt(s.max)}` },
      { label: 'Q1 / Q3', value: `${fmt(s.q1)} / ${fmt(s.q3)}` },
      { label: 'Interquartile range', value: fmt(s.iqr) },
      { label: 'Std deviation (population)', value: fmt(s.popStdDev) },
      { label: 'Std deviation (sample)', value: s.sampleStdDev === null ? 'Needs 2+ numbers' : fmt(s.sampleStdDev) },
      { label: 'Variance (population / sample)', value: `${fmt(s.popVariance)} / ${s.sampleVariance === null ? '–' : fmt(s.sampleVariance)}` },
    ],
    steps: [
      `Sort the numbers: ${list(s.sorted)}`,
      `Mean = sum ÷ count = ${fmt(s.sum)} ÷ ${s.count} = ${fmt(s.mean)}`,
      `There are ${s.count} numbers, so the median is ${mid}: ${fmt(s.median)}`,
      `Range = largest − smallest = ${fmt(s.max)} − ${fmt(s.min)} = ${fmt(s.range)}`,
    ],
  };
});
