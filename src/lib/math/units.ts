// Unit conversion tables. Linear units store the size of one unit in the
// category's base unit; temperature is handled separately.
import { MathError } from './expression.ts';

export interface Unit {
  id: string;
  label: string;
  factor: number; // 1 unit = factor × base unit
}

export interface Category {
  id: string;
  label: string;
  units: Unit[];
  defaults: [string, string];
}

const IN = 0.0254;
const FT = 0.3048;
const LB = 0.45359237;
const GAL_US = 3.785411784e-3; // m³
const MILE = 1609.344;

export const UNIT_CATEGORIES: Category[] = [
  {
    id: 'length',
    label: 'Length',
    defaults: ['cm', 'in'],
    units: [
      { id: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
      { id: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
      { id: 'm', label: 'Meters (m)', factor: 1 },
      { id: 'km', label: 'Kilometers (km)', factor: 1000 },
      { id: 'in', label: 'Inches (in)', factor: IN },
      { id: 'ft', label: 'Feet (ft)', factor: FT },
      { id: 'yd', label: 'Yards (yd)', factor: 0.9144 },
      { id: 'mi', label: 'Miles (mi)', factor: MILE },
    ],
  },
  {
    id: 'mass',
    label: 'Mass',
    defaults: ['kg', 'lb'],
    units: [
      { id: 'mg', label: 'Milligrams (mg)', factor: 1e-6 },
      { id: 'g', label: 'Grams (g)', factor: 0.001 },
      { id: 'kg', label: 'Kilograms (kg)', factor: 1 },
      { id: 't', label: 'Metric tons (t)', factor: 1000 },
      { id: 'oz', label: 'Ounces (oz)', factor: LB / 16 },
      { id: 'lb', label: 'Pounds (lb)', factor: LB },
      { id: 'st', label: 'Stone (st)', factor: LB * 14 },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    defaults: ['c', 'f'],
    units: [
      { id: 'c', label: 'Celsius (°C)', factor: 1 },
      { id: 'f', label: 'Fahrenheit (°F)', factor: 1 },
      { id: 'k', label: 'Kelvin (K)', factor: 1 },
    ],
  },
  {
    id: 'area',
    label: 'Area',
    defaults: ['m2', 'ft2'],
    units: [
      { id: 'mm2', label: 'Square millimeters (mm²)', factor: 1e-6 },
      { id: 'cm2', label: 'Square centimeters (cm²)', factor: 1e-4 },
      { id: 'm2', label: 'Square meters (m²)', factor: 1 },
      { id: 'ha', label: 'Hectares (ha)', factor: 1e4 },
      { id: 'km2', label: 'Square kilometers (km²)', factor: 1e6 },
      { id: 'in2', label: 'Square inches (in²)', factor: IN * IN },
      { id: 'ft2', label: 'Square feet (ft²)', factor: FT * FT },
      { id: 'yd2', label: 'Square yards (yd²)', factor: 0.9144 * 0.9144 },
      { id: 'acre', label: 'Acres', factor: 4046.8564224 },
      { id: 'mi2', label: 'Square miles (mi²)', factor: MILE * MILE },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    defaults: ['l', 'gal'],
    units: [
      { id: 'ml', label: 'Milliliters (mL)', factor: 1e-6 },
      { id: 'l', label: 'Liters (L)', factor: 1e-3 },
      { id: 'cm3', label: 'Cubic centimeters (cm³)', factor: 1e-6 },
      { id: 'm3', label: 'Cubic meters (m³)', factor: 1 },
      { id: 'tsp', label: 'US teaspoons (tsp)', factor: GAL_US / 768 },
      { id: 'tbsp', label: 'US tablespoons (tbsp)', factor: GAL_US / 256 },
      { id: 'floz', label: 'US fluid ounces (fl oz)', factor: GAL_US / 128 },
      { id: 'cup', label: 'US cups', factor: GAL_US / 16 },
      { id: 'pt', label: 'US pints (pt)', factor: GAL_US / 8 },
      { id: 'qt', label: 'US quarts (qt)', factor: GAL_US / 4 },
      { id: 'gal', label: 'US gallons (gal)', factor: GAL_US },
      { id: 'galuk', label: 'UK gallons', factor: 4.54609e-3 },
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    defaults: ['kmh', 'mph'],
    units: [
      { id: 'ms', label: 'Meters per second (m/s)', factor: 1 },
      { id: 'kmh', label: 'Kilometers per hour (km/h)', factor: 1000 / 3600 },
      { id: 'mph', label: 'Miles per hour (mph)', factor: MILE / 3600 },
      { id: 'kn', label: 'Knots (kn)', factor: 1852 / 3600 },
      { id: 'fts', label: 'Feet per second (ft/s)', factor: FT },
    ],
  },
  {
    id: 'time',
    label: 'Time',
    defaults: ['h', 'min'],
    units: [
      { id: 's', label: 'Seconds (s)', factor: 1 },
      { id: 'min', label: 'Minutes (min)', factor: 60 },
      { id: 'h', label: 'Hours (h)', factor: 3600 },
      { id: 'day', label: 'Days', factor: 86400 },
      { id: 'week', label: 'Weeks', factor: 604800 },
      { id: 'year', label: 'Years (365 days)', factor: 31536000 },
    ],
  },
];

function toCelsius(v: number, from: string) {
  if (from === 'c') return v;
  if (from === 'f') return ((v - 32) * 5) / 9;
  return v - 273.15;
}
function fromCelsius(c: number, to: string) {
  if (to === 'c') return c;
  if (to === 'f') return (c * 9) / 5 + 32;
  return c + 273.15;
}

export function convert(value: number, categoryId: string, from: string, to: string): number {
  const cat = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) throw new MathError('Unknown unit type');
  if (!Number.isFinite(value)) throw new MathError('Enter a number to convert');
  if (cat.id === 'temperature') {
    const c = toCelsius(value, from);
    if (c < -273.15 - 1e-9) throw new MathError('That is colder than absolute zero (−273.15 °C)');
    return fromCelsius(c, to);
  }
  const f = cat.units.find((u) => u.id === from);
  const t = cat.units.find((u) => u.id === to);
  if (!f || !t) throw new MathError('Unknown unit');
  if (value < 0 && cat.id !== 'time') throw new MathError(`${cat.label} can't be negative here`);
  return (value * f.factor) / t.factor;
}
