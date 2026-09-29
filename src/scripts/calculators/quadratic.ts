import { mountForm, FieldError, fmt } from '../calc-form.ts';
import { solveQuadratic } from '../../lib/math/quadratic.ts';

const form = document.getElementById('quad-form') as HTMLFormElement;
mountForm(form, (r) => {
  const a = r.num('a', 'a');
  const b = r.num('b', 'b');
  const c = r.num('c', 'c');
  if (a === 0) throw new FieldError('a', 'a cannot be 0. With no x² term this is a linear equation; try the equation solver.');
  const q = solveQuadratic(a, b, c);
  const lines = [];
  if (q.kind === 'two-real') lines.push({ label: 'Roots', value: `x = ${q.roots[0]}  or  x = ${q.roots[1]}`, primary: true });
  else if (q.kind === 'one-real') lines.push({ label: 'Root (repeated)', value: `x = ${q.roots[0]}`, primary: true });
  else lines.push({ label: 'Complex roots', value: `x = ${q.roots[0]}  or  x = ${q.roots[1]}`, primary: true });
  lines.push({ label: 'Discriminant b² − 4ac', value: fmt(q.discriminant) });
  if (q.factored) lines.push({ label: 'Factored form', value: `${q.factored} = 0` });
  lines.push({ label: 'Vertex', value: `(${fmt(q.vertex.x)}, ${fmt(q.vertex.y)})` });
  lines.push({ label: 'Axis of symmetry', value: `x = ${fmt(q.vertex.x)}` });
  lines.push({ label: 'Graph opens', value: a > 0 ? 'Upward (∪)' : 'Downward (∩)' });
  return { lines, steps: q.steps };
});
