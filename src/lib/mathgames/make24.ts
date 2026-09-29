// Make 24: exact solver over fractions, and a generator of solvable puzzles.
import { gcd } from '../math/number.ts';
import { randInt, type Rng } from './rounds.ts';

export interface Frac {
  n: number;
  d: number;
}
export const fr = (n: number, d = 1): Frac => {
  if (d < 0) [n, d] = [-n, -d];
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
};
export const fracText = (f: Frac) => (f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`).replace(/^-/, '−');

export type Op = '+' | '−' | '×' | '÷';
export function apply(a: Frac, op: Op, b: Frac): Frac | null {
  switch (op) {
    case '+':
      return fr(a.n * b.d + b.n * a.d, a.d * b.d);
    case '−':
      return fr(a.n * b.d - b.n * a.d, a.d * b.d);
    case '×':
      return fr(a.n * b.n, a.d * b.d);
    case '÷':
      return b.n === 0 ? null : fr(a.n * b.d, a.d * b.n);
  }
}

const OPS: Op[] = ['+', '−', '×', '÷'];

/** Returns one solution as a readable expression, or null when there is none. */
export function solve(numbers: number[], target = 24): string | null {
  const items = numbers.map((n) => ({ v: fr(n), e: String(n) }));
  const search = (list: { v: Frac; e: string }[]): string | null => {
    if (list.length === 1) return list[0].v.n === target && list[0].v.d === 1 ? list[0].e : null;
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list.length; j++) {
        if (i === j) continue;
        const rest = list.filter((_, k) => k !== i && k !== j);
        for (const op of OPS) {
          if ((op === '+' || op === '×') && j < i) continue; // commutative: try once
          const v = apply(list[i].v, op, list[j].v);
          if (!v) continue;
          const found = search([...rest, { v, e: `(${list[i].e} ${op} ${list[j].e})` }]);
          if (found) return found;
        }
      }
    }
    return null;
  };
  const s = search(items);
  return s ? s.replace(/^\((.*)\)$/, '$1') : null;
}

/** Four numbers from 1 to 9 that can make 24. */
export function makePuzzle(rng: Rng): number[] {
  for (;;) {
    const nums = Array.from({ length: 4 }, () => randInt(rng, 1, 9));
    if (solve(nums)) return nums;
  }
}
