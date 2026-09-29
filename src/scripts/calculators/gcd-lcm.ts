import { mountForm, FieldError, type Line } from '../calc-form.ts';
import { euclidSteps, formatFactors, gcd, lcm, parseNumberList, primeFactors } from '../../lib/math/number.ts';
import { MathError } from '../../lib/math/expression.ts';

const MAX = 1e12;

export function mountGcdLcm(kind: 'gcd' | 'lcm') {
  const form = document.getElementById(`${kind}-form`) as HTMLFormElement;
  mountForm(form, (r) => {
    let nums: number[];
    try {
      nums = parseNumberList(r.text('nums', 'some whole numbers'));
    } catch (e) {
      if (e instanceof FieldError) throw e;
      throw new FieldError('nums', e instanceof MathError ? e.message : 'Some of those are not numbers');
    }
    if (nums.length < 2) throw new FieldError('nums', 'Enter at least two numbers');
    if (nums.length > 20) throw new FieldError('nums', 'Enter 20 numbers or fewer');
    for (const n of nums) {
      if (!Number.isInteger(n) || n <= 0) throw new FieldError('nums', `${n} is not a positive whole number`);
      if (n > MAX) throw new FieldError('nums', `${n} is too large (limit 1,000,000,000,000)`);
    }

    const steps: string[] = [];
    let acc = nums[0];
    for (let i = 1; i < nums.length; i++) {
      const b = nums[i];
      const g = gcd(acc, b);
      if (kind === 'gcd') {
        const es = euclidSteps(acc, b);
        steps.push(`GCD(${acc}, ${b}) by the Euclidean algorithm:`);
        es.forEach((s) => steps.push(`${s.a} = ${s.q} × ${s.b} + ${s.r}`));
        steps.push(`The last non-zero remainder is ${g}, so GCD(${acc}, ${b}) = ${g}`);
        acc = g;
      } else {
        const l = lcm(acc, b);
        if (l > Number.MAX_SAFE_INTEGER) throw new FieldError('nums', 'The LCM is too large to show exactly');
        steps.push(`LCM(${acc}, ${b}) = ${acc} × ${b} ÷ GCD(${acc}, ${b}) = ${acc * b} ÷ ${g} = ${l}`);
        acc = l;
      }
    }

    const lines: Line[] = [{ label: `${kind.toUpperCase()}(${nums.join(', ')})`, value: String(acc), primary: true }];
    if (kind === 'gcd') lines.push({ label: `LCM`, value: String(nums.reduce((a, b) => lcm(a, b))) });
    else lines.push({ label: `GCD`, value: String(nums.reduce((a, b) => gcd(a, b))) });
    nums.slice(0, 6).forEach((n) => lines.push({ label: `${n} =`, value: n === 1 ? '1' : formatFactors(primeFactors(n)) }));
    return { lines, steps };
  });
}
