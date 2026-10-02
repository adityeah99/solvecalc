import { mountForm, FieldError, fmt } from '../calc-form.ts';

const form = document.getElementById('graph-form') as HTMLFormElement;
const canvas = document.getElementById('graph-canvas') as HTMLCanvasElement;

// Whitelisted function words mapped to their Math.* equivalents.
const WORDS: Record<string, string> = {
  sin: 'Math.sin',
  cos: 'Math.cos',
  tan: 'Math.tan',
  sqrt: 'Math.sqrt',
  abs: 'Math.abs',
  ln: 'Math.log',
  log: 'Math.log10',
  pi: 'Math.PI',
  e: 'Math.E',
};

/** Compile the user's expression into a function of x, rejecting anything unsafe. */
function compileFn(raw: string): (x: number) => number {
  const src = raw.trim();
  if (!src) throw new FieldError('fn', 'Enter a function of x, like x^2 - 3');
  if (!/^(?:\d+\.?\d*|\.\d+|x|\+|-|\*|\/|\(|\)|\^|,|sin|cos|tan|sqrt|abs|ln|log|pi|e|\s)+$/.test(src)) {
    throw new FieldError(
      'fn',
      'Only x, numbers, + - * / ^ ( ) , and the words sin cos tan sqrt abs ln log pi e are allowed'
    );
  }
  const js = src.replace(/\^/g, '**').replace(/\b(sin|cos|tan|sqrt|abs|ln|log|pi|e)\b/g, (w) => WORDS[w]);
  try {
    return new Function('x', `'use strict'; return (${js});`) as (x: number) => number;
  } catch {
    throw new FieldError('fn', 'That expression could not be understood — check the brackets');
  }
}

interface PlotState {
  f: (x: number) => number;
  xmin: number;
  xmax: number;
  label: string;
}
let lastGood: PlotState | null = null;

function field(name: string): HTMLInputElement {
  return form.elements.namedItem(name) as HTMLInputElement;
}

/** Pick a readable tick spacing for an axis span. */
function niceStep(span: number): number {
  const raw = span / 8;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n >= 5 ? 10 : n >= 2 ? 5 : n >= 1 ? 2 : 1) * mag;
}

function drawGraph() {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  let xmin = parseFloat(field('xmin').value);
  let xmax = parseFloat(field('xmax').value);
  if (!Number.isFinite(xmin)) xmin = -10;
  if (!Number.isFinite(xmax)) xmax = 10;
  if (xmax <= xmin) xmax = xmin + 1;

  try {
    lastGood = { f: compileFn(field('fn').value), xmin, xmax, label: field('fn').value.trim() };
  } catch {
    // Keep the last good plot so a half-typed expression never blanks the graph.
  }
  const state: PlotState = lastGood ?? { f: (x) => x * x - 3, xmin: -10, xmax: 10, label: 'x^2 - 3' };

  // Find the y range by sampling.
  const N = 400;
  let ymin = Infinity;
  let ymax = -Infinity;
  for (let i = 0; i <= N; i++) {
    const x = state.xmin + ((state.xmax - state.xmin) * i) / N;
    let y: number;
    try {
      y = state.f(x);
    } catch {
      continue;
    }
    if (Number.isFinite(y)) {
      if (y < ymin) ymin = y;
      if (y > ymax) ymax = y;
    }
  }
  if (!Number.isFinite(ymin) || !Number.isFinite(ymax)) {
    ymin = -1;
    ymax = 1;
  }
  const pad = Math.max((ymax - ymin) * 0.1, 1e-9);
  ymin -= pad;
  ymax += pad;

  const X = (x: number) => ((x - state.xmin) / (state.xmax - state.xmin)) * W;
  const Y = (y: number) => H - ((y - ymin) / (ymax - ymin)) * H;

  // Grid + tick labels.
  ctx.font = '11px system-ui, sans-serif';
  ctx.textBaseline = 'top';
  const xStep = niceStep(state.xmax - state.xmin);
  ctx.strokeStyle = '#e2e8f0';
  ctx.fillStyle = '#64748b';
  ctx.lineWidth = 1;
  for (let gx = Math.ceil(state.xmin / xStep) * xStep; gx <= state.xmax; gx += xStep) {
    const px = Math.round(X(gx)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, H);
    ctx.stroke();
    ctx.fillText(fmt(gx), px + 4, 4);
  }
  const yStep = niceStep(ymax - ymin);
  ctx.textBaseline = 'middle';
  for (let gy = Math.ceil(ymin / yStep) * yStep; gy <= ymax; gy += yStep) {
    const py = Math.round(Y(gy)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(W, py);
    ctx.stroke();
    ctx.fillText(fmt(gy), 4, py - 10);
  }

  // Axes.
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  if (state.xmin <= 0 && state.xmax >= 0) {
    const px = Math.round(X(0)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, H);
    ctx.stroke();
  }
  if (ymin <= 0 && ymax >= 0) {
    const py = Math.round(Y(0)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(W, py);
    ctx.stroke();
  }

  // Curve; break the path wherever the function is not finite.
  ctx.strokeStyle = '#d43d3d';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  let pen = false;
  for (let i = 0; i <= N; i++) {
    const x = state.xmin + ((state.xmax - state.xmin) * i) / N;
    let y: number;
    try {
      y = state.f(x);
    } catch {
      y = NaN;
    }
    if (!Number.isFinite(y)) {
      pen = false;
      continue;
    }
    const px = X(x);
    const py = Y(y);
    if (!pen) {
      ctx.moveTo(px, py);
      pen = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // Label.
  ctx.fillStyle = '#334155';
  ctx.font = '13px system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText(`y = ${state.label}`, 8, H - 22);
}

mountForm(form, (r) => {
  const raw = r.text('fn', 'a function');
  const f = compileFn(raw);
  const xmin = r.num('xmin', 'x min');
  const xmax = r.num('xmax', 'x max');
  if (xmax <= xmin) throw new FieldError('xmax', 'x max must be greater than x min');

  drawGraph();

  const y0 = f(0);
  const yMin = f(xmin);
  const yMax = f(xmax);
  const lines = [
    { label: 'y at x = 0', value: Number.isFinite(y0) ? fmt(y0) : 'undefined', primary: true },
    { label: `y at x = ${fmt(xmin)}`, value: Number.isFinite(yMin) ? fmt(yMin) : 'undefined' },
    { label: `y at x = ${fmt(xmax)}`, value: Number.isFinite(yMax) ? fmt(yMax) : 'undefined' },
  ];
  return {
    lines,
    steps: [
      `Plotted y = ${raw.trim()} from x = ${fmt(xmin)} to x = ${fmt(xmax)}.`,
      `At x = 0 the curve passes through y = ${Number.isFinite(y0) ? fmt(y0) : 'undefined (a gap in the graph)'}.`,
    ],
  };
});

// Draw the default function on first load, before any input changes.
try {
  drawGraph();
} catch {
  // Canvas not ready; the form's first compute will draw it.
}
