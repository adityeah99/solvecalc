// Best scores for the math games, kept in this browser only.
const key = (id: string) => `calcora:mg:${id}`;

export function readBest(id: string): number | null {
  try {
    const v = Number(localStorage.getItem(key(id)));
    return localStorage.getItem(key(id)) === null || !Number.isFinite(v) ? null : v;
  } catch {
    return null;
  }
}

export function writeBest(id: string, value: number) {
  try {
    localStorage.setItem(key(id), String(value));
  } catch {
    /* storage blocked */
  }
}
