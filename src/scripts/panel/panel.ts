// The hidden game library. There is no page or link for it: it is built here,
// on demand, as a full-screen layer over the current page when Code Mode gets
// 0000 (the whole library) or a library game's code (that game). This module
// and its CSS are one separate chunk that only loads at that moment; the CSS
// is inlined here (not linked) so no page's HTML refers to it.
import css from './panel.css?inline';
import { loadGames, searchGames, type Game } from '../../lib/games/client.ts';
import { categoryLabel, initials, safeGameUrl } from '../../lib/games/types.ts';

const PAGE = 60;
const SLOW_MS = 12000;
const FAV_KEY = 'calcora:lib:favs';
const FAVS = '__favs__';
// No allow-top-navigation (a game can't redirect the page) and no allow-popups.
const SANDBOX = 'allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-orientation-lock allow-modals';

interface OpenOptions {
  code?: string;
  returnFocus?: HTMLElement | null;
}

let ui: ReturnType<typeof build> | null = null;

export function openVault(opts: OpenOptions = {}) {
  ui ??= build();
  ui.open(opts);
}

// ── small DOM helper ───────────────────────────────────────────
function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...kids: (Node | string)[]) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else el.setAttribute(k, v);
  }
  el.append(...kids);
  return el;
}

function readFavs(): Set<string> {
  try {
    const v = JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]');
    return new Set(Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}
function writeFavs(f: Set<string>) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...f]));
  } catch {
    /* storage blocked */
  }
}

