import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareJsonCsv, parseCsv, safeGameUrl, validateGames } from '../scripts/lib/games-validate.mjs';

test('safeGameUrl only accepts https', () => {
  assert.equal(safeGameUrl('https://example.org/game/'), 'https://example.org/game/');
  assert.equal(safeGameUrl('  https://example.org/a  '), 'https://example.org/a');
  assert.equal(safeGameUrl('javascript:alert(1)'), null);
  assert.equal(safeGameUrl('JaVaScRiPt:alert(1)'), null);
  assert.equal(safeGameUrl('data:text/html,<script>alert(1)</script>'), null);
  assert.equal(safeGameUrl('http://example.org/'), null);
  assert.equal(safeGameUrl('https://user:pw@example.org/'), null);
  assert.equal(safeGameUrl('/relative/path'), null);
  assert.equal(safeGameUrl('https://localhost/'), null);
  assert.equal(safeGameUrl(42), null);
});

test('validateGames reports every class of problem', () => {
  const raw = [
    { code: '1001', name: 'Good', category: 'Puzzle', url: 'https://a.org/1', url_s2: 'https://b.org/1', thumb_file: 'thumbs/1001.webp' },
    { code: '1001', name: 'Dupe', url: 'https://a.org/2' },
    { code: '0000', name: 'Reserved', url: 'https://a.org/3' },
    { code: '', name: 'No code', url: 'https://a.org/4' },
    { code: '1002', name: '', url: 'https://a.org/5' },
    { code: '1003', name: 'No url', url: '' },
    { code: '1004', name: 'Bad url', url: 'javascript:alert(1)', url_s2: 'https://c.org/ok' },
    { code: 'slug-code', name: 'Slug', url: 'https://a.org/1' },
    'not an object',
  ];
  const { games, report } = validateGames(raw, { thumbExists: (p: string) => p === 'thumbs/1001.webp' });
  assert.equal(report.total, 9);
  assert.equal(report.valid, 3);
  assert.deepEqual(games.map((g: { code: string }) => g.code), ['1001', '1004', 'slug-code']);
  assert.equal(games[0].category, 'puzzle');
  assert.deepEqual(games[0].mirrors, ['https://b.org/1']);
  assert.equal(games[1].url, 'https://c.org/ok'); // unsafe primary dropped, mirror promoted
  assert.equal(report.duplicateCodes.length, 1);
  assert.equal(report.reservedCode.length, 1);
  assert.equal(report.invalidCodes.length, 1);
  assert.equal(report.missingNames.length, 1);
  assert.equal(report.missingUrls.length, 1);
  assert.equal(report.unsafeUrls.length, 1);
  assert.equal(report.malformed.length, 1);
  assert.equal(report.nonFourDigitCodes.length, 1);
  assert.equal(report.missingThumbs.length, 2);
  assert.deepEqual(report.duplicateUrls, [{ url: 'https://a.org/1', codes: ['1001', 'slug-code'] }]);
});

test('parseCsv and compareJsonCsv', () => {
  const rows = parseCsv('code,name\r\n1,"A, ""quoted"" name"\r\n2,B\r\n');
  assert.deepEqual(rows, [
    { code: '1', name: 'A, "quoted" name' },
    { code: '2', name: 'B' },
  ]);
  const cmp = compareJsonCsv([{ code: '1', name: 'A, "quoted" name' }, { code: '3', name: 'C' }], rows);
  assert.deepEqual(cmp.onlyJson, ['3']);
  assert.deepEqual(cmp.onlyCsv, ['2']);
  assert.equal(cmp.fieldDiffs.length, 0);
});
