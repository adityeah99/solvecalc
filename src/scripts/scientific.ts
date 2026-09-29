// Scientific calculator + Code Mode.
//
// Normal mode: an editable expression line, evaluated with the safe parser in
// lib/math/expression.ts. Code Mode: the display turns into four code cells.
// A math game's code opens its page; 0000 opens the hidden library, and a
// library game's code opens that game inside it (scripts/panel, loaded only
// then). The normal expression is left untouched while Code Mode is on, so
// switching back restores it exactly.
import { evaluate, formatNumber, MathError, type AngleMode } from '../lib/math/expression.ts';
import { findGame } from '../lib/games/client.ts';

const LIBRARY_CODE = '0000';
const HISTORY_KEY = 'solvecalc-hub:sci-history';
const HISTORY_MAX = 25;
const OPERATOR_START = /^[+−×÷^%!²]/;
const FN_TOKEN = /(sin⁻¹|cos⁻¹|tan⁻¹|asin|acos|atan|sin|cos|tan|sqrt|cbrt|log|ln|abs|√)\($/;

interface HistoryItem {
  expr: string;
  result: string;
}

const store = {
  read(): HistoryItem[] {
    try {
      const v = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
      return Array.isArray(v) ? v.filter((x) => typeof x?.expr === 'string' && typeof x?.result === 'string') : [];
    } catch {
      return [];
    }
  },
  write(items: HistoryItem[]) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, HISTORY_MAX)));
    } catch {
      /* storage full or blocked: history just won't persist */
    }
  },
};

