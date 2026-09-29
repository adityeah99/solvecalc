// Shared behaviour for form-based calculators: reading and validating inputs,
// showing/hiding fields per mode, live results, errors, steps, reset and copy.
import { MathError } from '../lib/math/expression.ts';
import { parseNumber } from '../lib/math/number.ts';

export interface Line {
  label: string;
  value: string;
  primary?: boolean;
}
export type Outcome =
  | { lines: Line[]; steps?: string[]; note?: string }
  | { empty: true };

/** Thrown when a field is invalid; the message is shown next to that field. */
export class FieldError extends Error {
  field: string;
  missing: boolean;
  constructor(field: string, message: string, missing = false) {
    super(message);
    this.field = field;
    this.missing = missing;
  }
}

export interface Reader {
  /** Value of a radio group or field. */
  value(name: string): string;
  /** Raw text of a field (trimmed). */
  text(name: string, label: string): string;
  /** A number; fractions like 3/4 are accepted. */
  num(name: string, label: string, opts?: { min?: number; max?: number; integer?: boolean; positive?: boolean; nonZero?: boolean }): number;
  /** Optional number: returns null when the field is blank. */
  optNum(name: string, label: string): number | null;
}

export function mountForm(form: HTMLFormElement, compute: (r: Reader) => Outcome) {
  const col = document.querySelector<HTMLElement>(`[data-result-for="${form.id}"]`)!;
  const $ = <T extends Element>(s: string) => col.querySelector<T>(s)!;
  const emptyEl = $<HTMLElement>('[data-empty]');
  const linesEl = $<HTMLDListElement>('[data-lines]');
  const noteEl = $<HTMLElement>('[data-note]');
  const errEl = $<HTMLElement>('[data-err]');
  const copyBtn = $<HTMLButtonElement>('[data-copy]');
  const stepsWrap = $<HTMLElement>('[data-steps-wrap]');
  const stepsEl = $<HTMLOListElement>('[data-steps]');
  let primaryValue = '';

  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | RadioNodeList | null;

  // Fields are shown only for the mode they belong to: data-when="mode:a|b".
  function applyWhen() {
    form.querySelectorAll<HTMLElement>('[data-when]').forEach((el) => {
      const [name, values] = el.dataset.when!.split(':');
      const show = values.split('|').includes(readValue(name));
      el.hidden = !show;
      el.querySelectorAll<HTMLInputElement>('input, textarea, select').forEach((i) => (i.disabled = !show));
    });
  }

  function readValue(name: string): string {
    const f = field(name);
    if (!f) return '';
    return 'value' in f ? String(f.value ?? '') : '';
  }

  const reader: Reader = {
    value: readValue,
    text(name, label) {
      const v = readValue(name).trim();
      if (!v) throw new FieldError(name, `Enter ${label}`, true);
      return v;
    },
    num(name, label, opts = {}) {
      const raw = readValue(name).trim();
      if (!raw) throw new FieldError(name, `Enter ${label}`, true);
      let v: number;
      try {
        v = parseNumber(raw, 'value');
      } catch (e) {
        throw new FieldError(name, (e as Error).message);
      }
      if (opts.integer && !Number.isInteger(v)) throw new FieldError(name, `${cap(label)} must be a whole number`);
      if (opts.positive && v <= 0) throw new FieldError(name, `${cap(label)} must be greater than 0`);
      if (opts.nonZero && v === 0) throw new FieldError(name, `${cap(label)} can't be 0`);
      if (opts.min !== undefined && v < opts.min) throw new FieldError(name, `${cap(label)} must be at least ${opts.min}`);
      if (opts.max !== undefined && v > opts.max) throw new FieldError(name, `${cap(label)} must be at most ${opts.max}`);
      return v;
    },
    optNum(name, label) {
      return readValue(name).trim() ? reader.num(name, label) : null;
    },
  };

  function clearErrors() {
    form.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute('aria-invalid'));
    form.querySelectorAll<HTMLElement>('[data-field-error]').forEach((el) => {
      el.hidden = true;
      el.textContent = '';
    });
    errEl.hidden = true;
    errEl.textContent = '';
  }

  function showEmpty() {
    emptyEl.hidden = false;
    linesEl.hidden = true;
    noteEl.hidden = true;
    copyBtn.hidden = true;
    stepsWrap.hidden = true;
    col.classList.remove('has-result');
  }

  function showError(e: unknown) {
    showEmpty();
    emptyEl.hidden = true;
    const known = e instanceof FieldError || e instanceof MathError;
    if (!known) console.error(e);
    const msg = known ? e.message : 'Something went wrong with those values.';
    errEl.textContent = msg;
    errEl.hidden = false;
    if (e instanceof FieldError) {
      const input = form.querySelector<HTMLElement>(`[name="${CSS.escape(e.field)}"]:not([type="radio"])`);
      if (input) {
        input.setAttribute('aria-invalid', 'true');
        const fe = input.closest('.field')?.querySelector<HTMLElement>('[data-field-error]');
        if (fe) {
          fe.textContent = e.message;
          fe.hidden = false;
        }
      }
    }
  }

  function render(o: Outcome) {
    if ('empty' in o) return showEmpty();
    emptyEl.hidden = true;
    linesEl.replaceChildren(
      ...o.lines.map((l) => {
        const row = document.createElement('div');
        row.className = l.primary ? 'result-line is-primary' : 'result-line';
        const dt = document.createElement('dt');
        dt.textContent = l.label;
        const dd = document.createElement('dd');
        writeValue(dd, prettyMinus(l.value), Boolean(l.primary));
        row.append(dt, dd);
        return row;
      }),
    );
    linesEl.hidden = false;
    const primary = o.lines.find((l) => l.primary) ?? o.lines[0];
    primaryValue = primary?.value ?? '';
    copyBtn.hidden = !primaryValue;
    noteEl.textContent = o.note ?? '';
    noteEl.hidden = !o.note;
    if (o.steps?.length) {
      stepsEl.replaceChildren(
        ...o.steps.map((s) => {
          const li = document.createElement('li');
          li.textContent = prettyMinus(s);
          return li;
        }),
      );
      stepsWrap.hidden = false;
    } else stepsWrap.hidden = true;
    col.classList.add('has-result');
  }

  function run(mode: 'live' | 'submit') {
    clearErrors();
    try {
      render(compute(reader));
    } catch (e) {
      // While typing, a blank field just means "not finished yet".
      if (mode === 'live' && e instanceof FieldError && e.missing) return showEmpty();
      if (mode === 'live' && e instanceof FieldError && !anyFilled()) return showEmpty();
      showError(e);
    }
  }

  const anyFilled = () =>
    [...form.querySelectorAll<HTMLInputElement>('input.input, textarea')].some((i) => !i.disabled && i.value.trim());

  let t: ReturnType<typeof setTimeout> | undefined;
  form.addEventListener('input', (e) => {
    if ((e.target as HTMLInputElement).type === 'radio') return;
    clearTimeout(t);
    t = setTimeout(() => run('live'), 120);
  });
  form.addEventListener('change', (e) => {
    if ((e.target as HTMLInputElement).type !== 'radio') return;
    applyWhen();
    run('live');
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run('submit');
  });
  form.addEventListener('reset', () => {
    // Let the browser restore default values first.
    setTimeout(() => {
      clearErrors();
      applyWhen();
      showEmpty();
    });
  });
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(primaryValue);
      copyBtn.textContent = 'Copied';
    } catch {
      copyBtn.textContent = 'Copy blocked';
    }
    setTimeout(() => (copyBtn.textContent = 'Copy answer'), 1500);
  });

  applyWhen();
  if (anyFilled()) run('live');
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Typographic minus for negative numbers ("-3" -> "−3"); hyphens in words are left alone. */
const prettyMinus = (s: string) => s.replace(/(^|[\s(=:,/×÷^])-(?=[\d.(])/g, '$1−');

/** Writes a value, drawing "a/b" as a stacked fraction in the main answer. */
function writeValue(el: HTMLElement, value: string, stacked: boolean) {
  const m = value.match(/^(−|-)?(\d+ )?(\d+)\/(\d+)$/);
  if (!stacked || !m) {
    el.textContent = value;
    return;
  }
  el.textContent = `${m[1] ? '−' : ''}${m[2] ?? ''}`;
  const frac = document.createElement('span');
  frac.className = 'frac';
  const top = document.createElement('span');
  top.textContent = m[3];
  const bottom = document.createElement('span');
  bottom.textContent = m[4];
  frac.append(top, bottom);
  frac.setAttribute('aria-label', `${m[3]} over ${m[4]}`);
  el.append(frac);
}

/** Number formatting for calculator output: rounds floating noise, keeps it readable. */
export function fmt(n: number, sig = 10): string {
  if (!Number.isFinite(n)) throw new MathError('The answer is too large to show');
  if (n === 0) return '0';
  const r = Number(n.toPrecision(sig));
  const abs = Math.abs(r);
  if (abs >= 1e15 || abs < 1e-7) return r.toExponential(6).replace(/\.?0+e/, 'e').replace('e+', 'e');
  return r.toLocaleString('en-US', { maximumFractionDigits: 10 }).replace(/^-/, '−');
}
