// Safe expression evaluator for the scientific calculator.
// Tokenizer + Pratt parser + tree walker. Never uses eval/Function.
//
// Supports: + - * / ^ (right-assoc), unary +/-, postfix ! and % (x% = x/100),
// brackets (missing closing brackets are closed at the end), implicit
// multiplication (2pi, 3(4+1), (1+2)(3+4)), constants pi and e, the previous
// answer as "ans", and the functions below.

export type AngleMode = 'deg' | 'rad';

export class MathError extends Error {
  pos: number;
  constructor(message: string, pos = -1) {
    super(message);
    this.name = 'MathError';
    this.pos = pos;
  }
}

const FUNCTIONS = ['asin', 'acos', 'atan', 'sin', 'cos', 'tan', 'sqrt', 'cbrt', 'log', 'ln', 'abs'] as const;
type FnName = (typeof FUNCTIONS)[number];
const CONSTANTS = ['pi', 'e', 'ans'] as const;
type ConstName = (typeof CONSTANTS)[number];
// Longest names first so "asin" wins over "sin", "ans" over "a…".
const NAMES = [...FUNCTIONS, ...CONSTANTS].sort((a, b) => b.length - a.length);

type Op = '+' | '-' | '*' | '/' | '^' | '!' | '%';
type Token =
  | { t: 'num'; v: number; pos: number }
  | { t: 'fn'; v: FnName; pos: number }
  | { t: 'const'; v: ConstName; pos: number }
  | { t: 'op'; v: Op; pos: number }
  | { t: '('; pos: number }
  | { t: ')'; pos: number };

export type Node =
  | { k: 'num'; v: number }
  | { k: 'const'; v: ConstName }
  | { k: 'neg'; a: Node }
  | { k: 'bin'; op: '+' | '-' | '*' | '/' | '^'; a: Node; b: Node }
  | { k: 'post'; op: '!' | '%'; a: Node }
  | { k: 'call'; fn: FnName; a: Node };

/** Maps calculator glyphs and friendly spellings to the parser's ASCII forms. */
export function normalize(input: string): string {
  return input
    .replace(/[×✕·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/\*\*/g, '^')
    .replace(/π/g, 'pi')
    .replace(/sin⁻¹|arcsin/gi, 'asin')
    .replace(/cos⁻¹|arccos/gi, 'acos')
    .replace(/tan⁻¹|arctan/gi, 'atan')
    .replace(/√/g, 'sqrt')
    .replace(/∛/g, 'cbrt')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/log10/gi, 'log');
}

export function tokenize(src: string): Token[] {
  const s = normalize(src);
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\t' || c === '\n') {
      i++;
      continue;
    }
    if ((c >= '0' && c <= '9') || c === '.') {
      const start = i;
      let dots = 0;
      while (i < s.length && ((s[i] >= '0' && s[i] <= '9') || s[i] === '.')) {
        if (s[i] === '.') dots++;
        i++;
      }
      const text = s.slice(start, i);
      if (dots > 1) throw new MathError(`"${text}" has more than one decimal point`, start);
      if (text === '.') throw new MathError('A decimal point needs a digit next to it', start);
      out.push({ t: 'num', v: parseFloat(text), pos: start });
      continue;
    }
    if (/[a-z]/i.test(c)) {
      const rest = s.slice(i).toLowerCase();
      const name = NAMES.find((n) => rest.startsWith(n));
      if (!name) {
        const word = rest.match(/^[a-z]+/)![0];
        throw new MathError(`Unknown name "${word}"`, i);
      }
      if ((FUNCTIONS as readonly string[]).includes(name)) out.push({ t: 'fn', v: name as FnName, pos: i });
      else out.push({ t: 'const', v: name as ConstName, pos: i });
      i += name.length;
      continue;
    }
    if ('+-*/^!%'.includes(c)) {
      out.push({ t: 'op', v: c as Op, pos: i });
      i++;
      continue;
    }
    if (c === '(' || c === '[') {
      out.push({ t: '(', pos: i });
      i++;
      continue;
    }
    if (c === ')' || c === ']') {
      out.push({ t: ')', pos: i });
      i++;
      continue;
    }
    throw new MathError(`"${c}" can't be used here`, i);
  }
  return out;
}

