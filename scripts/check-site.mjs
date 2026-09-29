// Checks the built site in dist/: one H1 per page, unique titles and
// descriptions, canonical + Open Graph tags, valid JSON-LD, no broken internal
// links, sitemap contents, and page weight. Run after `npm run build`.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT } from './lib/source.mjs';

const DIST = join(ROOT, 'dist');
if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));
const problems = [];
const titles = new Map();
const descs = new Map();

const attr = (html, re) => html.match(re)?.[1];
const urlFor = (file) => '/' + relative(DIST, file).replace(/\.html$/, '').replace(/(^|\/)index$/, '');

function resolveLink(href) {
  const path = href.split('#')[0].split('?')[0];
  if (path === '' || path === '/') return existsSync(join(DIST, 'index.html'));
  const clean = path.replace(/\/$/, '');
  return [clean, `${clean}.html`, `${clean}/index.html`].some((p) => existsSync(join(DIST, p)));
}

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const url = urlFor(file);
  const where = relative(DIST, file);
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) problems.push(`${where}: ${h1s} <h1> elements`);

  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  if (!title) problems.push(`${where}: missing <title>`);
  if (!desc) problems.push(`${where}: missing meta description`);
  if (!canonical) problems.push(`${where}: missing canonical`);
  else if (!where.startsWith('404') && new URL(canonical).pathname.replace(/\/$/, '') !== url.replace(/\/$/, ''))
    problems.push(`${where}: canonical ${canonical} does not match ${url}`);
  for (const p of ['og:title', 'og:description', 'og:url', 'og:image'])
    if (!html.includes(`property="${p}"`)) problems.push(`${where}: missing ${p}`);
  if (title) titles.set(title, [...(titles.get(title) ?? []), where]);
  if (desc) descs.set(desc, [...(descs.get(desc) ?? []), where]);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      problems.push(`${where}: invalid JSON-LD`);
    }
  }
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith('//') || href.startsWith('/_astro/')) continue;
    if (!resolveLink(href)) problems.push(`${where}: broken link ${href}`);
  }
  for (const m of html.matchAll(/src="(\/[^"]*)"/g)) {
    if (!existsSync(join(DIST, m[1].split('?')[0]))) problems.push(`${where}: missing asset ${m[1]}`);
  }
}

for (const [t, where] of titles) if (where.length > 1) problems.push(`duplicate title "${t}": ${where.join(', ')}`);
for (const [d, where] of descs) if (where.length > 1) problems.push(`duplicate description: ${where.join(', ')}`);

const sitemapFile = files.find((f) => /sitemap-0\.xml$/.test(f));
const sitemapUrls = sitemapFile ? [...readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];
if (!sitemapUrls.length) problems.push('sitemap has no URLs');
if (sitemapUrls.some((u) => u.includes('/data/'))) problems.push('sitemap lists a data file');
// The game library must stay hidden: no page may mention it, link it or show its thumbnails.
// Scan markup + visible text only (inline <style>/<script> stripped, so minified CSS
// like #0000 or generated JS identifiers don't cause false positives).
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const noInline = html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
  for (const needle of ['library.json', '/thumbs/', 'vault', '_astro/panel'])
    if (noInline.includes(needle)) problems.push(`${relative(DIST, file)}: mentions hidden library ("${needle}")`);
  // The library-opening code must never appear as visible text.
  const text = noInline.replace(/<[^>]+>/g, ' ');
  if (/\b0000\b/.test(text)) problems.push(`${relative(DIST, file)}: shows the code 0000 in text`);
  for (const m of html.matchAll(/href="(\/_astro\/[^"]+\.css)"/g))
    if (readFileSync(join(DIST, m[1]), 'utf8').includes('.vl-')) problems.push(`${relative(DIST, file)}: links the hidden library's CSS`);
}
if (!existsSync(join(DIST, 'robots.txt'))) problems.push('robots.txt missing');

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const js = files.filter((f) => f.endsWith('.js'));
const css = files.filter((f) => f.endsWith('.css'));
const size = (list) => list.reduce((s, f) => s + statSync(f).size, 0);
const home = readFileSync(join(DIST, 'index.html'), 'utf8');
const homeJs = [...home.matchAll(/src="(\/_astro\/[^"]+\.js)"/g)].map((m) => join(DIST, m[1]));

console.log(`Pages: ${pages.length}   Sitemap URLs: ${sitemapUrls.length}`);
console.log(`JS total: ${kb(size(js))} in ${js.length} files   CSS total: ${kb(size(css))}`);
console.log(`Home page HTML: ${kb(Buffer.byteLength(home))}, entry scripts: ${homeJs.map((f) => `${relative(DIST, f)} ${kb(statSync(f).size)}`).join(', ') || 'none'}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log('\nAll checks passed.');
