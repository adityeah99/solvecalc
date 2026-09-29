// Prints a validation report for the scraped games dataset.
//   npm run games:validate            human-readable report
//   npm run games:validate -- --json  machine-readable report
import { categoryCounts, compareJsonCsv, parseCsv, validateGames } from './lib/games-validate.mjs';
import { loadSource, SOURCE_DIR } from './lib/source.mjs';

const src = loadSource();
if (!src) {
  console.error(`games.json not found in ${SOURCE_DIR}. Set GAMES_SOURCE=/path/to/folder.`);
  process.exit(1);
}

const { games, report } = validateGames(src.raw, { thumbExists: src.thumbExists });
const csv = src.csvText ? compareJsonCsv(src.raw, parseCsv(src.csvText)) : null;
const categories = categoryCounts(games);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ source: src.jsonPath, report, csv, categories }, null, 2));
  process.exit(0);
}

const line = (label, value) => console.log(`  ${label.padEnd(34)} ${value}`);
const list = (items, fmt, max = 10) => {
  for (const it of items.slice(0, max)) console.log(`      - ${fmt(it)}`);
  if (items.length > max) console.log(`      … ${items.length - max} more`);
};

console.log(`\nGames dataset: ${src.jsonPath}\n`);
line('Total records', report.total);
line('Valid records', report.valid);
line('Duplicate codes', report.duplicateCodes.length);
list(report.duplicateCodes, (d) => `${d.code}: ${d.names.join(' / ')}`);
line('Invalid codes (unusable)', report.invalidCodes.length);
list(report.invalidCodes, (d) => `record #${d.index}: ${JSON.stringify(d.code)}`);
line(`Records using reserved code 0000`, report.reservedCode.length);
line('Codes that are not 4 digits', report.nonFourDigitCodes.length);
list(report.nonFourDigitCodes, (d) => `${d.code} (${d.name}) - in the directory, not reachable from Code Mode`);
line('Missing names', report.missingNames.length);
list(report.missingNames, (d) => `record #${d.index} (${d.code})`);
line('Missing URLs (no usable link)', report.missingUrls.length);
list(report.missingUrls, (d) => `${d.code} ${d.name}`);
line('Unsafe/unparsable URL values', report.unsafeUrls.length);
list(report.unsafeUrls, (d) => `${d.code} ${d.field}: ${d.value}`);
line('Missing thumbnails', report.missingThumbs.length);
list(report.missingThumbs, (d) => `${d.code}: ${d.thumb_file ?? '(no thumb_file)'}`);
line('Malformed records', report.malformed.length);
list(report.malformed, (d) => `record #${d.index}: ${d.reason}`);
line('Same primary URL under 2+ codes', report.duplicateUrls.length);
list(report.duplicateUrls, (d) => `${d.codes.join(', ')} -> ${d.url}`);
console.log(`\n  Categories (${categories.length}): ${categories.map((c) => `${c.id} ${c.count}`).join(', ')}`);

if (csv) {
  console.log(`\ngames.csv vs games.json`);
  line('Records in JSON / CSV', `${csv.jsonCount} / ${csv.csvCount}`);
  line('Codes only in JSON', csv.onlyJson.length);
  list(csv.onlyJson, (c) => c);
  line('Codes only in CSV', csv.onlyCsv.length);
  list(csv.onlyCsv, (c) => c);
  line('Field differences', csv.fieldDiffs.length);
  list(csv.fieldDiffs, (d) => `${d.code}.${d.field}: json=${JSON.stringify(d.json)} csv=${JSON.stringify(d.csv)}`);
} else {
  console.log('\ngames.csv not found next to games.json; skipped the comparison.');
}
console.log('');
