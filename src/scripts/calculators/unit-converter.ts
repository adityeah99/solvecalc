import { mountForm, FieldError, fmt } from '../calc-form.ts';
import { convert, UNIT_CATEGORIES } from '../../lib/math/units.ts';
import { MathError } from '../../lib/math/expression.ts';

const form = document.getElementById('unit-form') as HTMLFormElement;
const from = form.elements.namedItem('from') as HTMLSelectElement;
const to = form.elements.namedItem('to') as HTMLSelectElement;
const short = (label: string) => label.match(/\(([^)]+)\)/)?.[1] ?? label;

function fill(catId: string) {
  const cat = UNIT_CATEGORIES.find((c) => c.id === catId)!;
  const opts = () => cat.units.map((u) => new Option(u.label, u.id));
  from.replaceChildren(...opts());
  to.replaceChildren(...opts());
  from.value = cat.defaults[0];
  to.value = cat.defaults[1];
}

// Registered before mountForm so the unit lists change before the result is recalculated.
form.addEventListener('change', (e) => {
  const t = e.target as HTMLInputElement;
  if (t.name === 'cat') fill(t.value);
});
form.addEventListener('reset', () => setTimeout(() => fill(UNIT_CATEGORIES[0].id)));
form.querySelector('[data-swap]')!.addEventListener('click', () => {
  [from.value, to.value] = [to.value, from.value];
  from.dispatchEvent(new Event('input', { bubbles: true }));
});

mountForm(form, (r) => {
  const catId = r.value('cat');
  const cat = UNIT_CATEGORIES.find((c) => c.id === catId)!;
  const value = r.num('value', 'a value');
  const f = cat.units.find((u) => u.id === from.value)!;
  const t = cat.units.find((u) => u.id === to.value)!;
  let out: number;
  try {
    out = convert(value, catId, f.id, t.id);
  } catch (e) {
    throw new FieldError('value', e instanceof MathError ? e.message : 'That value cannot be converted');
  }
  const others = cat.units
    .filter((u) => u.id !== f.id && u.id !== t.id)
    .map((u) => ({ label: u.label, value: `${fmt(convert(value, catId, f.id, u.id))} ${short(u.label)}` }));
  const factor = catId === 'temperature' ? null : convert(1, catId, f.id, t.id);
  return {
    lines: [{ label: `${fmt(value)} ${short(f.label)} =`, value: `${fmt(out)} ${short(t.label)}`, primary: true }, ...others],
    steps: factor === null
      ? [temperatureStep(f.id, t.id)]
      : [`1 ${short(f.label)} = ${fmt(factor)} ${short(t.label)}`, `${fmt(value)} × ${fmt(factor)} = ${fmt(out)} ${short(t.label)}`],
  };
});

function temperatureStep(a: string, b: string) {
  const rules: Record<string, string> = {
    'c>f': '°F = °C × 9/5 + 32',
    'f>c': '°C = (°F − 32) × 5/9',
    'c>k': 'K = °C + 273.15',
    'k>c': '°C = K − 273.15',
    'f>k': 'K = (°F − 32) × 5/9 + 273.15',
    'k>f': '°F = (K − 273.15) × 9/5 + 32',
  };
  return a === b ? 'Same unit, so the value does not change.' : `Use the formula ${rules[`${a}>${b}`]}`;
}
