import { apply, fr, fracText, makePuzzle, solve, type Frac, type Op } from '../../lib/mathgames/make24.ts';
import { readBest, writeBest } from './store.ts';

interface Tile {
  id: number;
  v: Frac;
}

export function mountMake24(root: HTMLElement) {
  const $ = <T extends Element>(s: string) => root.querySelector<T>(s)!;
  const tilesEl = $<HTMLElement>('[data-tiles]');
  const msg = $<HTMLElement>('[data-msg]');
  const ops = [...root.querySelectorAll<HTMLButtonElement>('[data-op]')];

  let puzzle: number[] = [];
  let tiles: Tile[] = [];
  let history: Tile[][] = [];
  let selected: number | null = null;
  let op: Op | null = null;
  let done = false;
  let revealed = false;
  let solved = 0;
  let streak = 0;
  let nextId = 0;

  const say = (text: string, tone: '' | 'is-right' | 'is-wrong' = '') => {
    msg.textContent = text;
    msg.className = `mg-flash ${tone}`;
  };
  const hud = () => {
    $<HTMLElement>('[data-solved]').textContent = String(solved);
    $<HTMLElement>('[data-streak]').textContent = String(streak);
    const b = readBest('make-24');
    $<HTMLElement>('[data-best]').textContent = b === null ? '–' : String(b);
  };

  function render() {
    tilesEl.replaceChildren(
      ...tiles.map((t, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'm24-tile';
        b.textContent = fracText(t.v);
        b.setAttribute('aria-pressed', String(selected === t.id));
        b.setAttribute('aria-label', `${fracText(t.v)}${selected === t.id ? ', selected' : ''} (key ${i + 1})`);
        b.disabled = done;
        b.addEventListener('click', () => tap(t.id));
        return b;
      }),
    );
    ops.forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.op === op));
      b.disabled = done || selected === null;
    });
  }

  function tap(id: number) {
    if (done) return;
    if (selected === null || op === null || selected === id) {
      selected = selected === id ? null : id;
      op = null;
      render();
      return;
    }
    const a = tiles.find((t) => t.id === selected)!;
    const b = tiles.find((t) => t.id === id)!;
    const v = apply(a.v, op, b.v);
    if (!v) {
      say("You can't divide by zero. Pick another number.", 'is-wrong');
      return;
    }
    history.push(tiles.map((t) => ({ ...t })));
    const result = { id: nextId++, v };
    tiles = tiles.filter((t) => t.id !== a.id).map((t) => (t.id === b.id ? result : t));
    say(`${fracText(a.v)} ${op} ${fracText(b.v)} = ${fracText(v)}`);
    selected = result.id;
    op = null;
    if (tiles.length === 1) check();
    render();
  }

  function check() {
    const v = tiles[0].v;
    if (v.n === 24 && v.d === 1) {
      done = true;
      selected = null;
      if (!revealed) {
        solved++;
        streak++;
        const best = readBest('make-24');
        if (best === null || streak > best) writeBest('make-24', streak);
      }
      say(revealed ? 'That is 24. Try the next one without the hint.' : '24! Solved. Press New puzzle for another.', 'is-right');
      hud();
      $<HTMLButtonElement>('[data-new]').focus({ preventScroll: true });
    } else {
      say(`That makes ${fracText(v)}, not 24. Undo or Reset and try another way.`, 'is-wrong');
    }
  }

  function load(nums: number[]) {
    puzzle = nums;
    tiles = nums.map((n) => ({ id: nextId++, v: fr(n) }));
    history = [];
    selected = null;
    op = null;
    done = false;
    revealed = false;
    say('Tap a number, an operation, then another number.');
    render();
  }

  ops.forEach((b) =>
    b.addEventListener('click', () => {
      if (selected === null || done) return;
      op = op === b.dataset.op ? null : (b.dataset.op as Op);
      render();
    }),
  );
  $<HTMLButtonElement>('[data-undo]').addEventListener('click', () => {
    const prev = history.pop();
    if (!prev) return;
    tiles = prev;
    selected = null;
    op = null;
    done = false;
    say('Stepped back.');
    render();
  });
  $<HTMLButtonElement>('[data-reset]').addEventListener('click', () => {
    const keepRevealed = revealed;
    load(puzzle);
    revealed = keepRevealed;
  });
  $<HTMLButtonElement>('[data-show]').addEventListener('click', () => {
    const s = solve(puzzle);
    if (!s) return;
    if (!done && !revealed) streak = 0;
    revealed = true;
    hud();
    say(`One way: ${s} = 24`);
  });
  $<HTMLButtonElement>('[data-new]').addEventListener('click', () => {
    if (!done) streak = 0; // skipping an unsolved puzzle ends the streak
    hud();
    load(makePuzzle(Math.random));
  });

  root.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    const map: Record<string, Op> = { '+': '+', '-': '−', '*': '×', x: '×', '/': '÷' };
    if (/^[1-4]$/.test(k) && tiles[Number(k) - 1]) tap(tiles[Number(k) - 1].id);
    else if (map[k] && selected !== null && !done) {
      op = map[k];
      render();
    } else if (k === 'Backspace') $<HTMLButtonElement>('[data-undo]').click();
    else return;
    e.preventDefault();
  });

  hud();
  load(makePuzzle(Math.random));
}
