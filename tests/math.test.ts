import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, formatNumber, MathError, parse } from '../src/lib/math/expression.ts';
import { combinations, euclidSteps, gcd, lcm, parseNumber, parseNumberList, permutations, primeFactors, simplifySqrt } from '../src/lib/math/number.ts';
import { add, div, fromDecimal, mul, parseRational, rat, sub, toMixed, toString } from '../src/lib/math/rational.ts';
import { solveLinear } from '../src/lib/math/linear.ts';
import { solveQuadratic } from '../src/lib/math/quadratic.ts';
import { summarize, weightedAverage } from '../src/lib/math/stats.ts';
import { convert } from '../src/lib/math/units.ts';

const calc = (s: string, angle: 'deg' | 'rad' = 'deg', ans?: number) => formatNumber(evaluate(s, { angle, ans }));
const throwsMath = (fn: () => unknown, re?: RegExp) =>
  assert.throws(fn, (e: unknown) => e instanceof MathError && (!re || re.test((e as Error).message)));

test('arithmetic and precedence', () => {
  assert.equal(calc('1+2*3'), '7');
  assert.equal(calc('(1+2)*3'), '9');
  assert.equal(calc('10/4'), '2.5');
  assert.equal(calc('0.1+0.2'), '0.3');
  assert.equal(calc('2^3^2'), '512'); // right-associative
  assert.equal(calc('-2^2'), '-4');
  assert.equal(calc('(-2)^2'), '4');
  assert.equal(calc('2^-1'), '0.5');
  assert.equal(calc('7−3×2÷4'), '5.5'); // calculator glyphs
  assert.equal(calc('--3'), '3');
  assert.equal(calc('1e'), formatNumber(Math.E)); // implicit 1×e
});

test('percent, factorial, powers and roots', () => {
  assert.equal(calc('200*15%'), '30');
  assert.equal(calc('50%'), '0.5');
  assert.equal(calc('5!'), '120');
  assert.equal(calc('0!'), '1');
  assert.equal(calc('3!^2'), '36');
  assert.equal(calc('sqrt(16)'), '4');
  assert.equal(calc('√16+1'), '5');
  assert.equal(calc('cbrt(-27)'), '-3');
  assert.equal(calc('5²'), '25');
  assert.equal(calc('2**10'), '1024');
  throwsMath(() => calc('2.5!'), /whole number/);
  throwsMath(() => calc('171!'), /too large/);
});

test('implicit multiplication and constants', () => {
  assert.equal(calc('2pi'), formatNumber(2 * Math.PI));
  assert.equal(calc('2π'), formatNumber(2 * Math.PI));
  assert.equal(calc('3(4+1)'), '15');
  assert.equal(calc('(1+2)(3+4)'), '21');
  assert.equal(calc('2sin(30)'), '1');
  assert.equal(calc('ans*2', 'deg', 21), '42');
  throwsMath(() => calc('ans+1'), /previous answer/);
});

test('trig in degrees and radians', () => {
  assert.equal(calc('sin(30)'), '0.5');
  assert.equal(calc('cos(60)'), '0.5');
  assert.equal(calc('tan(45)'), '1');
  assert.equal(calc('sin(180)'), '0');
  assert.equal(calc('cos(90)'), '0');
  assert.equal(calc('sin(-90)'), '-1');
  assert.equal(calc('sin⁻¹(0.5)'), '30');
  assert.equal(calc('acos(0)'), '90');
  assert.equal(calc('atan(1)'), '45');
  assert.equal(calc('sin(pi/2)', 'rad'), '1');
  assert.equal(calc('asin(1)', 'rad'), formatNumber(Math.PI / 2));
  throwsMath(() => calc('tan(90)'), /undefined/);
  throwsMath(() => calc('asin(2)'), /-1 to 1/);
});

test('logs', () => {
  assert.equal(calc('log(1000)'), '3');
  assert.equal(calc('ln(e)'), '1');
  assert.equal(calc('ln(1)'), '0');
  throwsMath(() => calc('log(0)'), /greater than 0/);
  throwsMath(() => calc('ln(-1)'), /greater than 0/);
});

