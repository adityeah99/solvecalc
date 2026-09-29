// Timed rounds engine for Sum Sprint, Solve for X, Fraction Face-off,
// Prime Time, Average Aim and Odds On. Questions come from lib/mathgames/rounds.ts.
import { ROUND_MAKERS, type Level, type Round, type Visual } from '../../lib/mathgames/rounds.ts';
import { readBest, writeBest } from './store.ts';

const SVG = 'http://www.w3.org/2000/svg';
const MARBLE = { red: '#b83226', blue: '#2340b8', green: '#1b7443' } as const;

export function mountRapid(root: HTMLElement) {
  const slug = root.dataset.rapid!;
  const make = ROUND_MAKERS[slug];
  const mode = root.dataset.mode as 'input' | 'choice';
  const seconds = Number(root.dataset.seconds) || 60;
  const $ = <T extends Element>(s: string) => root.querySelector<T>(s)!;
  const views = { start: $<HTMLElement>('[data-view="start"]'), play: $<HTMLElement>('[data-view="play"]'), end: $<HTMLElement>('[data-view="end"]') };
  const timeEl = $<HTMLElement>('[data-time]');
  const timebar = $<HTMLElement>('[data-timebar]');
  const scoreEl = $<HTMLElement>('[data-score]');
  const streakEl = $<HTMLElement>('[data-streak]');
  const bestEl = $<HTMLElement>('[data-best]');
  const promptEl = $<HTMLElement>('[data-prompt]');
  const visualEl = $<HTMLElement>('[data-visual]');
  const entryEl = root.querySelector<HTMLElement>('[data-entry]');
  const flashEl = $<HTMLElement>('[data-flash]');
  const choicesEl = root.querySelector<HTMLElement>('[data-choices]');
  const pad = $<HTMLElement>('[data-pad]');

  let level: Level = 1;
  let round: Round | null = null;
  let entry = '';
  let score = 0;
  let streak = 0;
  let attempts = 0;
  let missed: Round[] = [];
  let busy = false;
  let playing = false;
  let remaining = seconds * 1000;
  let lastTick = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const bestKey = () => (root.dataset.levels ? `${slug}:${level}` : slug);
  const showBest = () => {
    const b = readBest(bestKey());
    bestEl.textContent = b === null ? '–' : String(b);
    const line = root.querySelector<HTMLElement>('[data-best-line]');
    if (line) line.textContent = b === null ? '' : `Your best${root.dataset.levels ? ' on this level' : ''}: ${b}`;
  };

  root.querySelectorAll<HTMLInputElement>('input[name="level"]').forEach((r) =>
    r.addEventListener('change', () => {
      level = Number(r.value) as Level;
      showBest();
    }),
  );

  function view(name: keyof typeof views) {
    for (const [k, el] of Object.entries(views)) el.hidden = k !== name;
    pad.hidden = name !== 'play';
  }

  function hud() {
    const s = Math.ceil(remaining / 1000);
    timeEl.textContent = String(Math.max(0, s));
    timebar.style.transform = `scaleX(${Math.max(0, remaining / (seconds * 1000))})`;
    root.classList.toggle('is-low', remaining <= 10000 && playing);
    scoreEl.textContent = String(score);
    streakEl.textContent = String(streak);
  }

  function tick() {
    const now = performance.now();
    remaining -= now - lastTick;
    lastTick = now;
    if (remaining <= 0) {
      remaining = 0;
      finish();
    }
    hud();
  }

  function start() {
    score = streak = attempts = 0;
    missed = [];
    remaining = seconds * 1000;
    playing = true;
    view('play');
    next();
    lastTick = performance.now();
    clearInterval(timer);
    timer = setInterval(tick, 100);
    hud();
    if (mode === 'input') pad.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    else choicesEl?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  }

  function next() {
    round = make(Math.random, level);
    entry = '';
    busy = false;
    flashEl.textContent = '';
    flashEl.className = 'mg-flash';
    renderRound(round);
  }

  function renderRound(r: Round) {
    const single = r.visual?.kind === 'numbers' && r.visual.values.length === 1;
    promptEl.textContent = single ? String((r.visual as { values: number[] }).values[0]) : r.prompt;
    promptEl.classList.toggle('is-big', single || mode === 'input');
    visualEl.replaceChildren(...(r.visual && !single ? drawVisual(r.visual) : []));
    if (single) {
      const q = document.createElement('p');
      q.className = 'mg-sub';
      q.textContent = r.prompt;
      visualEl.append(q);
    }
    if (entryEl) entryEl.textContent = '';
    if (choicesEl && r.choices) {
      choicesEl.dataset.n = String(r.choices.length);
      choicesEl.replaceChildren(
        ...r.choices.map((c, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'mg-choice';
          b.dataset.value = c;
          const k = document.createElement('span');
          k.className = 'mg-choice-key';
          k.textContent = String(i + 1);
          k.setAttribute('aria-hidden', 'true');
          const t = document.createElement('span');
          t.textContent = c;
          b.append(k, t);
          b.addEventListener('click', () => answer(c));
          return b;
        }),
      );
    }
  }

  function answer(value: string) {
    if (!playing || busy || !round) return;
    if (mode === 'input' && value === '') return;
    busy = true;
    attempts++;
    const right = normalize(value) === normalize(round.answer);
    choicesEl?.querySelectorAll<HTMLButtonElement>('.mg-choice').forEach((b) => {
      b.disabled = true;
      if (b.dataset.value === round!.answer) b.classList.add('is-right');
      else if (b.dataset.value === value) b.classList.add('is-wrong');
    });
    if (right) {
      score++;
      streak++;
      flashEl.textContent = streak >= 3 ? `Correct · ${streak} in a row` : 'Correct';
      flashEl.className = 'mg-flash is-right';
      hud();
      setTimeout(() => playing && next(), 350);
    } else {
      streak = 0;
      missed.push(round);
      flashEl.textContent = `Answer: ${round.answer}. ${round.explain}`;
      flashEl.className = 'mg-flash is-wrong';
      hud();
      setTimeout(() => playing && next(), 1800);
    }
  }

  function finish() {
    if (!playing) return;
    playing = false;
    clearInterval(timer);
    const prev = readBest(bestKey());
    const isBest = prev === null || score > prev;
    if (isBest) writeBest(bestKey(), score);
    showBest();
    $<HTMLElement>('[data-final]').textContent = String(score);
    $<HTMLElement>('[data-final-line]').textContent =
      attempts === 0
        ? 'No answers this time.'
        : `${score} right out of ${attempts} (${Math.round((score / attempts) * 100)}%).${isBest && score > 0 ? ' New best!' : ''}`;
    const list = $<HTMLUListElement>('[data-missed]');
    list.replaceChildren(
      ...missed.slice(-5).map((r) => {
        const li = document.createElement('li');
        li.textContent = `${r.visual?.kind === 'fractions' ? `${r.visual.left.join('/')} vs ${r.visual.right.join('/')}` : r.prompt} → ${r.answer}. ${r.explain}`;
        return li;
      }),
    );
    $<HTMLElement>('[data-missed-wrap]').hidden = missed.length === 0;
    view('end');
    $<HTMLButtonElement>('[data-again]').focus({ preventScroll: true });
  }

  // Number pad (input mode)
  function press(key: string) {
    if (!playing || busy) return;
    if (key === 'enter') return answer(entry);
    if (key === 'back') entry = entry.slice(0, -1);
    else if (key === '-') entry = entry.startsWith('-') ? entry.slice(1) : `-${entry}`;
    else if (/^\d$/.test(key) && entry.replace('-', '').length < 6) entry += key;
    if (entryEl) entryEl.textContent = entry.replace('-', '−');
  }
  pad.querySelectorAll<HTMLButtonElement>('[data-key]').forEach((b) => b.addEventListener('click', () => press(b.dataset.key!)));

  document.addEventListener('keydown', (e) => {
    if (!playing || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement;
    if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;
    if (mode === 'input') {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('back');
      else if (e.key === '-' || e.key === '−') press('-');
      else if (e.key === 'Enter') press('enter');
      else return;
      e.preventDefault();
    } else {
      const i = Number(e.key) - 1;
      const btn = choicesEl?.querySelectorAll<HTMLButtonElement>('.mg-choice')[i];
      if (btn) {
        e.preventDefault();
        btn.click();
      }
    }
  });

  // Don't let the clock run while the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (!playing) return;
    if (document.hidden) clearInterval(timer);
    else {
      lastTick = performance.now();
      timer = setInterval(tick, 100);
    }
  });

  $<HTMLButtonElement>('[data-start]').addEventListener('click', start);
  $<HTMLButtonElement>('[data-again]').addEventListener('click', start);
  $<HTMLButtonElement>('[data-stop]').addEventListener('click', finish);
  view('start');
  showBest();
  hud();
}

