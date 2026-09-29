import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { searchGames } from '../src/lib/games/client.ts';
import { categoryLabel, initials, safeGameUrl, type GameData } from '../src/lib/games/types.ts';

// The real generated dataset, so the tests follow games.json rather than a fixture.
const data: GameData = JSON.parse(readFileSync(new URL('../src/generated/games.json', import.meta.url), 'utf8'));

test('client-side URL check matches the build-time rules', () => {
  assert.equal(safeGameUrl('https://example.org/g/'), 'https://example.org/g/');
  assert.equal(safeGameUrl('javascript:alert(1)'), null);
  assert.equal(safeGameUrl('data:text/html,hi'), null);
  assert.equal(safeGameUrl('http://example.org/'), null);
  assert.equal(safeGameUrl(undefined), null);
  for (const g of data.games) assert.ok(safeGameUrl(g.url), `${g.code} has an unsafe URL`);
});

test('dataset shape', () => {
  assert.equal(data.count, data.games.length);
  assert.equal(new Set(data.games.map((g) => g.code)).size, data.games.length, 'codes are unique');
  assert.ok(!data.games.some((g) => g.code === '0000'), '0000 is reserved for opening the library');
  const summed = data.categories.reduce((s, c) => s + c.count, 0);
  assert.equal(summed, data.games.length, 'category counts add up');
});

test('search by code, name and category', () => {
  const byCode = data.games.find((g) => /^\d{4}$/.test(g.code))!;
  assert.equal(searchGames(data.games, byCode.code)[0].code, byCode.code);

  const word = byCode.name.split(/\s+/)[0].toLowerCase();
  assert.ok(searchGames(data.games, word).some((g) => g.code === byCode.code));

  const cat = data.categories[0].id;
  assert.equal(searchGames(data.games, '', cat).length, data.categories[0].count);
  assert.ok(searchGames(data.games, cat).length >= data.categories[0].count);

  assert.equal(searchGames(data.games, 'zzzz-no-such-game').length, 0);
  assert.equal(searchGames(data.games, '   ').length, data.games.length);
});

test('display helpers', () => {
  assert.equal(categoryLabel('open-world'), 'Open world');
  assert.equal(categoryLabel('io'), '.io');
  assert.equal(categoryLabel('puzzle'), 'Puzzle');
  assert.equal(initials('Math Duck'), 'MD');
  assert.equal(initials('!!!'), '?');
});
