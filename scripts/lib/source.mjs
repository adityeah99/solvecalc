import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Folder holding the scraped games.json, games.csv and thumbs/.
// Override with GAMES_SOURCE=/path/to/folder.
export const SOURCE_DIR = resolve(ROOT, process.env.GAMES_SOURCE ?? '../calcsolver');

export function loadSource() {
  const jsonPath = join(SOURCE_DIR, 'games.json');
  if (!existsSync(jsonPath)) return null;
  const raw = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const csvPath = join(SOURCE_DIR, 'games.csv');
  const csvText = existsSync(csvPath) ? readFileSync(csvPath, 'utf8') : null;
  const thumbExists = (rel) => existsSync(join(SOURCE_DIR, rel));
  return { raw, csvText, jsonPath, csvPath, thumbExists };
}
