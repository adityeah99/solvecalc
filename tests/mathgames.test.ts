import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { averageAim, fractionFaceoff, isPrime, oddsOn, primeTime, seeded, solveForX, sumSprint, type Level } from '../src/lib/mathgames/rounds.ts';
import { apply, fr, makePuzzle, solve } from '../src/lib/mathgames/make24.ts';
import { MATH_GAMES } from '../src/data/math-games.ts';
import { evaluate } from '../src/lib/math/expression.ts';
import { solveLinear } from '../src/lib/math/linear.ts';
import { toString } from '../src/lib/math/rational.ts';

const N = 400;
const gcdOf = (a: number, b: number): number => (b ? gcdOf(b, a % b) : a);
const levels: Level[] = [1, 2, 3];

test('sum sprint answers are right and whole', () => {
  const rng = seeded(1);
  for (const lv of levels)
    for (let i = 0; i < N; i++) {
      const r = sumSprint(rng, lv);
      const v = evaluate(r.prompt);
      assert.equal(String(v), r.answer, r.prompt);
      assert.ok(Number.isInteger(v) && v >= 0, r.prompt);
    }
});

test('solve for x answers match the equation solver', () => {
  const rng = seeded(2);
  for (const lv of levels)
    for (let i = 0; i < N; i++) {
      const r = solveForX(rng, lv);
      const res = solveLinear(r.prompt);
      assert.equal(res.kind, 'one', r.prompt);
      assert.equal(res.kind === 'one' && toString(res.value), r.answer, r.prompt);
      assert.ok(r.explain.endsWith(`x = ${r.answer.replace('-', '−')}.`), r.explain);
    }
});

test('fraction face-off picks the bigger fraction', () => {
  const rng = seeded(3);
  let equal = 0;
  for (let i = 0; i < N; i++) {
    const r = fractionFaceoff(rng);
    assert.ok(r.visual?.kind === 'fractions');
    const { left, right } = r.visual as { left: [number, number]; right: [number, number] };
    const l = left[0] / left[1];
    const rr = right[0] / right[1];
    const expected = Math.abs(l - rr) < 1e-12 ? 'Equal' : l > rr ? 'Left is bigger' : 'Right is bigger';
    assert.equal(r.answer, expected);
    if (expected === 'Equal') equal++;
  }
  assert.ok(equal > N * 0.1 && equal < N * 0.35, `equal share ${equal}`);
});

test('prime time is correct, with a factor pair for composites', () => {
  const rng = seeded(4);
  for (let i = 0; i < N; i++) {
    const r = primeTime(rng);
    const n = (r.visual as { values: number[] }).values[0];
    assert.equal(r.answer === 'Prime', isPrime(n));
    if (!isPrime(n) && n > 1) {
      const [, a, b] = r.explain.match(/= (\d+) × (\d+)/)!;
      assert.equal(Number(a) * Number(b), n);
    }
  }
  assert.deepEqual([1, 2, 9, 17, 91, 97].map(isPrime), [false, true, false, true, false, true]);
});

test('average aim: four distinct choices, one correct', () => {
  const rng = seeded(5);
  for (let i = 0; i < N; i++) {
    const r = averageAim(rng);
    const vals = (r.visual as { values: number[] }).values;
    const s = [...vals].sort((a, b) => a - b);
    const expected = { mean: vals.reduce((a, b) => a + b, 0) / 5, median: s[2], range: s[4] - s[0] }[r.prompt.match(/the (\w+)/)![1] as 'mean'];
    assert.equal(r.answer, String(expected));
    assert.ok(Number.isInteger(expected));
    assert.equal(new Set(r.choices).size, 4);
    assert.ok(r.choices!.includes(r.answer));
    assert.ok(vals.every((v) => v >= 1));
  }
});

test('odds on: correct simplified probability, no equal-valued distractors', () => {
  const rng = seeded(6);
  for (let i = 0; i < N; i++) {
    const r = oddsOn(rng);
    const { counts } = r.visual as { counts: Record<string, number> };
    const total = counts.red + counts.blue + counts.green;
    const m = r.prompt.match(/P\((not )?(\w+)\)/)!;
    const hits = m[1] ? total - counts[m[2]] : counts[m[2]];
    const [n, d] = r.answer.split('/').map(Number);
    assert.equal(n / d, hits / total, r.prompt);
    assert.equal(r.choices!.length, 4);
    const values = r.choices!.map((c) => c.split('/').map(Number)).map(([a, b]) => a / b);
    assert.equal(new Set(values).size, 4, r.choices!.join(' '));
    assert.ok(values.every((v) => v > 0 && v <= 1), `every choice is a probability: ${r.choices!.join(' ')}`);
    assert.ok(r.choices!.every((c) => { const [a, b] = c.split('/').map(Number); return b === 1 || gcdOf(a, b) === 1; }), `simplified: ${r.choices!.join(' ')}`);
  }
});

test('make 24 solver and generator', () => {
  assert.ok(solve([4, 6, 1, 1]));
  assert.ok(solve([3, 3, 8, 8])); // needs fractions: 8 / (3 − 8/3)
  assert.equal(solve([1, 1, 1, 1]), null);
  const s = solve([3, 3, 8, 8])!;
  assert.ok(Math.abs(evaluate(s.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/')) - 24) < 1e-9, s);
  assert.equal(apply(fr(1), '÷', fr(0)), null);
  const rng = seeded(7);
  for (let i = 0; i < 50; i++) {
    const p = makePuzzle(rng);
    assert.equal(p.length, 4);
    const sol = solve(p)!;
    assert.ok(Math.abs(evaluate(sol.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/')) - 24) < 1e-9, sol);
  }
});

test('math game codes are unique and never clash with the hidden library', () => {
  const codes = MATH_GAMES.map((g) => g.code);
  assert.equal(new Set(codes).size, codes.length);
  assert.ok(codes.every((c) => /^\d{4}$/.test(c) && c !== '0000'));
  const lib = JSON.parse(readFileSync(new URL('../src/generated/games.json', import.meta.url), 'utf8'));
  const libCodes = new Set(lib.games.map((g: { code: string }) => g.code));
  for (const c of codes) assert.ok(!libCodes.has(c), `math game code ${c} is also a library code`);
});
