// Linear equation solver for one variable: "3x + 5 = 20", "2(x - 1) = x + 4".
// Each side is reduced to a·x + b with exact fractions, then solved.
import { MathError } from './expression.ts';
import { add, div, fromDecimal, isZero, mul, neg, rat, sub, toString, type Rational } from './rational.ts';

interface Lin {
  a: Rational; // coefficient of the variable
  b: Rational; // constant
}

type Tok =
  | { t: 'num'; v: Rational }
  | { t: 'var'; v: string }
  | { t: 'op'; v: '+' | '-' | '*' | '/' }
  | { t: '(' }
  | { t: ')' };

function lex(s: string): Tok[] {
  const src = s.replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-');
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) {
      i++;
    } else if (/[0-9.]/.test(c)) {
      const m = src.slice(i).match(/^(\d+\.?\d*|\.\d+)/);
      if (!m) throw new MathError(`"${c}" is not a number`);
      out.push({ t: 'num', v: fromDecimal(Number(m[0])) });
      i += m[0].length;
    } else if (/[a-z]/i.test(c)) {
      out.push({ t: 'var', v: c.toLowerCase() });
      i++;
    } else if ('+-*/'.includes(c)) {
      out.push({ t: 'op', v: c as '+' | '-' | '*' | '/' });
      i++;
    } else if (c === '(') {
      out.push({ t: '(' });
      i++;
    } else if (c === ')') {
      out.push({ t: ')' });
      i++;
    } else {
      throw new MathError(`"${c}" can't be used in an equation here`);
    }
  }
  return out;
}

const ZERO = rat(0);
const linAdd = (p: Lin, q: Lin): Lin => ({ a: add(p.a, q.a), b: add(p.b, q.b) });
const linNeg = (p: Lin): Lin => ({ a: neg(p.a), b: neg(p.b) });

function linMul(p: Lin, q: Lin): Lin {
  if (!isZero(p.a) && !isZero(q.a))
    throw new MathError('This has the variable multiplied by itself, so it is not linear. Try the quadratic solver.');
  return { a: add(mul(p.a, q.b), mul(q.a, p.b)), b: mul(p.b, q.b) };
}

function linDiv(p: Lin, q: Lin): Lin {
  if (!isZero(q.a)) throw new MathError('Dividing by the variable makes this not a linear equation');
  if (isZero(q.b)) throw new MathError("Can't divide by zero");
  return { a: div(p.a, q.b), b: div(p.b, q.b) };
}

function parseSide(text: string, variable: { name: string | null }): Lin {
  const toks = lex(text);
  if (toks.length === 0) throw new MathError('One side of the equation is empty');
  let p = 0;
  const peek = () => toks[p];

  const startsTerm = (t: Tok | undefined) => !!t && (t.t === 'num' || t.t === 'var' || t.t === '(');

  function sum(): Lin {
    let left = product();
    while (peek()?.t === 'op' && ((peek() as { v: string }).v === '+' || (peek() as { v: string }).v === '-')) {
      const op = (toks[p++] as { v: string }).v;
      const right = product();
      left = op === '+' ? linAdd(left, right) : linAdd(left, linNeg(right));
    }
    return left;
  }

  function product(): Lin {
    let left = unary();
    for (;;) {
      const t = peek();
      if (t?.t === 'op' && (t.v === '*' || t.v === '/')) {
        p++;
        const right = unary();
        left = t.v === '*' ? linMul(left, right) : linDiv(left, right);
      } else if (startsTerm(t)) {
        left = linMul(left, unary()); // implicit: 3x, 2(x+1)
      } else break;
    }
    return left;
  }

  function unary(): Lin {
    const t = peek();
    if (t?.t === 'op' && (t.v === '-' || t.v === '+')) {
      p++;
      const v = unary();
      return t.v === '-' ? linNeg(v) : v;
    }
    return atom();
  }

  function atom(): Lin {
    const t = toks[p++];
    if (!t) throw new MathError('The equation ends too early');
    if (t.t === 'num') return { a: ZERO, b: t.v };
    if (t.t === 'var') {
      if (variable.name && variable.name !== t.v)
        throw new MathError(`Use only one letter. Found both ${variable.name} and ${t.v}.`);
      variable.name = t.v;
      return { a: rat(1), b: ZERO };
    }
    if (t.t === '(') {
      const v = sum();
      if (toks[p]?.t !== ')') throw new MathError('A bracket is not closed');
      p++;
      return v;
    }
    throw new MathError('Something is missing in the equation');
  }

  const result = sum();
  if (p < toks.length) throw new MathError('Something is missing between two parts of the equation');
  return result;
}

export function formatLin(l: Lin, v: string): string {
  const parts: string[] = [];
  if (!isZero(l.a)) {
    const coef = l.a.n === 1 && l.a.d === 1 ? '' : l.a.n === -1 && l.a.d === 1 ? '-' : wrap(l.a);
    parts.push(`${coef}${v}`);
  }
  if (!isZero(l.b) || parts.length === 0) {
    const s = toString(l.b);
    if (parts.length === 0) parts.push(s);
    else parts.push(l.b.n < 0 ? `− ${toString(neg(l.b))}` : `+ ${s}`);
  }
  return parts.join(' ').replace(/^-/, '−');
}
const wrap = (r: Rational) => (r.d === 1 ? `${r.n}` : `(${toString(r)})`);

export type LinearResult =
  | { kind: 'one'; variable: string; value: Rational; steps: string[] }
  | { kind: 'none'; variable: string; steps: string[] }
  | { kind: 'all'; variable: string; steps: string[] };

export function solveLinear(equation: string): LinearResult {
  const sides = equation.split('=');
  if (sides.length !== 2) throw new MathError('Write the equation with exactly one "=" sign, like 3x + 5 = 20');
  const variable = { name: null as string | null };
  const L = parseSide(sides[0], variable);
  const R = parseSide(sides[1], variable);
  const v = variable.name ?? 'x';
  const steps: string[] = [];
  steps.push(`Simplify each side: ${formatLin(L, v)} = ${formatLin(R, v)}`);

  // Move variable terms left, numbers right.
  const a = sub(L.a, R.a);
  const b = sub(R.b, L.b);
  if (!isZero(R.a)) steps.push(`Subtract ${formatLin({ a: R.a, b: ZERO }, v)} from both sides: ${formatLin({ a, b: L.b }, v)} = ${toString(R.b)}`);
  if (!isZero(L.b)) {
    const verb = L.b.n > 0 ? `Subtract ${toString(L.b)} from` : `Add ${toString(neg(L.b))} to`;
    steps.push(`${verb} both sides: ${formatLin({ a, b: ZERO }, v)} = ${toString(b)}`);
  }

  if (isZero(a)) {
    if (isZero(b)) {
      steps.push(`Both sides are always equal, so any value of ${v} works.`);
      return { kind: 'all', variable: v, steps };
    }
    steps.push(`This says 0 = ${toString(b)}, which is never true, so there is no solution.`);
    return { kind: 'none', variable: v, steps };
  }

  const value = div(b, a);
  if (!(a.n === 1 && a.d === 1)) steps.push(`Divide both sides by ${toString(a)}: ${v} = ${toString(value)}`);
  return { kind: 'one', variable: v, value, steps };
}