test('brackets and bad input', () => {
  assert.equal(calc('sin(30'), '0.5'); // auto-closes
  assert.equal(calc('2*(3+4'), '14');
  throwsMath(() => parse(''), /Type an expression/);
  throwsMath(() => parse('2+'), /needs a number after/);
  throwsMath(() => parse('*2'), /needs a number before/);
  throwsMath(() => parse('()'), /Empty brackets/);
  throwsMath(() => parse('2)'), /closing bracket/);
  throwsMath(() => parse('1.2.3'), /decimal point/);
  throwsMath(() => parse('alert(1)'), /Unknown name/);
  throwsMath(() => parse('x+1'), /Unknown name/);
  throwsMath(() => parse('2$3'), /can't be used/);
  throwsMath(() => calc('1/0'), /divide by zero/);
  throwsMath(() => calc('sqrt(-4)'), /not a real number/);
  throwsMath(() => calc('(-8)^(1/3)'), /not a real number/);
  throwsMath(() => calc('10^400'), /too large/);
});

test('formatNumber', () => {
  assert.equal(formatNumber(1 / 3), '0.333333333333');
  assert.equal(formatNumber(1e20), '1e20');
  assert.equal(formatNumber(1.5e-12), '1.5e-12');
  assert.equal(formatNumber(-0), '0');
  assert.equal(formatNumber(123456789), '123456789');
});

test('whole-number helpers', () => {
  assert.equal(gcd(48, 36), 12);
  assert.equal(lcm(4, 6), 12);
  assert.deepEqual(euclidSteps(48, 36), [
    { a: 48, b: 36, q: 1, r: 12 },
    { a: 36, b: 12, q: 3, r: 0 },
  ]);
  assert.deepEqual(primeFactors(72), [
    [2, 3],
    [3, 2],
  ]);
  assert.deepEqual(simplifySqrt(72), { outside: 6, inside: 2 });
  assert.equal(combinations(52, 5), 2598960n);
  assert.equal(permutations(5, 3), 60n);
  assert.deepEqual(parseNumberList('3, 4.5 7\n-2'), [3, 4.5, 7, -2]);
  assert.equal(parseNumber('3/4'), 0.75);
  throwsMath(() => parseNumberList('1, two, 3'), /"two"/);
  throwsMath(() => combinations(3, 5), /bigger than n/);
});

test('fractions', () => {
  assert.equal(toString(add(rat(1, 2), rat(1, 3))), '5/6');
  assert.equal(toString(sub(rat(1, 2), rat(3, 4))), '-1/4');
  assert.equal(toString(mul(rat(2, 3), rat(9, 4))), '3/2');
  assert.equal(toString(div(rat(1, 2), rat(1, 4))), '2');
  assert.equal(toMixed(rat(7, 3)), '2 1/3');
  assert.equal(toMixed(rat(-7, 3)), '-2 1/3');
  assert.equal(toString(fromDecimal(0.375)), '3/8');
  assert.equal(toString(parseRational('1 1/2')), '3/2');
  assert.equal(toString(parseRational('-2/-4')), '1/2');
  throwsMath(() => rat(1, 0), /denominator/);
});

test('linear equations', () => {
  const r1 = solveLinear('3x + 5 = 20');
  assert.equal(r1.kind, 'one');
  assert.equal(r1.kind === 'one' && toString(r1.value), '5');
  const r2 = solveLinear('2(x - 1) = x + 4');
  assert.equal(r2.kind === 'one' && toString(r2.value), '6');
  const r3 = solveLinear('x/3 + 2 = 5');
  assert.equal(r3.kind === 'one' && toString(r3.value), '9');
  const r4 = solveLinear('4y = 3');
  assert.equal(r4.kind === 'one' && `${r4.variable}=${toString(r4.value)}`, 'y=3/4');
  const r5 = solveLinear('0.5x + 1.25 = 2');
  assert.equal(r5.kind === 'one' && toString(r5.value), '3/2');
  assert.equal(solveLinear('x + 1 = x + 2').kind, 'none');
  assert.equal(solveLinear('2x + 2 = 2(x + 1)').kind, 'all');
  throwsMath(() => solveLinear('x*x = 4'), /not linear/);
  throwsMath(() => solveLinear('x + y = 2'), /only one letter/);
  throwsMath(() => solveLinear('3x + 5'), /one "="/);
});

test('quadratics', () => {
  const q1 = solveQuadratic(1, -5, 6);
  assert.equal(q1.kind, 'two-real');
  assert.deepEqual(q1.roots, ['3', '2']);
  assert.equal(q1.factored, '(x − 3)(x − 2)');
  const q2 = solveQuadratic(1, 2, 1);
  assert.equal(q2.kind, 'one-real');
  assert.deepEqual(q2.roots, ['-1']);
  assert.equal(q2.factored, '(x + 1)²');
  const q3 = solveQuadratic(1, 0, 4);
  assert.equal(q3.kind, 'complex');
  assert.deepEqual(q3.roots, ['2i', '− 2i']);
  const q4 = solveQuadratic(2, -3, 1);
  assert.equal(q4.factored, '(x − 1)(2x − 1)');
  const q5 = solveQuadratic(1, 0, -2);
  assert.equal(q5.factored, null);
  assert.deepEqual(q1.vertex, { x: 2.5, y: -0.25 });
  throwsMath(() => solveQuadratic(0, 1, 1), /a cannot be 0/);
});

test('statistics', () => {
  const s = summarize([2, 4, 4, 4, 5, 5, 7, 9]);
  assert.equal(s.mean, 5);
  assert.equal(s.median, 4.5);
  assert.deepEqual(s.modes, [4]);
  assert.equal(s.popStdDev, 2);
  assert.equal(s.range, 7);
  const odd = summarize([1, 2, 3, 4, 5, 6, 7]);
  assert.equal(odd.q1, 2);
  assert.equal(odd.q3, 6);
  assert.deepEqual(summarize([1, 2, 3]).modes, []);
  assert.equal(summarize([5]).sampleVariance, null);
  assert.equal(weightedAverage([{ value: 80, weight: 2 }, { value: 90, weight: 1 }]).average, 250 / 3);
  throwsMath(() => summarize([]), /at least one/);
});

test('unit conversion', () => {
  assert.equal(convert(1, 'length', 'in', 'cm'), 2.54);
  assert.equal(formatNumber(convert(100, 'temperature', 'c', 'f')), '212');
  assert.equal(formatNumber(convert(32, 'temperature', 'f', 'c')), '0');
  assert.equal(formatNumber(convert(0, 'temperature', 'k', 'c')), '-273.15');
  assert.equal(formatNumber(convert(1, 'mass', 'lb', 'kg')), '0.45359237');
  assert.equal(formatNumber(convert(1, 'volume', 'gal', 'l')), '3.785411784');
  assert.equal(formatNumber(convert(60, 'speed', 'mph', 'kmh')), '96.56064');
  throwsMath(() => convert(-500, 'temperature', 'c', 'f'), /absolute zero/);
});