export function mountScientific(root: HTMLElement) {
  const $ = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const input = $<HTMLInputElement>('[data-expr]');
  const resultEl = $<HTMLOutputElement>('[data-result]');
  const errorEl = $<HTMLElement>('[data-error]');
  const annAngle = $<HTMLElement>('[data-ann-angle]');
  const annHist = $<HTMLElement>('[data-ann-hist]');
  const modeBtn = $<HTMLButtonElement>('[data-codemode]');
  const modeState = $<HTMLElement>('[data-codemode-state]');
  const keys = [...root.querySelectorAll<HTMLButtonElement>('[data-keys] button')];
  const historyList = $<HTMLOListElement>('[data-history-list]');
  const historyEmpty = $<HTMLElement>('[data-history-empty]');
  const historyCount = $<HTMLElement>('[data-history-count]');
  const copyBtn = $<HTMLButtonElement>('[data-copy]');
  const codeHint = '';
  // Public math game codes, rendered into the component: { "1001": { slug, name } }
  const mathGameCodes: Record<string, { slug: string; name: string }> = JSON.parse(root.dataset.gameCodes || '{}');

  let angle: AngleMode = 'deg';
  let ans: number | undefined;
  let lastResult = '';
  let justEvaluated = false;
  let history = store.read();

  let codeMode = false;
  let code = '';
  let codeBusy = false;
  let codeError = false;

  // ── normal mode ───────────────────────────────────────────
  function showPreview() {
    errorEl.textContent = '';
    const expr = input.value.trim();
    if (!expr) {
      resultEl.textContent = lastResult && justEvaluated ? lastResult : '0';
      resultEl.classList.remove('is-preview');
      return;
    }
    try {
      const v = evaluate(expr, { angle, ans });
      resultEl.textContent = formatNumber(v);
      resultEl.classList.add('is-preview');
    } catch {
      // Stay quiet while the expression is half-typed; errors show on "=".
      resultEl.textContent = '';
    }
  }

  function equals() {
    const expr = input.value.trim();
    if (!expr) return;
    try {
      const v = evaluate(expr, { angle, ans });
      const out = formatNumber(v);
      resultEl.textContent = out;
      resultEl.classList.remove('is-preview');
      errorEl.textContent = '';
      ans = v;
      lastResult = out;
      justEvaluated = true;
      pushHistory({ expr, result: out });
    } catch (e) {
      resultEl.textContent = '';
      errorEl.textContent = e instanceof MathError ? e.message : 'Could not work that out';
      if (e instanceof MathError && e.pos >= 0) {
        input.setSelectionRange(Math.min(e.pos, input.value.length), Math.min(e.pos + 1, input.value.length));
      }
    }
  }

  function insert(text: string) {
    if (justEvaluated) {
      // After "=", an operator continues from the answer; anything else starts fresh.
      input.value = OPERATOR_START.test(text) && lastResult ? lastResult : '';
      input.setSelectionRange(input.value.length, input.value.length);
      justEvaluated = false;
    }
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.setRangeText(text, start, end, 'end');
    showPreview();
  }

  function backspace() {
    justEvaluated = false;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    if (start !== end) {
      input.setRangeText('', start, end, 'end');
    } else if (start > 0) {
      const before = input.value.slice(0, start);
      const m = before.match(FN_TOKEN);
      const cut = m ? m[0].length : 1;
      input.setRangeText('', start - cut, start, 'end');
    }
    showPreview();
  }

  function clearExpr() {
    input.value = '';
    justEvaluated = false;
    lastResult = '';
    resultEl.textContent = '0';
    resultEl.classList.remove('is-preview');
    errorEl.textContent = '';
  }

  // Typing straight after "=": an operator continues from the answer, anything
  // else starts a new calculation (same as the on-screen keys). beforeinput
  // covers physical keys, paste and phone keyboards alike.
  input.addEventListener('beforeinput', (e) => {
    if (codeMode) {
      e.preventDefault();
      return;
    }
    if (!justEvaluated || e.inputType !== 'insertText' || !e.data || e.data === '=') return;
    e.preventDefault();
    const base = OPERATOR_START.test(e.data.replace(/^[*]/, '×').replace(/^\//, '÷').replace(/^-/, '−')) && lastResult ? lastResult : '';
    input.value = base + e.data;
    input.setSelectionRange(input.value.length, input.value.length);
    justEvaluated = false;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // Show ×, ÷ and − even when the keyboard types *, / and - (same length, caret kept).
  input.addEventListener('input', () => {
    const pos = input.selectionStart;
    const pretty = input.value.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
    if (pretty !== input.value) {
      input.value = pretty;
      if (pos !== null) input.setSelectionRange(pos, pos);
    }
    justEvaluated = false;
    showPreview();
  });

  // ── history ───────────────────────────────────────────────
  function pushHistory(item: HistoryItem) {
    if (history[0]?.expr === item.expr && history[0]?.result === item.result) return;
    history = [item, ...history].slice(0, HISTORY_MAX);
    store.write(history);
    renderHistory();
  }

  function renderHistory() {
    historyList.replaceChildren(
      ...history.map((h) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'sci-hitem';
        const e = document.createElement('span');
        e.className = 'sci-hexpr';
        e.textContent = h.expr;
        const r = document.createElement('span');
        r.className = 'sci-hres';
        r.textContent = `= ${h.result}`;
        b.append(e, r);
        b.addEventListener('click', () => {
          if (codeMode) setCodeMode(false);
          input.value = h.expr;
          lastResult = h.result;
          justEvaluated = false;
          showPreview();
          input.focus();
        });
        li.append(b);
        return li;
      }),
    );
    historyEmpty.hidden = history.length > 0;
    historyCount.textContent = history.length ? `(${history.length})` : '';
    annHist.classList.toggle('is-off', history.length === 0);
  }

  // ── angle unit ────────────────────────────────────────────
  function setAngle(next: AngleMode) {
    angle = next;
    annAngle.textContent = next.toUpperCase();
    root.querySelectorAll<HTMLButtonElement>('[data-angle]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.angle === next)));
    showPreview();
  }
  root.querySelectorAll<HTMLButtonElement>('[data-angle]').forEach((b) =>
    b.addEventListener('click', () => setAngle(b.dataset.angle as AngleMode)),
  );

  // ── Code Mode ─────────────────────────────────────────────
  function setCodeMode(on: boolean) {
    codeMode = on;
    modeBtn.setAttribute('aria-checked', String(on));
    modeState.textContent = on ? 'ON' : 'OFF';
    root.classList.toggle('is-code', on);
    
    for (const key of keys) {
      key.disabled = false;
    }

    if (on) {
      resetCode();
      input.focus({ preventScroll: true });
    } else {
      input.value = history[0]?.expr ?? '';
      lastResult = history[0]?.result ?? '';
      justEvaluated = false;
      showPreview();
      input.focus({ preventScroll: true });
    }
  }

  function resetCode(status = codeHint) {
    code = '';
    codeBusy = false;
    codeError = false;
    input.value = code;
    showPreview();
    if (status) errorEl.textContent = status;
  }

  function codeDigit(d: string) {
    if (codeBusy) return;
    if (codeError) resetCode(); // start over after a miss
    if (code.length >= 4) return;
    code += d;
    input.value = code;
    showPreview();
    if (code.length === 4) void submitCode();
  }

  function codeBack() {
    if (codeBusy) return;
    if (codeError) {
      codeError = false;
      errorEl.textContent = '';
    }
    code = code.slice(0, -1);
    input.value = code;
    showPreview();
  }

  async function submitCode() {
    if (code.length !== 4 || codeBusy) return;
    codeBusy = true;
    input.value = code;
    const mathGame = mathGameCodes[code];
    if (mathGame) {
      resultEl.textContent = `Opening ${mathGame.name}…`;
      location.assign(`/games/${mathGame.slug}`);
      return;
    }
    resultEl.textContent = 'Checking…';
    try {
      const game = code === LIBRARY_CODE ? null : await findGame(code);
      if (!codeMode) return; // switched off while loading
      if (code !== LIBRARY_CODE && !game) {
        codeBusy = false;
        codeError = true;
        resultEl.textContent = '';
        errorEl.textContent = 'Code not found. Check the 4-digit code.';
        return;
      }
      const { openVault } = await import('./panel/panel.ts');
      // Leave the calculator looking untouched behind the library.
      setCodeMode(false);
      openVault({ code: game?.code, returnFocus: input });
    } catch {
      codeBusy = false;
      codeError = true;
      resultEl.textContent = '';
      errorEl.textContent = "Couldn't check that code. Check your connection, then press = to try again.";
    }
  }

  modeBtn.addEventListener('click', () => setCodeMode(!codeMode));

  // ── keys ──────────────────────────────────────────────────
  function press(key: HTMLButtonElement) {
    const { insert: text, action } = key.dataset;
    if (codeMode) {
      if (text && /^\d$/.test(text)) codeDigit(text);
      else if (action === 'back') codeBack();
      else if (action === 'clear') resetCode();
      else if (action === 'equals') void submitCode();
      return;
    }
    if (text) insert(text);
    else if (action === 'back') backspace();
    else if (action === 'clear') clearExpr();
    else if (action === 'equals') equals();
    // Keep the caret in the expression so keyboard typing carries on.
    input.focus({ preventScroll: true });
  }
  keys.forEach((key) => key.addEventListener('click', () => press(key)));

  function flash(sel: string) {
    const key = keys.find((k) => k.matches(sel));
    if (!key) return;
    key.classList.add('is-down');
    setTimeout(() => key.classList.remove('is-down'), 110);
  }

  root.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (codeMode) {
      if (e.key === 'Tab') return;
      if (/^\d$/.test(e.key)) {
        codeDigit(e.key);
        flash(`[data-insert="${e.key}"]`);
      } else if (e.key === 'Backspace') codeBack();
      else if (e.key === 'Delete') resetCode();
      else if (e.key === 'Enter' || e.key === '=') void submitCode();
      else if (e.key === 'Escape') setCodeMode(false);
      e.preventDefault();
      return;
    }
    if (e.target !== input) return;
    if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      equals();
      flash('[data-action="equals"]');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      clearExpr();
    } else if (e.key === 'Backspace' && justEvaluated) {
      justEvaluated = false;
    }
  });

  // On the calculator's own page, typing anywhere goes to the calculator.
  if (root.hasAttribute('data-global-keys')) {
    document.addEventListener('keydown', (e) => {
      const t = e.target as HTMLElement;
      if (t !== document.body || e.metaKey || e.ctrlKey || e.altKey) return;
      if (codeMode) {
        input.focus();
        root.dispatchEvent(new KeyboardEvent('keydown', { key: e.key, bubbles: true }));
        e.preventDefault();
      } else if (/^[\d.+\-*/^()%!a-z]$/i.test(e.key)) {
        input.focus();
      }
    });
  }

  // ── actions ───────────────────────────────────────────────
  copyBtn.addEventListener('click', async () => {
    const text = codeMode ? '' : resultEl.textContent?.trim() || '';
    if (!text || text === '0' && !lastResult) return;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied';
    } catch {
      copyBtn.textContent = 'Copy blocked';
    }
    setTimeout(() => (copyBtn.textContent = 'Copy result'), 1500);
  });
  $<HTMLButtonElement>('[data-clear]').addEventListener('click', () => {
    if (codeMode) resetCode();
    else clearExpr();
  });
  $<HTMLButtonElement>('[data-reset]').addEventListener('click', () => {
    if (codeMode) setCodeMode(false);
    clearExpr();
    ans = undefined;
    history = [];
    store.write(history);
    renderHistory();
    setAngle('deg');
  });

  renderHistory();
  if (root.hasAttribute('data-autofocus')) input.focus({ preventScroll: true });
}
