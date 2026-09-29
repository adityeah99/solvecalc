import { mountForm, FieldError, fmt } from '../calc-form.ts';
import { parseNumberList } from '../../lib/math/number.ts';
import { weightedAverage } from '../../lib/math/stats.ts';
import { MathError } from '../../lib/math/expression.ts';

function list(r: { text(n: string, l: string): string }, name: string, label: string) {
  try {
    return parseNumberList(r.text(name, label));
  } catch (e) {
    if (e instanceof FieldError) throw e;
    throw new FieldError(name, e instanceof MathError ? e.message : 'Some of those are not numbers');
  }
}

const form = document.getElementById('avg-form') as HTMLFormElement;
mountForm(form, (r) => {
  const values = list(r, 'values', 'some numbers');
  if (r.value('mode') === 'simple') {
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    return {
      lines: [
        { label: 'Average', value: fmt(mean), primary: true },
        { label: 'Sum', value: fmt(sum) },
        { label: 'Count', value: String(values.length) },
      ],
      steps: [`Add them up: ${values.map((v) => fmt(v)).join(' + ')} = ${fmt(sum)}`, `Divide by how many there are: ${fmt(sum)} ÷ ${values.length} = ${fmt(mean)}`],
    };
  }
  const weights = list(r, 'weights', 'the weights');
  if (weights.length !== values.length)
    throw new FieldError('weights', `You gave ${values.length} numbers but ${weights.length} weights. They need to match.`);
  let w;
  try {
    w = weightedAverage(values.map((value, i) => ({ value, weight: weights[i] })));
  } catch (e) {
    throw new FieldError('weights', (e as Error).message);
  }
  return {
    lines: [
      { label: 'Weighted average', value: fmt(w.average), primary: true },
      { label: 'Σ(value × weight)', value: fmt(w.weightedSum) },
      { label: 'Σ weights', value: fmt(w.totalWeight) },
    ],
    steps: [
      `Multiply each number by its weight: ${values.map((v, i) => `${fmt(v)} × ${fmt(weights[i])}`).join(' + ')} = ${fmt(w.weightedSum)}`,
      `Add the weights: ${weights.map((v) => fmt(v)).join(' + ')} = ${fmt(w.totalWeight)}`,
      `Divide: ${fmt(w.weightedSum)} ÷ ${fmt(w.totalWeight)} = ${fmt(w.average)}`,
    ],
  };
});
