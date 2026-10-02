import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('triangle-form') as HTMLFormElement;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
// Clamp before acos: floating point can push a valid cosine just outside [-1, 1].
const clamp = (x: number) => Math.min(1, Math.max(-1, x));

mountForm(form, (r) => {
  const mode = r.value('mode');
  let a: number, b: number, c: number;
  let A: number, B: number, C: number;
  const steps: string[] = [];

  if (mode === 'sss') {
    a = r.num('a', 'side a', { positive: true });
    b = r.num('b', 'side b', { positive: true });
    c = r.num('c', 'side c', { positive: true });
    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new FieldError(
        'c',
        `Those sides cannot make a triangle: ${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}, which is not longer than ${fmt(c)}. The sum of any two sides must be longer than the third side.`
      );
    }
    steps.push(
      `Check the triangle inequality: ${fmt(a)} + ${fmt(b)} = ${fmt(a + b)} > ${fmt(c)}, ${fmt(a)} + ${fmt(c)} = ${fmt(a + c)} > ${fmt(b)}, ${fmt(b)} + ${fmt(c)} = ${fmt(b + c)} > ${fmt(a)} — a triangle exists.`
    );
    // Law of cosines for each angle: cos A = (b² + c² − a²) / 2bc
    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    const cosB = (a * a + c * c - b * b) / (2 * a * c);
    A = deg(Math.acos(clamp(cosA)));
    B = deg(Math.acos(clamp(cosB)));
    C = 180 - A - B;
    steps.push(
      `Angle A (opposite side a), law of cosines: cos A = (b² + c² − a²) ÷ 2bc = ${fmt(cosA)} → A = ${fmt(A)}°`
    );
    steps.push(
      `Angle B (opposite side b), law of cosines: cos B = (a² + c² − b²) ÷ 2ac = ${fmt(cosB)} → B = ${fmt(B)}°`
    );
    steps.push(`Angle C = 180° − A − B = 180 − ${fmt(A)} − ${fmt(B)} = ${fmt(C)}°`);
  } else if (mode === 'sas') {
    a = r.num('sa', 'side a', { positive: true });
    b = r.num('sb', 'side b', { positive: true });
    C = r.num('angC', 'angle C');
    if (C <= 0 || C >= 180) throw new FieldError('angC', 'Angle C must be between 0 and 180 degrees');
    // Law of cosines: c² = a² + b² − 2ab·cos C
    const c2 = a * a + b * b - 2 * a * b * Math.cos(rad(C));
    if (c2 <= 0) throw new FieldError('angC', 'Those values collapse the triangle — the third side would be 0 or negative');
    c = Math.sqrt(c2);
    steps.push(
      `Side c, law of cosines: c² = a² + b² − 2ab·cos C = ${fmt(a * a)} + ${fmt(b * b)} − 2·${fmt(a)}·${fmt(b)}·cos(${fmt(C)}°) = ${fmt(c2)} → c = ${fmt(c)}`
    );
    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    A = deg(Math.acos(clamp(cosA)));
    B = 180 - A - C;
    steps.push(`Angle A, law of cosines: cos A = (b² + c² − a²) ÷ 2bc = ${fmt(cosA)} → A = ${fmt(A)}°`);
    steps.push(`Angle B = 180° − A − C = 180 − ${fmt(A)} − ${fmt(C)} = ${fmt(B)}°`);
  } else {
    A = r.num('angA', 'angle A');
    B = r.num('angB', 'angle B');
    c = r.num('sc', 'side c', { positive: true });
    if (A <= 0 || A >= 180) throw new FieldError('angA', 'Angle A must be between 0 and 180 degrees');
    if (B <= 0 || B >= 180) throw new FieldError('angB', 'Angle B must be between 0 and 180 degrees');
    C = 180 - A - B;
    if (C <= 0) throw new FieldError('angB', `Angles A and B already add up to ${fmt(A + B)}° — the third angle would not be positive`);
    // Law of sines: a / sin A = c / sin C
    const k = c / Math.sin(rad(C));
    a = k * Math.sin(rad(A));
    b = k * Math.sin(rad(B));
    steps.push(`Angle C = 180° − A − B = 180 − ${fmt(A)} − ${fmt(B)} = ${fmt(C)}°`);
    steps.push(
      `Law of sines: a ÷ sin A = c ÷ sin C, so a = c·sin A ÷ sin C = ${fmt(c)}·sin(${fmt(A)}°) ÷ sin(${fmt(C)}°) = ${fmt(a)}`
    );
    steps.push(
      `b = c·sin B ÷ sin C = ${fmt(c)}·sin(${fmt(B)}°) ÷ sin(${fmt(C)}°) = ${fmt(b)}`
    );
  }

  const perimeter = a + b + c;
  const s = perimeter / 2;
  const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
  steps.push(
    `Perimeter = a + b + c = ${fmt(a)} + ${fmt(b)} + ${fmt(c)} = ${fmt(perimeter)}; semiperimeter s = ${fmt(s)}`
  );
  steps.push(
    `Area by Heron's formula: √(s(s−a)(s−b)(s−c)) = √(${fmt(s)}·${fmt(s - a)}·${fmt(s - b)}·${fmt(s - c)}) = ${fmt(area)}`
  );

  return {
    lines: [
      { label: 'Side a', value: fmt(a) },
      { label: 'Side b', value: fmt(b) },
      { label: 'Side c', value: fmt(c) },
      { label: 'Angle A', value: `${fmt(A)}°` },
      { label: 'Angle B', value: `${fmt(B)}°` },
      { label: 'Angle C', value: `${fmt(C)}°` },
      { label: 'Perimeter', value: fmt(perimeter) },
      { label: 'Area', value: fmt(area), primary: true },
    ],
    steps,
  };
});