const normalize = (s: string) => s.replace(/−/g, '-').replace(/^\+/, '').replace(/^-0$/, '0').trim();

function drawVisual(v: Visual): Element[] {
  if (v.kind === 'fractions') {
    const wrap = document.createElement('div');
    wrap.className = 'mg-fracs';
    const f = ([n, d]: [number, number]) => {
      const s = document.createElement('span');
      s.className = 'frac mg-frac';
      s.setAttribute('aria-label', `${n} over ${d}`);
      const a = document.createElement('span');
      a.textContent = String(n);
      const b = document.createElement('span');
      b.textContent = String(d);
      s.append(a, b);
      return s;
    };
    const vs = document.createElement('span');
    vs.className = 'mg-vs';
    vs.textContent = 'vs';
    wrap.append(f(v.left), vs, f(v.right));
    return [wrap];
  }
  if (v.kind === 'numbers') {
    const row = document.createElement('div');
    row.className = 'mg-tiles';
    for (const n of v.values) {
      const t = document.createElement('span');
      t.className = 'mg-tile';
      t.textContent = String(n);
      row.append(t);
    }
    return [row];
  }
  // marbles in a jar
  const entries = (Object.keys(MARBLE) as (keyof typeof MARBLE)[]).flatMap((c) => Array(v.counts[c]).fill(c) as string[]);
  const cols = 5;
  const r = 11;
  const rows = Math.ceil(entries.length / cols);
  const w = 150;
  const h = 40 + rows * 26;
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('class', 'mg-jar');
  svg.setAttribute('role', 'img');
  const desc = (Object.keys(MARBLE) as (keyof typeof MARBLE)[]).filter((c) => v.counts[c]).map((c) => `${v.counts[c]} ${c}`).join(', ');
  svg.setAttribute('aria-label', `A bag with ${desc} marbles`);
  const jar = document.createElementNS(SVG, 'path');
  jar.setAttribute('d', `M18 12 H${w - 18} V${h - 14} Q${w - 18} ${h - 4} ${w - 30} ${h - 4} H30 Q18 ${h - 4} 18 ${h - 14} Z`);
  jar.setAttribute('fill', 'rgba(255,255,255,0.35)');
  jar.setAttribute('stroke', '#17220f');
  jar.setAttribute('stroke-width', '2');
  svg.append(jar);
  entries.forEach((c, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const inRow = Math.min(cols, entries.length - row * cols);
    const x = w / 2 + (col - (inRow - 1) / 2) * 24;
    const y = h - 26 - row * 26;
    const circle = document.createElementNS(SVG, 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', String(r));
    circle.setAttribute('fill', MARBLE[c as keyof typeof MARBLE]);
    circle.setAttribute('stroke', '#0e151f');
    circle.setAttribute('stroke-width', '1.5');
    svg.append(circle);
  });
  const legend = document.createElement('p');
  legend.className = 'mg-legend';
  legend.textContent = desc.replace(/(\d+) (\w+)/g, '$1 $2');
  return [svg, legend];
}