const BIN_PREC: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 4 };
const PREFIX_PREC = 3;
const POSTFIX_PREC = 5;

export function parse(src: string): Node {
  const tokens = tokenize(src);
  if (tokens.length === 0) throw new MathError('Type an expression first');
  let p = 0;
  const peek = () => tokens[p];
  const next = () => tokens[p++];

  // Tokens that can start an operand, used to detect implicit multiplication.
  const startsOperand = (t: Token | undefined) =>
    !!t && (t.t === 'num' || t.t === 'fn' || t.t === 'const' || t.t === '(');

  function prefix(): Node {
    const t = next();
    if (!t) throw new MathError('The expression ends too early');
    switch (t.t) {
      case 'num':
        return { k: 'num', v: t.v };
      case 'const':
        return { k: 'const', v: t.v };
      case 'fn': {
        if (peek()?.t === '(') {
          next();
          if (peek()?.t === ')') throw new MathError(`${t.v}() needs a number inside the brackets`, t.pos);
          const a = expr(0);
          closeBracket();
          return { k: 'call', fn: t.v, a };
        }
        if (!startsOperand(peek()) && !(peek()?.t === 'op' && '+-'.includes((peek() as { v: string }).v)))
          throw new MathError(`${t.v} needs a number after it`, t.pos);
        return { k: 'call', fn: t.v, a: expr(BIN_PREC['^']) };
      }
      case '(': {
        if (peek()?.t === ')') throw new MathError('Empty brackets', t.pos);
        const a = expr(0);
        closeBracket();
        return a;
      }
      case 'op':
        if (t.v === '-') return { k: 'neg', a: expr(PREFIX_PREC + 1) };
        if (t.v === '+') return expr(PREFIX_PREC + 1);
        throw new MathError(`"${t.v}" needs a number before it`, t.pos);
      case ')':
        throw new MathError('There is a closing bracket with nothing before it', t.pos);
    }
  }

  function closeBracket() {
    const t = peek();
    if (!t) return; // auto-close brackets left open at the end
    if (t.t !== ')') throw new MathError('Expected a closing bracket', t.pos);
    next();
  }

  function expr(minPrec: number): Node {
    let left = prefix();
    for (;;) {
      const t = peek();
      if (!t) break;
      if (t.t === 'op' && (t.v === '!' || t.v === '%')) {
        if (POSTFIX_PREC < minPrec) break;
        next();
        left = { k: 'post', op: t.v, a: left };
        continue;
      }
      if (t.t === 'op') {
        const prec = BIN_PREC[t.v];
        if (prec < minPrec) break;
        next();
        if (!peek()) throw new MathError(`"${t.v}" needs a number after it`, t.pos);
        const right = expr(t.v === '^' ? prec : prec + 1);
        left = { k: 'bin', op: t.v as '+' | '-' | '*' | '/' | '^', a: left, b: right };
        continue;
      }
      if (startsOperand(t)) {
        // implicit multiplication binds like *
        if (BIN_PREC['*'] < minPrec) break;
        const right = expr(BIN_PREC['*'] + 1);
        left = { k: 'bin', op: '*', a: left, b: right };
        continue;
      }
      break;
    }
    return left;
  }

  const tree = expr(0);
  if (p < tokens.length) {
    const t = tokens[p];
    if (t.t === ')') throw new MathError('There is a closing bracket without an opening one', t.pos);
    throw new MathError('Something is missing between two parts of the expression', t.pos);
  }
  return tree;
}

const EPS = 1e-12;
const toRad = (x: number, mode: AngleMode) => (mode === 'deg' ? (x * Math.PI) / 180 : x);
const fromRad = (x: number, mode: AngleMode) => (mode === 'deg' ? (x * 180) / Math.PI : x);

