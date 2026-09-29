import { MathError } from './expression.ts';

export interface Summary {
  count: number;
  sum: number;
  min: number;
  max: number;
  range: number;
  mean: number;
  median: number;
  modes: number[]; // empty when every value appears once
  q1: number;
  q3: number;
  iqr: number;
  popVariance: number;
  popStdDev: number;
  sampleVariance: number | null; // null when n < 2
  sampleStdDev: number | null;
  sorted: number[];
}

const median = (s: number[]) => {
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export function summarize(values: number[]): Summary {
  if (values.length === 0) throw new MathError('Enter at least one number');
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const counts = new Map<number, number>();
  for (const v of sorted) counts.set(v, (counts.get(v) ?? 0) + 1);
  const top = Math.max(...counts.values());
  const modes = top > 1 ? [...counts].filter(([, c]) => c === top).map(([v]) => v) : [];

  // Quartiles: median of each half, leaving out the middle value when n is odd.
  const half = n >> 1;
  const lower = sorted.slice(0, half);
  const upper = sorted.slice(n % 2 ? half + 1 : half);
  const q1 = n > 1 ? median(lower) : sorted[0];
  const q3 = n > 1 ? median(upper) : sorted[0];

  const ss = sorted.reduce((a, v) => a + (v - mean) ** 2, 0);
  const popVariance = ss / n;
  const sampleVariance = n > 1 ? ss / (n - 1) : null;

  return {
    count: n,
    sum,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    mean,
    median: median(sorted),
    modes,
    q1,
    q3,
    iqr: q3 - q1,
    popVariance,
    popStdDev: Math.sqrt(popVariance),
    sampleVariance,
    sampleStdDev: sampleVariance === null ? null : Math.sqrt(sampleVariance),
    sorted,
  };
}

export function weightedAverage(pairs: { value: number; weight: number }[]) {
  if (pairs.length === 0) throw new MathError('Add at least one value and weight');
  if (pairs.some((p) => p.weight < 0)) throw new MathError('Weights cannot be negative');
  const totalWeight = pairs.reduce((a, p) => a + p.weight, 0);
  if (totalWeight === 0) throw new MathError('The weights add up to 0, so there is no average');
  const weightedSum = pairs.reduce((a, p) => a + p.value * p.weight, 0);
  return { weightedSum, totalWeight, average: weightedSum / totalWeight };
}
