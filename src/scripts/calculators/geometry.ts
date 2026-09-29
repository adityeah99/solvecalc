import { mountForm, FieldError, fmt, type Line } from '../calc-form.ts';

const PI = Math.PI;
const form = document.getElementById('geo-form') as HTMLFormElement;

mountForm(form, (r) => {
  const shape = r.value('shape');
  const u = r.value('unit');
  const len = (v: number) => `${fmt(v)}${u ? ` ${u}` : ''}`;
  const area = (v: number) => `${fmt(v)}${u ? ` ${u}²` : ' square units'}`;
  const vol = (v: number) => `${fmt(v)}${u ? ` ${u}³` : ' cubic units'}`;
  const pos = { positive: true };
  const lines: Line[] = [];
  const steps: string[] = [];

  switch (shape) {
    case 'circle': {
      const rr = r.num('r', 'the radius', pos);
      lines.push({ label: 'Area = πr²', value: area(PI * rr * rr), primary: true });
      lines.push({ label: 'Circumference = 2πr', value: len(2 * PI * rr) });
      lines.push({ label: 'Diameter = 2r', value: len(2 * rr) });
      steps.push(`Square the radius: ${fmt(rr)}² = ${fmt(rr * rr)}`, `Multiply by π: ${fmt(rr * rr)} × π ≈ ${fmt(PI * rr * rr)}`);
      break;
    }
    case 'rectangle': {
      const l = r.num('l', 'the length', pos);
      const w = r.num('w', 'the width', pos);
      lines.push({ label: 'Area = l × w', value: area(l * w), primary: true });
      lines.push({ label: 'Perimeter = 2(l + w)', value: len(2 * (l + w)) });
      lines.push({ label: 'Diagonal = √(l² + w²)', value: len(Math.hypot(l, w)) });
      steps.push(`Area: ${fmt(l)} × ${fmt(w)} = ${fmt(l * w)}`, `Perimeter: 2 × (${fmt(l)} + ${fmt(w)}) = ${fmt(2 * (l + w))}`);
      break;
    }
    case 'square': {
      const s = r.num('s', 'the side', pos);
      lines.push({ label: 'Area = s²', value: area(s * s), primary: true });
      lines.push({ label: 'Perimeter = 4s', value: len(4 * s) });
      lines.push({ label: 'Diagonal = s√2', value: len(s * Math.SQRT2) });
      steps.push(`Area: ${fmt(s)} × ${fmt(s)} = ${fmt(s * s)}`, `Perimeter: 4 × ${fmt(s)} = ${fmt(4 * s)}`);
      break;
    }
    case 'triangle': {
      const b = r.num('base', 'the base', pos);
      const h = r.num('h', 'the height', pos);
      lines.push({ label: 'Area = ½ × b × h', value: area(0.5 * b * h), primary: true });
      steps.push(`Multiply base by height: ${fmt(b)} × ${fmt(h)} = ${fmt(b * h)}`, `Halve it: ${fmt(b * h)} ÷ 2 = ${fmt(0.5 * b * h)}`);
      break;
    }
    case 'triangle3': {
      const a = r.num('sa', 'side a', pos);
      const b = r.num('sb', 'side b', pos);
      const c = r.num('sc', 'side c', pos);
      const [x, y, z] = [a, b, c].sort((p, q) => p - q);
      if (x + y <= z) throw new FieldError('sc', `These sides can't make a triangle: ${fmt(x)} + ${fmt(y)} is not more than ${fmt(z)}`);
      const p = a + b + c;
      const s = p / 2;
      const A = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      lines.push({ label: "Area (Heron's formula)", value: area(A), primary: true });
      lines.push({ label: 'Perimeter = a + b + c', value: len(p) });
      const right = Math.abs(x * x + y * y - z * z) < 1e-9 * z * z;
      if (right) lines.push({ label: 'Type', value: 'Right triangle' });
      steps.push(
        `Perimeter: ${fmt(a)} + ${fmt(b)} + ${fmt(c)} = ${fmt(p)}`,
        `Half the perimeter: s = ${fmt(p)} ÷ 2 = ${fmt(s)}`,
        `Area = √(s(s − a)(s − b)(s − c)) = √(${fmt(s)} × ${fmt(s - a)} × ${fmt(s - b)} × ${fmt(s - c)}) = ${fmt(A)}`,
      );
      break;
    }
    case 'trapezoid': {
      const a = r.num('sa', 'side a', pos);
      const b = r.num('sb', 'side b', pos);
      const h = r.num('h', 'the height', pos);
      const A = ((a + b) / 2) * h;
      lines.push({ label: 'Area = ½(a + b) × h', value: area(A), primary: true });
      steps.push(`Add the parallel sides: ${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}`, `Halve it and multiply by the height: ${fmt((a + b) / 2)} × ${fmt(h)} = ${fmt(A)}`);
      break;
    }
    case 'cube': {
      const s = r.num('s', 'the side', pos);
      lines.push({ label: 'Volume = s³', value: vol(s ** 3), primary: true });
      lines.push({ label: 'Surface area = 6s²', value: area(6 * s * s) });
      steps.push(`Volume: ${fmt(s)} × ${fmt(s)} × ${fmt(s)} = ${fmt(s ** 3)}`, `Surface area: 6 × ${fmt(s * s)} = ${fmt(6 * s * s)}`);
      break;
    }
    case 'cuboid': {
      const l = r.num('l', 'the length', pos);
      const w = r.num('w', 'the width', pos);
      const h = r.num('h', 'the height', pos);
      const sa = 2 * (l * w + l * h + w * h);
      lines.push({ label: 'Volume = l × w × h', value: vol(l * w * h), primary: true });
      lines.push({ label: 'Surface area = 2(lw + lh + wh)', value: area(sa) });
      lines.push({ label: 'Space diagonal', value: len(Math.sqrt(l * l + w * w + h * h)) });
      steps.push(`Volume: ${fmt(l)} × ${fmt(w)} × ${fmt(h)} = ${fmt(l * w * h)}`, `Surface area: 2 × (${fmt(l * w)} + ${fmt(l * h)} + ${fmt(w * h)}) = ${fmt(sa)}`);
      break;
    }
    case 'cylinder': {
      const rr = r.num('r', 'the radius', pos);
      const h = r.num('h', 'the height', pos);
      const V = PI * rr * rr * h;
      const SA = 2 * PI * rr * rr + 2 * PI * rr * h;
      lines.push({ label: 'Volume = πr²h', value: vol(V), primary: true });
      lines.push({ label: 'Surface area = 2πr² + 2πrh', value: area(SA) });
      steps.push(`Area of the circular base: π × ${fmt(rr)}² ≈ ${fmt(PI * rr * rr)}`, `Multiply by the height: ${fmt(PI * rr * rr)} × ${fmt(h)} ≈ ${fmt(V)}`);
      break;
    }
    case 'sphere': {
      const rr = r.num('r', 'the radius', pos);
      const V = (4 / 3) * PI * rr ** 3;
      lines.push({ label: 'Volume = ⁴⁄₃πr³', value: vol(V), primary: true });
      lines.push({ label: 'Surface area = 4πr²', value: area(4 * PI * rr * rr) });
      steps.push(`Cube the radius: ${fmt(rr)}³ = ${fmt(rr ** 3)}`, `Multiply by ⁴⁄₃π: ${fmt(rr ** 3)} × ⁴⁄₃ × π ≈ ${fmt(V)}`);
      break;
    }
    case 'cone': {
      const rr = r.num('r', 'the radius', pos);
      const h = r.num('h', 'the height', pos);
      const slant = Math.hypot(rr, h);
      const V = (PI * rr * rr * h) / 3;
      lines.push({ label: 'Volume = ⅓πr²h', value: vol(V), primary: true });
      lines.push({ label: 'Surface area = πr² + πrl', value: area(PI * rr * rr + PI * rr * slant) });
      lines.push({ label: 'Slant height l = √(r² + h²)', value: len(slant) });
      steps.push(`Base area: π × ${fmt(rr)}² ≈ ${fmt(PI * rr * rr)}`, `Volume: ${fmt(PI * rr * rr)} × ${fmt(h)} ÷ 3 ≈ ${fmt(V)}`);
      break;
    }
    default:
      throw new FieldError('shape', 'Pick a shape');
  }
  return { lines, steps, note: 'Answers that use π are rounded.' };
});