function build() {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  // ── markup ──
  const search = h('input', { type: 'search', class: 'vl-search', placeholder: 'Search by name, category or code', 'aria-label': 'Search games', autocomplete: 'off', spellcheck: 'false' });
  const favBtn = h('button', { type: 'button', class: 'vl-btn', 'aria-pressed': 'false', title: 'Favorites' }, '♥ ', h('span', {}, '0'));
  const exitBtn = h('button', { type: 'button', class: 'vl-btn vl-exit' }, '✕ Exit');
  const count = h('span', { class: 'vl-count' });
  const gridBar = h('div', { class: 'vl-bar-row' }, count, h('div', { class: 'vl-search-wrap' }, search), favBtn, exitBtn);

  const backBtn = h('button', { type: 'button', class: 'vl-btn' }, '← All games');
  const title = h('span', { class: 'vl-title' });
  const servers = h('div', { class: 'vl-servers', role: 'group', 'aria-label': 'Server' });
  const fsBtn = h('button', { type: 'button', class: 'vl-btn' }, 'Fullscreen');
  const reloadBtn = h('button', { type: 'button', class: 'vl-btn' }, 'Reload');
  const tabLink = h('a', { class: 'vl-btn', target: '_blank', rel: 'noopener noreferrer' }, 'New tab');
  const playFav = h('button', { type: 'button', class: 'vl-btn', 'aria-pressed': 'false' }, '♥');
  const exitBtn2 = h('button', { type: 'button', class: 'vl-btn vl-exit' }, '✕ Exit');
  const playBar = h('div', { class: 'vl-bar-row' }, backBtn, title, servers, h('div', { class: 'vl-tools' }, playFav, fsBtn, reloadBtn, tabLink, exitBtn2));
  playBar.hidden = true;

  const cats = h('div', { class: 'vl-cats', role: 'group', 'aria-label': 'Categories' });
  const status = h('p', { class: 'vl-status', 'aria-live': 'polite' }, 'Loading…');
  const grid = h('ul', { class: 'vl-grid' });
  const more = h('div', { class: 'vl-sentinel', 'aria-hidden': 'true' });
  const empty = h('div', { class: 'vl-empty' });
  empty.hidden = true;
  const gridWrap = h('div', { class: 'vl-scroll' }, cats, status, grid, more, empty);

  const overlayText = h('p', {}, 'Loading…');
  const slow = h('p', { class: 'vl-slow' }, 'Still loading. Big games can take a minute, or try another server or a new tab.');
  const loading = h('div', { class: 'vl-loading' }, overlayText, slow);
  const stage = h('div', { class: 'vl-stage' }, loading);
  stage.hidden = true;

  const root = h('div', { class: 'vl', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Library' }, h('div', { class: 'vl-bar' }, gridBar, playBar), gridWrap, stage);
  root.hidden = true;
  document.body.append(root);

  // ── state ──
  let games: Game[] = [];
  let results: Game[] = [];
  let shown = 0;
  let query = '';
  let cat = '';
  let favs = readFavs();
  let current: Game | null = null;
  let urls: string[] = [];
  let server = 0;
  let frame: HTMLIFrameElement | null = null;
  let slowTimer: ReturnType<typeof setTimeout> | undefined;
  let isOpen = false;
  let depth = 0;
  let ignorePop = false;
  let returnFocus: HTMLElement | null = null;
  let inerted: Element[] = [];

  // ── grid ──
  function renderCats() {
    const counts = new Map<string, number>();
    for (const g of games) counts.set(g.category, (counts.get(g.category) ?? 0) + 1);
    const chip = (id: string, label: string, n: number) => {
      const b = h('button', { type: 'button', class: 'vl-chip', 'aria-pressed': String(cat === id) }, `${label} `, h('span', {}, String(n)));
      b.addEventListener('click', () => {
        cat = cat === id && id ? '' : id;
        renderCats();
        renderGrid();
        gridWrap.scrollTop = 0;
      });
      return b;
    };
    cats.replaceChildren(
      chip('', 'All', games.length),
      chip(FAVS, '♥ Favorites', favs.size),
      ...[...counts].sort((a, b) => b[1] - a[1]).map(([id, n]) => chip(id, categoryLabel(id), n)),
    );
  }

  function card(g: Game) {
    const thumb = h('span', { class: 'vl-thumb' });
    if (g.thumb?.startsWith('/thumbs/')) {
      const img = h('img', { src: g.thumb, alt: '', width: '200', height: '200', loading: 'lazy', decoding: 'async' });
      img.addEventListener('error', () => thumb.replaceChildren(h('span', { class: 'vl-ph' }, initials(g.name))), { once: true });
      thumb.append(img);
    } else thumb.append(h('span', { class: 'vl-ph' }, initials(g.name)));
    const open = h('button', { type: 'button', class: 'vl-card' }, thumb, h('span', { class: 'vl-name' }, g.name), h('span', { class: 'vl-meta' }, h('span', { class: 'vl-code' }, g.code), categoryLabel(g.category)));
    open.addEventListener('click', () => play(g));
    const fav = h('button', { type: 'button', class: 'vl-fav', 'aria-pressed': String(favs.has(g.code)), 'aria-label': `Favorite ${g.name}` }, '♥');
    fav.addEventListener('click', () => {
      toggleFav(g.code);
      fav.setAttribute('aria-pressed', String(favs.has(g.code)));
    });
    return h('li', { class: 'vl-item' }, open, fav);
  }

  function renderGrid() {
    const pool = cat === FAVS ? games.filter((g) => favs.has(g.code)) : games;
    results = searchGames(pool, query, cat === FAVS ? '' : cat);
    grid.replaceChildren();
    shown = 0;
    empty.hidden = results.length > 0;
    if (!results.length) {
      empty.replaceChildren(h('p', {}, cat === FAVS && !query ? 'No favorites yet. Tap ♥ on a game to keep it here.' : `Nothing matches “${query}”.`));
      status.textContent = '';
      return;
    }
    appendPage();
  }

  function appendPage() {
    const next = results.slice(shown, shown + PAGE);
    grid.append(...next.map(card));
    shown += next.length;
    status.textContent = query ? `${results.length} match “${query}”` : `${results.length} games`;
  }

  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting) && shown < results.length) appendPage();
  }, { root: gridWrap, rootMargin: '900px 0px' });
  io.observe(more);

  search.addEventListener('input', () => {
    query = search.value.trim();
    if (games.length) renderGrid();
    gridWrap.scrollTop = 0;
  });

  function toggleFav(code: string) {
    if (favs.has(code)) favs.delete(code);
    else favs.add(code);
    writeFavs(favs);
    favBtn.querySelector('span')!.textContent = String(favs.size);
    if (current?.code === code) playFav.setAttribute('aria-pressed', String(favs.has(code)));
    renderCats();
  }
  favBtn.addEventListener('click', () => {
    cat = cat === FAVS ? '' : FAVS;
    favBtn.setAttribute('aria-pressed', String(cat === FAVS));
    renderCats();
    renderGrid();
  });

  // ── player ──
  function load(i: number) {
    server = i;
    const url = urls[i];
    tabLink.setAttribute('href', url);
    servers.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    frame?.remove();
    clearTimeout(slowTimer);
    loading.hidden = false;
    slow.hidden = true;
    overlayText.textContent = `Loading ${current!.name}…`;
    const f = document.createElement('iframe');
    f.title = current!.name;
    f.setAttribute('sandbox', SANDBOX);
    f.allow = 'fullscreen; autoplay; gamepad; clipboard-write';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.addEventListener('load', () => {
      clearTimeout(slowTimer);
      loading.hidden = true;
      f.focus();
    });
    f.src = url;
    stage.prepend(f);
    frame = f;
    slowTimer = setTimeout(() => (slow.hidden = false), SLOW_MS);
  }

  function play(g: Game, push = true) {
    urls = [g.url, ...g.mirrors].map(safeGameUrl).filter((u): u is string => Boolean(u));
    if (!urls.length) return;
    current = g;
    title.replaceChildren(h('b', {}, g.name), h('span', { class: 'vl-code' }, g.code));
    playFav.setAttribute('aria-pressed', String(favs.has(g.code)));
    playFav.setAttribute('aria-label', `Favorite ${g.name}`);
    servers.replaceChildren(
      ...urls.map((u, i) => {
        const b = h('button', { type: 'button', class: 'vl-chip', title: new URL(u).hostname }, `Server ${i + 1}`);
        b.addEventListener('click', () => i !== server && load(i));
        return b;
      }),
    );
    servers.hidden = urls.length < 2;
    gridBar.hidden = true;
    gridWrap.hidden = true;
    playBar.hidden = false;
    stage.hidden = false;
    if (push) pushLayer('play');
    load(0);
  }

  function showGrid() {
    frame?.remove();
    frame = null;
    clearTimeout(slowTimer);
    current = null;
    stage.hidden = true;
    playBar.hidden = true;
    gridBar.hidden = false;
    gridWrap.hidden = false;
    search.focus({ preventScroll: true });
  }

  backBtn.addEventListener('click', () => history.back());
  reloadBtn.addEventListener('click', () => load(server));
  playFav.addEventListener('click', () => current && toggleFav(current.code));
  fsBtn.addEventListener('click', () => {
    stage.requestFullscreen?.().catch(() => {});
    frame?.focus();
  });

  // ── open / close, with the Back button stepping out of the layer ──
  function pushLayer(kind: string) {
    history.pushState({ vl: kind }, '', location.href);
    depth++;
  }

  window.addEventListener('popstate', () => {
    if (!isOpen) return;
    if (ignorePop) {
      ignorePop = false;
      return;
    }
    depth = Math.max(0, depth - 1);
    if (!stage.hidden) showGrid();
    else close(false);
  });

  function close(unwind = true) {
    isOpen = false;
    frame?.remove();
    frame = null;
    clearTimeout(slowTimer);
    root.hidden = true;
    document.documentElement.classList.remove('vl-open');
    inerted.forEach((el) => el.removeAttribute('inert'));
    inerted = [];
    if (unwind && depth > 0) {
      ignorePop = true;
      history.go(-depth);
    }
    depth = 0;
    returnFocus?.focus({ preventScroll: true });
  }
  exitBtn.addEventListener('click', () => close());
  exitBtn2.addEventListener('click', () => close());

  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    if (document.fullscreenElement) return;
    if (!stage.hidden) history.back();
    else if (search.value) {
      search.value = '';
      search.dispatchEvent(new Event('input'));
    } else close();
  });

  async function open(opts: OpenOptions) {
    returnFocus = opts.returnFocus ?? null;
    if (!isOpen) {
      isOpen = true;
      root.hidden = false;
      document.documentElement.classList.add('vl-open');
      inerted = [...document.body.children].filter((el) => el !== root && !el.hasAttribute('inert'));
      inerted.forEach((el) => el.setAttribute('inert', ''));
      pushLayer('grid');
    }
    showGrid();
    try {
      const data = await loadGames();
      if (!games.length) {
        games = [...data.games].sort((a, b) => a.name.localeCompare(b.name));
        count.textContent = String(games.length);
        favs = new Set([...readFavs()].filter((c) => games.some((g) => g.code === c)));
        favBtn.querySelector('span')!.textContent = String(favs.size);
        renderCats();
        renderGrid();
      }
      const target = opts.code ? games.find((g) => g.code === opts.code) : undefined;
      if (target) play(target);
    } catch {
      status.textContent = "Couldn't load the list. Check your connection.";
      const retry = h('button', { type: 'button', class: 'vl-btn' }, 'Try again');
      retry.addEventListener('click', () => open({ ...opts, returnFocus }));
      empty.replaceChildren(retry);
      empty.hidden = false;
    }
  }

  return { open };
}
