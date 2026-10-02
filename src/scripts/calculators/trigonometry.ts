import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('trig-form') as HTMLFormElement;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

mountForm(form, (r) => {
  const mode = r.value('mode');

  if (mode === 'sides') {
    const angle = r.num('angle', 'the angle');
    if (angle <= 0 || angle >= 90)
      throw new FieldError('angle', 'Use an acute angle: strictly between 0 and 90 degrees');
    const known = r.value('known');
    const side = r.num('side', 'the known side', { positive: true });
    const t = rad(angle);
    const sin = Math.sin(t);
    const cos = Math.cos(t);
    const other = 90 - angle;
    let opp: number, adj: number, hyp: number;
    const steps: string[] = [];
    if (known === 'opposite') {
      opp = side;
      hyp = opp / sin;
      adj = opp / Math.tan(t);
      steps.push(`Sine: sin(${fmt(angle)}°) = opposite ÷ hypotenuse, so hypotenuse = ${fmt(opp)} ÷ sin(${fmt(angle)}°) = ${fmt(hyp)}`);
      steps.push(`Tangent: tan(${fmt(angle)}°) = opposite ÷ adjacent, so adjacent = ${fmt(opp)} ÷ tan(${fmt(angle)}°) = ${fmt(adj)}`);
    } else if (known === 'adjacent') {
      adj = side;
      hyp = adj / cos;
      opp = adj * Math.tan(t);
      steps.push(`Cosine: cos(${fmt(angle)}°) = adjacent ÷ hypotenuse, so hypotenuse = ${fmt(adj)} ÷ cos(${fmt(angle)}°) = ${fmt(hyp)}`);
      steps.push(`Tangent: tan(${fmt(angle)}°) = opposite ÷ adjacent, so opposite = ${fmt(adj)} × tan(${fmt(angle)}°) = ${fmt(opp)}`);
    } else {
      hyp = side;
      opp = hyp * sin;
      adj = hyp * cos;
      steps.push(`Sine: sin(${fmt(angle)}°) = opposite ÷ hypotenuse, so opposite = ${fmt(hyp)} × sin(${fmt(angle)}°) = ${fmt(opp)}`);
      steps.push(`Cosine: cos(${fmt(angle)}°) = adjacent ÷ hypotenuse, so adjacent = ${fmt(hyp)} × cos(${fmt(angle)}°) = ${fmt(adj)}`);
    }
    steps.push(`The other acute angle is 90° − ${fmt(angle)}° = ${fmt(other)}°`);
    return {
      lines: [
        { label: 'Opposite side', value: fmt(opp) },
        { label: 'Adjacent side', value: fmt(adj) },
        { label: 'Hypotenuse', value: fmt(hyp), primary: true },
        { label: 'Other angle', value: `${fmt(other)}°` },
      ],
      steps,
    };
  }

  const x = r.num('x', 'the first side', { positive: true });
  const y = r.num('y', 'the second side', { positive: true });
  const pair = r.value('pair');
  let angle: number;
  const steps: string[] = [];
  if (pair === 'oa') {
    angle = deg(Math.atan(x / y));
    steps.push(`Tangent: tan(angle) = opposite ÷ adjacent = ${fmt(x)} ÷ ${fmt(y)} = ${fmt(x / y)}`);
    steps.push(`angle = arctan(${fmt(x / y)}) = ${fmt(angle)}°`);
  } else if (pair === 'oh') {
    if (x > y) throw new FieldError('x', `The opposite side (${fmt(x)}) cannot be longer than the hypotenuse (${fmt(y)})`);
    angle = deg(Math.asin(x / y));
    steps.push(`Sine: sin(angle) = opposite ÷ hypotenuse = ${fmt(x)} ÷ ${fmt(y)} = ${fmt(x / y)}`);
    steps.push(`angle = arcsin(${fmt(x / y)}) = ${fmt(angle)}°`);
  } else {
    if (x > y) throw new FieldError('x', `The adjacent side (${fmt(x)}) cannot be longer than the hypotenuse (${fmt(y)})`);
    angle = deg(Math.acos(x / y));
    steps.push(`Cosine: cos(angle) = adjacent ÷ hypotenuse = ${fmt(x)} ÷ ${fmt(y)} = ${fmt(x / y)}`);
    steps.push(`angle = arccos(${fmt(x / y)}) = ${fmt(angle)}°`);
  }
  const other = 90 - angle;
  steps.push(`The other acute angle is 90° − ${fmt(angle)}° = ${fmt(other)}°`);
  return {
    lines: [
      { label: 'Angle', value: `${fmt(angle)}°`, primary: true },
      { label: 'Other angle', value: `${fmt(other)}°` },
    ],
    steps,
  };
});
