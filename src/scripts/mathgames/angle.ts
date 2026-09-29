import { readBest, writeBest } from './store.ts';

const SVG = 'http://www.w3.org/2000/svg';
const ROUNDS = 10;
const R = 100;

/** 100 points within 2°, then 4 fewer per extra degree. */
export const anglePoints = (diff: number) => (diff <= 2 ? 100 : Math.max(0, Math.round(100 - 4 * (diff - 2))));

export function mountAngle(root: HTMLElement) {
  const $ = <T extends Element>(s: string) => root.querySelector<T>(s)!;
  const views = { start: $<HTMLElement>('[data-view="start"]'), play: $<HTMLElement>('[data-view="play"]'), end: $<HTMLElement>('[data-view="end"]') };
  const svg = $<SVGSVGElement>('[data-svg]');
  const slider = $<HTMLInputElement>('[data-slider]');
  const num = $<HTMLInputElement>('[data-num]');
  const out = $<HTMLOutputElement>('[data-out]');
  const lock = $<HTMLButtonElement>('[data-lock]');
  const nextBtn = $<HTMLButtonElement>('[data-next]');
  const result = $<HTMLElement>('[data-result]');
  const pad = $<HTMLElement>('[data-pad]');

  let round = 0;
  let score = 0;
  let angle = 0;
  let start = 0;
  let locked = false;

  const view = (name: keyof typeof views) => {
    for (const [k, el] of Object.entries(views)) el.hidden = k !== name;
    pad.hidden = name !== 'play';
  };
  const showBest = () => {
    const b = readBest('angle-hunter');
    $<HTMLElement>('[data-best]').textContent = b === null ? '–' : String(b);
    $<HTMLElement>('[data-best-line]').textContent = b === null ? '' : `Your best: ${b} / ${ROUNDS * 100}`;
  };
  const hud = () => {
    $<HTMLElement>('[data-round]').textContent = `${round}/${ROUNDS}`;
    $<HTMLElement>('[data-score]').textContent = String(score);
  };

  const pt = (deg: number, r = R) => {
    const a = (deg * Math.PI) / 180;
    return [Math.cos(a) * r, -Math.sin(a) * r];
  };
  const el = (name: string, attrs: Record<string, string | number>) => {
    const e = document.createElementNS(SVG, name);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    return e;
  };
  const arc = (from: number, sweep: number, r: number) => {
    const [x1, y1] = pt(from, r);
    const [x2, y2] = pt(from + sweep, r);
    return `M${x1} ${y1} A${r} ${r} 0 ${sweep > 180 ? 1 : 0} 0 ${x2} ${y2}`;
  };

  function draw(guess?: number) {
    svg.replaceChildren();
    const [ax, ay] = pt(start);
    const [bx, by] = pt(start + angle);
    svg.append(el('path', { d: arc(start, angle, 28), fill: 'none', stroke: '#2340b8', 'stroke-width': 3 }));
    svg.append(el('line', { x1: 0, y1: 0, x2: ax, y2: ay, stroke: '#17220f', 'stroke-width': 4, 'stroke-linecap': 'round' }));
    svg.append(el('line', { x1: 0, y1: 0, x2: bx, y2: by, stroke: '#17220f', 'stroke-width': 4, 'stroke-linecap': 'round' }));
    if (guess !== undefined) {
      const [gx, gy] = pt(start + guess);
      svg.append(el('line', { x1: 0, y1: 0, x2: gx, y2: gy, stroke: '#b83226', 'stroke-width': 3, 'stroke-dasharray': '6 5', 'stroke-linecap': 'round' }));
    }
    svg.append(el('circle', { cx: 0, cy: 0, r: 5, fill: '#17220f' }));
  }

  function setGuess(v: number) {
    const g = Math.max(0, Math.min(360, Math.round(v) || 0));
    slider.value = String(g);
    if (document.activeElement !== num) num.value = String(g);
    out.textContent = `${g}°`;
  }

  function newRound() {
    round++;
    locked = false;
    angle = 10 + Math.floor(Math.random() * 341); // 10°–350°
    start = Math.floor(Math.random() * 360);
    setGuess(90);
    num.value = '90';
    result.textContent = '';
    result.className = 'mg-flash';
    lock.hidden = false;
    nextBtn.hidden = true;
    slider.disabled = num.disabled = false;
    draw();
    hud();
    slider.focus({ preventScroll: true });
  }

  function lockIn() {
    if (locked) return;
    locked = true;
    const guess = Number(slider.value);
    const diff = Math.abs(guess - angle);
    const pts = anglePoints(diff);
    score += pts;
    draw(guess);
    result.textContent = `The angle is ${angle}°. You said ${guess}°, off by ${diff}°: +${pts} points.`;
    result.className = `mg-flash ${pts >= 60 ? 'is-right' : 'is-wrong'}`;
    lock.hidden = true;
    nextBtn.hidden = false;
    nextBtn.textContent = round === ROUNDS ? 'See your score' : 'Next angle';
    slider.disabled = num.disabled = true;
    hud();
    nextBtn.focus({ preventScroll: true });
  }

  function finish() {
    const prev = readBest('angle-hunter');
    if (prev === null || score > prev) writeBest('angle-hunter', score);
    $<HTMLElement>('[data-final]').textContent = `${score}`;
    $<HTMLElement>('[data-final-line]').textContent = `out of ${ROUNDS * 100}${prev === null || score > prev ? '. New best!' : '.'}`;
    showBest();
    view('end');
    $<HTMLButtonElement>('[data-again]').focus({ preventScroll: true });
  }

  function begin() {
    round = 0;
    score = 0;
    view('play');
    newRound();
  }

  slider.addEventListener('input', () => setGuess(Number(slider.value)));
  num.addEventListener('input', () => setGuess(Number(num.value)));
  lock.addEventListener('click', lockIn);
  nextBtn.addEventListener('click', () => (round >= ROUNDS ? finish() : newRound()));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !views.play.hidden) {
      e.preventDefault();
      if (!locked) lockIn();
      else nextBtn.click();
    }
  });
  $<HTMLButtonElement>('[data-start]').addEventListener('click', begin);
  $<HTMLButtonElement>('[data-again]').addEventListener('click', begin);
  view('start');
  showBest();
  hud();
}
