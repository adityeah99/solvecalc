// Quiz progress kept in localStorage, one entry per quiz.
export interface QuizState {
  answers: (number | null)[];
  best: number | null;
  attempts: number;
}

const key = (id: string) => `calcora:quiz:${id}`;

export function readQuizState(id: string, length = 0): QuizState {
  const empty: QuizState = { answers: Array(length).fill(null), best: null, attempts: 0 };
  try {
    const raw = JSON.parse(localStorage.getItem(key(id)) ?? 'null');
    if (!raw || !Array.isArray(raw.answers)) return empty;
    const answers = length ? Array.from({ length }, (_, i) => (Number.isInteger(raw.answers[i]) ? raw.answers[i] : null)) : raw.answers;
    return {
      answers,
      best: Number.isInteger(raw.best) ? raw.best : null,
      attempts: Number.isInteger(raw.attempts) ? raw.attempts : 0,
    };
  } catch {
    return empty;
  }
}

export function writeQuizState(id: string, state: QuizState) {
  try {
    localStorage.setItem(key(id), JSON.stringify(state));
  } catch {
    /* storage blocked: progress just won't persist */
  }
}
