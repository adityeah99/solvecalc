// Shape of src/generated/games.json (written by scripts/sync-games.mjs).
export interface Game {
  code: string;
  name: string;
  category: string;
  url: string;
  mirrors: string[];
  thumb: string | null;
}

export interface GameData {
  /** Present at build time only; not served to the browser. */
  source?: string;
  count: number;
  categories: { id: string; count: number }[];
  games: Game[];
}

// Display names for category ids that don't read well capitalised.
const LABELS: Record<string, string> = {
  io: '.io',
  'open-world': 'Open world',
};

export const categoryLabel = (id: string) =>
  LABELS[id] ?? id.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** Only https URLs are ever loaded or linked; everything else is treated as broken. */
export function safeGameUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const u = new URL(value.trim());
    if (u.protocol !== 'https:' || u.username || u.password || !u.hostname.includes('.')) return null;
    return u.href;
  } catch {
    return null;
  }
}

export const initials = (name: string) =>
  name
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';
