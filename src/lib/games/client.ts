// Browser-side access to the game library. The data is fetched once from
// /data/library.json (generated from games.json), only when it is needed.
import { categoryLabel, safeGameUrl, type Game, type GameData } from './types.ts';

export type { Game, GameData };

export const LIBRARY_URL = '/data/library.json';

let pending: Promise<GameData> | null = null;
let byCode: Map<string, Game> | null = null;

export function loadGames(): Promise<GameData> {
  pending ??= fetch(LIBRARY_URL, { headers: { accept: 'application/json' } })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<GameData>;
    })
    .then((data) => {
      // Drop anything without a usable https URL, even if the file was edited by hand.
      data.games = data.games.filter((g) => typeof g.code === 'string' && typeof g.name === 'string' && safeGameUrl(g.url));
      byCode = new Map(data.games.map((g) => [g.code, g]));
      return data;
    })
    .catch((err) => {
      pending = null; // allow a retry
      throw err;
    });
  return pending;
}

export async function findGame(code: string): Promise<Game | undefined> {
  await loadGames();
  return byCode!.get(code);
}

/** Case-insensitive search over name, code and category. Every word must match. */
export function searchGames(games: Game[], query: string, category = ''): Game[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const pool = category ? games.filter((g) => g.category === category) : games;
  if (words.length === 0) return pool;
  const scored: { g: Game; s: number }[] = [];
  for (const g of pool) {
    const name = g.name.toLowerCase();
    const cat = `${g.category} ${categoryLabel(g.category).toLowerCase()}`;
    let score = 0;
    let ok = true;
    for (const w of words) {
      if (g.code.toLowerCase() === w) score += 100;
      else if (g.code.toLowerCase().startsWith(w)) score += 20;
      else if (name.startsWith(w)) score += 12;
      else if (name.includes(` ${w}`)) score += 8;
      else if (name.includes(w)) score += 5;
      else if (cat.includes(w)) score += 3;
      else {
        ok = false;
        break;
      }
    }
    if (ok) scored.push({ g, s: score });
  }
  return scored.sort((a, b) => b.s - a.s || a.g.name.localeCompare(b.g.name)).map((x) => x.g);
}
