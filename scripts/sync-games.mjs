// Reads the scraped games.json, validates it, and produces what the site uses:
//   src/generated/games.json  normalised records (served at /data/library.json)
//   public/thumbs/            local thumbnails (oversized ones shrunk when cwebp is available)
// Runs automatically before `npm run dev` and `npm run build`.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { categoryCounts, validateGames } from './lib/games-validate.mjs';
import { loadSource, ROOT, SOURCE_DIR } from './lib/source.mjs';

const OUT_JSON = join(ROOT, 'src', 'generated', 'games.json');
const THUMBS_OUT = join(ROOT, 'public', 'thumbs');
const MAX_THUMB_BYTES = 60 * 1024;
const THUMB_WIDTH = 320;

const src = loadSource();
if (!src) {
  if (existsSync(OUT_JSON)) {
    console.warn(`[games] source not found at ${SOURCE_DIR}; keeping existing ${relative(ROOT, OUT_JSON)}`);
    process.exit(0);
  }
  console.error(`[games] games.json not found in ${SOURCE_DIR}. Set GAMES_SOURCE=/path/to/folder.`);
  process.exit(1);
}

const { games, report } = validateGames(src.raw, { thumbExists: src.thumbExists });
if (games.length === 0) {
  console.error('[games] no valid game records; run `npm run games:validate` for details.');
  process.exit(1);
}

let hasCwebp = true;
try {
  execFileSync('cwebp', ['-version'], { stdio: 'ignore' });
} catch {
  hasCwebp = false;
}

mkdirSync(THUMBS_OUT, { recursive: true });
let copied = 0;
let shrunk = 0;
for (const g of games) {
  if (!g.thumbFile) continue;
  const from = join(SOURCE_DIR, g.thumbFile);
  const size = statSync(from).size;
  const oversized = size > MAX_THUMB_BYTES && hasCwebp;
  const outName = oversized ? basename(g.thumbFile).replace(/\.[^.]+$/, '') + '.webp' : basename(g.thumbFile);
  const to = join(THUMBS_OUT, outName);
  g.thumb = `/thumbs/${outName}`;
  if (existsSync(to) && statSync(to).mtimeMs >= statSync(from).mtimeMs) continue;
  if (oversized) {
    try {
      execFileSync('cwebp', ['-quiet', '-q', '78', '-resize', String(THUMB_WIDTH), '0', from, '-o', to]);
      shrunk++;
      continue;
    } catch {
      // fall through to a plain copy, keeping the original extension
      g.thumb = `/thumbs/${basename(g.thumbFile)}`;
    }
  }
  copyFileSync(from, join(THUMBS_OUT, basename(g.thumbFile)));
  copied++;
}

const out = {
  source: relative(ROOT, src.jsonPath),
  count: games.length,
  categories: categoryCounts(games),
  games: games.map(({ thumbFile, ...g }) => ({ ...g, thumb: g.thumb ?? null })),
};
mkdirSync(join(ROOT, 'src', 'generated'), { recursive: true });
const next = JSON.stringify(out);
const prev = existsSync(OUT_JSON) ? readFileSync(OUT_JSON, 'utf8') : '';
if (next !== prev) writeFileSync(OUT_JSON, next);

const issues = report.total - report.valid;
console.log(
  `[games] ${report.valid}/${report.total} valid games, ${out.categories.length} categories` +
    (issues ? `, ${issues} skipped (run npm run games:validate)` : '') +
    ` | thumbs: ${copied} copied, ${shrunk} shrunk${hasCwebp ? '' : ' (cwebp not found, originals used)'}` +
    `, ${report.missingThumbs.length} missing`,
);
