// One-question-at-a-time quiz with instant feedback, score, restart and
// progress saved in localStorage (resume where you left off).
import { readQuizState, writeQuizState } from './quiz-store.ts';

const LETTERS = ['A', 'B', 'C', 'D'];

export function mountQuiz(root: HTMLElement) {
  const id = root.dataset.quiz!;
  const $ = <T extends Element>(s: string) => root.querySelector<T>(s)!;
  const items = [...root.querySelectorAll<HTMLLIElement>('[data-q]')];
  const total = items.length;
  const bar = $<HTMLElement>('[data-bar]');
  const progressText = $<HTMLElement>('[data-progress-text]');
  const meter = $<HTMLElement>('[data-meter]');
  const scoreEl = $<HTMLElement>('[data-score]');
  const done = $<HTMLElement>('[data-done]');

  let state = readQuizState(id, total);
  let current = 0;

  root.classList.add('is-js');
  bar.hidden = false;

  const answerOf = (li: HTMLLIElement) => Number(li.dataset.answer);
  const score = () => state.answers.reduce<number>((s, a, i) => s + (a !== null && a === answerOf(items[i]) ? 1 : 0), 0);
  const answeredCount = () => state.answers.filter((a) => a !== null).length;

  function paint(i: number) {
    const li = items[i];
    const chosen = state.answers[i];
    const correct = answerOf(li);
    const opts = [...li.querySelectorAll<HTMLButtonElement>('.q-opt')];
    opts.forEach((b, j) => {
      b.classList.toggle('is-correct', chosen !== null && j === correct);
      b.classList.toggle('is-wrong', chosen !== null && j === chosen && chosen !== correct);
      b.classList.toggle('is-chosen', chosen === j);
      b.setAttribute('aria-pressed', String(chosen === j));
      b.disabled = chosen !== null;
    });
    const fb = li.querySelector<HTMLElement>('[data-feedback]')!;
    const verdict = li.querySelector<HTMLElement>('[data-verdict]')!;
    const nav = li.querySelector<HTMLElement>('[data-nav]')!;
    if (chosen === null) {
      fb.hidden = true;
      nav.hidden = true;
      return;
    }
    const right = chosen === correct;
    fb.hidden = false;
    fb.classList.toggle('is-right', right);
    verdict.textContent = right ? 'Correct.' : `Not quite. The answer is ${LETTERS[correct]}.`;
    nav.hidden = false;
    li.querySelector<HTMLButtonElement>('[data-next]')!.textContent = i === total - 1 ? 'See your score' : 'Next question';
  }

  function updateBar() {
    const n = answeredCount();
    progressText.textContent = current < total ? `Question ${current + 1} of ${total}` : `All ${total} answered`;
    meter.style.width = `${(n / total) * 100}%`;
    scoreEl.textContent = `Score: ${score()} / ${n}`;
  }

  function show(i: number, focus = true) {
    current = i;
    items.forEach((li, j) => (li.hidden = j !== i));
    done.hidden = true;
    paint(i);
    updateBar();
    if (focus) items[i].querySelector<HTMLElement>('.q-text')?.focus({ preventScroll: false });
  }

  function finish() {
    current = total;
    items.forEach((li) => (li.hidden = true));
    const s = score();
    if (state.best === null || s > state.best) state.best = s;
    state.attempts += 1;
    writeQuizState(id, state);
    $<HTMLElement>('[data-final]').textContent = `${s} / ${total}`;
    $<HTMLElement>('[data-final-msg]').textContent =
      s === total
        ? 'Every answer right.'
        : s >= total * 0.7
          ? 'Solid work. Check the questions below to tidy up the rest.'
          : 'Have a look at the questions below, then try again.';
    $<HTMLElement>('[data-best-line]').textContent = `Best score in this browser: ${state.best} / ${total}`;
    const missed = items.filter((_, i) => state.answers[i] !== answerOf(items[i]));
    const review = $<HTMLElement>('[data-review]');
    review.hidden = missed.length === 0;
    $<HTMLElement>('[data-review-list]').replaceChildren(
      ...missed.map((li) => {
        const row = document.createElement('li');
        const q = document.createElement('strong');
        q.textContent = li.querySelector('.q-text')!.textContent;
        const a = document.createElement('span');
        const correct = answerOf(li);
        a.textContent = ` Answer: ${LETTERS[correct]}. ${li.querySelectorAll('.q-opt-text')[correct].textContent} — ${li.querySelector('.q-explain')!.textContent}`;
        row.append(q, a);
        return row;
      }),
    );
    done.hidden = false;
    updateBar();
    done.focus();
  }

  items.forEach((li, i) => {
    li.querySelector<HTMLElement>('.q-text')!.tabIndex = -1;
    li.querySelectorAll<HTMLButtonElement>('.q-opt').forEach((b) =>
      b.addEventListener('click', () => {
        if (state.answers[i] !== null) return;
        state.answers[i] = Number(b.dataset.i);
        writeQuizState(id, state);
        paint(i);
        updateBar();
        li.querySelector<HTMLButtonElement>('[data-next]')!.focus();
      }),
    );
    li.querySelector<HTMLButtonElement>('[data-next]')!.addEventListener('click', () => {
      const next = state.answers.findIndex((a, j) => a === null && j > i);
      const any = state.answers.findIndex((a) => a === null);
      if (next !== -1) show(next);
      else if (any !== -1) show(any);
      else finish();
    });
  });

  // Keys 1-4 or A-D pick an option on the current question.
  root.addEventListener('keydown', (e) => {
    if (current >= total || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toUpperCase();
    const idx = '1234'.includes(k) ? Number(k) - 1 : LETTERS.indexOf(k);
    if (idx < 0 || idx > 3) return;
    items[current].querySelectorAll<HTMLButtonElement>('.q-opt')[idx]?.click();
  });

  $<HTMLButtonElement>('[data-restart]').addEventListener('click', () => {
    state = { ...state, answers: Array(total).fill(null) };
    writeQuizState(id, state);
    show(0);
  });

  // Resume: the first unanswered question, or the results if all are answered.
  const firstOpen = state.answers.findIndex((a) => a === null);
  if (firstOpen === -1 && answeredCount() === total) {
    items.forEach((_, i) => paint(i));
    finishWithoutCounting();
  } else show(Math.max(0, firstOpen), false);

  function finishWithoutCounting() {
    // Reloading a finished quiz shouldn't count as another attempt.
    const attempts = state.attempts;
    finish();
    state.attempts = attempts;
    writeQuizState(id, state);
  }
}
