// Pure validation for the scraped games dataset. No I/O here, so the same
// rules run in the sync step, the validation report and the tests.

export const DIRECTORY_CODE = '0000';
const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9-]{0,63}$/;
const FOUR_DIGITS = /^\d{4}$/;
const MIRROR_FIELDS = ['url_s1', 'url_s2', 'url_s3'];

/** Returns a normalised https URL string, or null if the value is unusable. */
export function safeGameUrl(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  let u;
  try {
    u = new URL(trimmed);
  } catch {
    return null;
  }
  // Only https: an http game can't load inside an https page, and anything
  // else (javascript:, data:, file:, blob:) must never be followed.
  if (u.protocol !== 'https:') return null;
  if (u.username || u.password) return null;
  if (!u.hostname.includes('.')) return null;
  return u.href;
}

const str = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * @param {unknown} raw parsed games.json
 * @param {{ thumbExists?: (relPath: string) => boolean }} [opts]
 */
export function validateGames(raw, opts = {}) {
  const thumbExists = opts.thumbExists ?? (() => true);
  const report = {
    total: 0,
    valid: 0,
    duplicateCodes: [], // { code, names }
    reservedCode: [], // records using the directory code
    invalidCodes: [], // { index, code } codes that can't be used at all
    nonFourDigitCodes: [], // { code, name } kept, but unreachable from Code Mode
    missingNames: [],
    missingUrls: [], // no usable URL in url or any mirror
    unsafeUrls: [], // { code, field, value } non-https / unparsable values that were dropped
    missingThumbs: [], // { code, thumb_file }
    malformed: [], // { index, reason }
    duplicateUrls: [], // { url, codes } same primary URL under several codes
  };

  if (!Array.isArray(raw)) {
    report.malformed.push({ index: -1, reason: 'top level is not an array' });
    return { games: [], report };
  }
  report.total = raw.length;

  const seen = new Map();
  const games = [];

  raw.forEach((rec, index) => {
    if (rec === null || typeof rec !== 'object' || Array.isArray(rec)) {
      report.malformed.push({ index, reason: 'record is not an object' });
      return;
    }
    const code = str(rec.code);
    const name = str(rec.name);
    if (!code || !CODE_RE.test(code)) {
      report.invalidCodes.push({ index, code: rec.code ?? null });
      return;
    }
    if (code === DIRECTORY_CODE) {
      report.reservedCode.push({ index, name });
      return;
    }
    if (!name) {
      report.missingNames.push({ index, code });
      return;
    }
    if (seen.has(code)) {
      const first = seen.get(code);
      const dup = report.duplicateCodes.find((d) => d.code === code);
      if (dup) dup.names.push(name);
      else report.duplicateCodes.push({ code, names: [first.name, name] });
      return;
    }

    // Collect every usable URL: primary first, then mirrors, deduplicated.
    const candidates = [['url', rec.url], ...MIRROR_FIELDS.map((f) => [f, rec[f]])];
    const urls = [];
    for (const [field, value] of candidates) {
      if (value === undefined || value === null || str(value) === '') continue;
      const safe = safeGameUrl(value);
      if (!safe) report.unsafeUrls.push({ code, field, value: String(value) });
      else if (!urls.includes(safe)) urls.push(safe);
    }
    if (urls.length === 0) {
      report.missingUrls.push({ code, name });
      return;
    }

    const thumbFile = str(rec.thumb_file);
    const hasThumb = Boolean(thumbFile) && !thumbFile.includes('..') && thumbExists(thumbFile);
    if (!hasThumb) report.missingThumbs.push({ code, thumb_file: thumbFile || null });

    if (!FOUR_DIGITS.test(code)) report.nonFourDigitCodes.push({ code, name });

    const game = {
      code,
      name,
      category: str(rec.category).toLowerCase() || 'other',
      url: urls[0],
      mirrors: urls.slice(1),
      thumbFile: hasThumb ? thumbFile : null,
    };
    seen.set(code, game);
    games.push(game);
  });

  const byUrl = new Map();
  for (const g of games) byUrl.set(g.url, [...(byUrl.get(g.url) ?? []), g.code]);
  for (const [url, codes] of byUrl) if (codes.length > 1) report.duplicateUrls.push({ url, codes });

  report.valid = games.length;
  return { games, report };
}

/** Category list with counts, largest first, derived from the games themselves. */
export function categoryCounts(games) {
  const counts = new Map();
  for (const g of games) counts.set(g.category, (counts.get(g.category) ?? 0) + 1);
  return [...counts]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
}

/** Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, CRLF). */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header = [], ...body] = rows.filter((r) => r.length > 1 || r[0] !== '');
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

/** Compares games.json records with games.csv rows by code and shared fields. */
export function compareJsonCsv(jsonRecords, csvRows) {
  const j = new Map(jsonRecords.map((r) => [String(r.code), r]));
  const c = new Map(csvRows.map((r) => [String(r.code), r]));
  const onlyJson = [...j.keys()].filter((k) => !c.has(k));
  const onlyCsv = [...c.keys()].filter((k) => !j.has(k));
  const fieldDiffs = [];
  for (const [code, rec] of j) {
    const row = c.get(code);
    if (!row) continue;
    for (const key of Object.keys(row)) {
      const a = rec[key] === undefined || rec[key] === null ? '' : String(rec[key]);
      if (a !== row[key]) fieldDiffs.push({ code, field: key, json: a, csv: row[key] });
    }
  }
  return { jsonCount: j.size, csvCount: c.size, onlyJson, onlyCsv, fieldDiffs };
}