// Exact answers for whole multiples of 90° so sin(180) is 0, not 1.2e-16.
function trig(fn: 'sin' | 'cos' | 'tan', x: number, mode: AngleMode): number {
  if (mode === 'deg' && Number.isInteger(x) && x % 90 === 0) {
    const q = (((x / 90) % 4) + 4) % 4;
    if (fn === 'sin') return [0, 1, 0, -1][q];
    if (fn === 'cos') return [1, 0, -1, 0][q];
    if (q % 2 === 1) throw new MathError(`tan(${x}°) is undefined`);
    return 0;
  }
  const r = toRad(x, mode);
  const v = fn === 'sin' ? Math.sin(r) : fn === 'cos' ? Math.cos(r) : Math.tan(r);
  if (fn === 'tan' && Math.abs(Math.cos(r)) < EPS) throw new MathError('tan is undefined at this angle');
  return Math.abs(v) < EPS ? 0 : v;
}

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new MathError('Factorial needs a whole number 0 or bigger');
  if (n > 170) throw new MathError('Factorial is too large to show (max 170!)');
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export interface EvalOptions {
  angle?: AngleMode;
  ans?: number;
}

export function evaluateNode(node: Node, opts: EvalOptions = {}): number {
  const mode = opts.angle ?? 'deg';
  const ev = (n: Node): number => {
    switch (n.k) {
      case 'num':
        return n.v;
      case 'const':
        if (n.v === 'pi') return Math.PI;
        if (n.v === 'e') return Math.E;
        if (opts.ans === undefined) throw new MathError('There is no previous answer yet');
        return opts.ans;
      case 'neg':
        return -ev(n.a);
      case 'post': {
        const a = ev(n.a);
        return n.op === '%' ? a / 100 : factorial(a);
      }
      case 'bin': {
        const a = ev(n.a);
        const b = ev(n.b);
        switch (n.op) {
          case '+':
            return a + b;
          case '-':
            return a - b;
          case '*':
            return a * b;
          case '/':
            if (b === 0) throw new MathError("Can't divide by zero");
            return a / b;
          case '^': {
            if (a === 0 && b < 0) throw new MathError("Can't raise 0 to a negative power");
            const r = Math.pow(a, b);
            if (Number.isNaN(r)) throw new MathError('A negative number to a fractional power is not a real number');
            return r;
          }
        }
        throw new MathError('Unknown operator');
      }
      case 'call': {
        const a = ev(n.a);
        switch (n.fn) {
          case 'sin':
          case 'cos':
          case 'tan':
            return trig(n.fn, a, mode);
          case 'asin':
          case 'acos':
            if (a < -1 || a > 1) throw new MathError(`${n.fn === 'asin' ? 'sin⁻¹' : 'cos⁻¹'} only takes values from -1 to 1`);
            return fromRad(n.fn === 'asin' ? Math.asin(a) : Math.acos(a), mode);
          case 'atan':
            return fromRad(Math.atan(a), mode);
          case 'sqrt':
            if (a < 0) throw new MathError('The square root of a negative number is not a real number');
            return Math.sqrt(a);
          case 'cbrt':
            return Math.cbrt(a);
          case 'log':
            if (a <= 0) throw new MathError('log only takes numbers greater than 0');
            return Math.log10(a);
          case 'ln':
            if (a <= 0) throw new MathError('ln only takes numbers greater than 0');
            return Math.log(a);
          case 'abs':
            return Math.abs(a);
        }
        throw new MathError('Unknown function');
      }
    }
    throw new MathError('Could not work that out');
  };
  const result = ev(node);
  if (!Number.isFinite(result)) throw new MathError('The answer is too large to show');
  return result;
}

export function evaluate(src: string, opts: EvalOptions = {}): number {
  return evaluateNode(parse(src), opts);
}

/** Rounds away floating-point noise (0.1 + 0.2 -> 0.3) and picks a readable form. */
export function formatNumber(n: number, sig = 12): string {
  if (!Number.isFinite(n)) throw new MathError('The answer is too large to show');
  if (n === 0) return '0';
  const r = Number(n.toPrecision(sig));
  const abs = Math.abs(r);
  if (abs >= 1e15 || abs < 1e-9) {
    const [mant, exp] = r.toExponential(sig - 1).split('e');
    const m = mant.includes('.') ? mant.replace(/0+$/, '').replace(/\.$/, '') : mant;
    return `${m}e${exp.replace('+', '')}`;
  }
  return String(r);
}
