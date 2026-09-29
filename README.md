# Calcora

Math calculators, lessons, quizzes and a browser-games directory, built as a static
[Astro](https://astro.build) site. Calculate → understand → practice → play.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321 (syncs the game data first)
npm run build      # static site in dist/ (syncs the game data first)
npm run preview    # serve dist/
npm test           # unit tests (math engine, game data rules, search)
npm run check      # after a build: H1s, titles, canonicals, JSON-LD, links, sitemap
npm run games:validate   # full report on the scraped games dataset
```

Needs Node 22.12+ (tests use Node's built-in TypeScript support, Node 23.6+).

## Folder structure

```
calcora/
├─ scripts/
│  ├─ sync-games.mjs        games.json → src/generated/games.json + public/thumbs/
│  ├─ validate-games.mjs    validation report (also compares games.csv)
│  ├─ check-site.mjs        SEO/link checks on dist/
│  └─ lib/                  shared validation rules + source path
├─ src/
│  ├─ config/               site.ts (brand, URL, contact), nav.ts, featured-games.ts
│  ├─ data/
│  │  ├─ calculators.ts     calculator registry (titles, meta, related links)
│  │  ├─ topics.ts          topics that link calculators ↔ lessons ↔ quizzes ↔ games
│  │  ├─ calculator-content/<slug>.json   formula, example, mistakes, FAQ per calculator
│  │  └─ quizzes/<topic>.json             quiz questions
│  ├─ content/
│  │  ├─ articles/<slug>.md               articles
│  │  └─ learn/<topic>.md                 lessons
│  ├─ content.config.ts     schemas for all of the above (build fails on bad data)
│  ├─ components/           Header, Footer, Breadcrumbs, RelatedTools, TopicPath, …
│  │  ├─ calc/              CalculatorShell, InputField, ResultCard, FormulaBlock,
│  │  │                     StepByStep, ExampleBox, FAQSection, Segmented,
│  │  │                     ScientificCalculator
│  │  └─ games/GameCard.astro
│  ├─ layouts/              BaseLayout (SEO head), CalculatorLayout (page template)
│  ├─ lib/
│  │  ├─ math/              expression parser, fractions, linear, quadratic, stats, units
│  │  └─ games/             types, build-time data access, browser loader + search
│  ├─ scripts/              browser code: scientific calculator + Code Mode, calc forms,
│  │                        games directory, player, quiz
│  ├─ pages/                routes (see below)
│  └─ styles/               global.css (design tokens), sci/calc/games/quiz CSS
└─ tests/
```

Routes: `/`, `/calculators` + 15 calculators, `/learn` + 6 lessons, `/quizzes` + 11
quizzes, `/articles` + 25 guides, `/blog` + posts, `/games` + 8 math games, `/about`,
`/contact`, `/404`, `/robots.txt`, `/sitemap-index.xml`.

The friendly mascot is `src/components/Mascot.astro` (inline SVG "Cal", animated,
reduced-motion aware). The header's "Learn" dropdown is configured in
`src/config/nav.ts`.

## Game data

The source of truth is the scraped `games.json` in `../calcsolver/` (next to this
folder). Point somewhere else with `GAMES_SOURCE=/path/to/folder npm run build`.

1. `scripts/sync-games.mjs` runs before `dev` and `build`. It validates every record
   (see `scripts/lib/games-validate.mjs`), drops unusable ones, and writes
   `src/generated/games.json` with `{ code, name, category, url, mirrors[], thumb }`.
   `url` is the first usable https link (`url`, then `url_s1..3`); the rest become
   `mirrors`. Thumbnails from `thumb_file` are copied to `public/thumbs/`; files over
   60 KB are shrunk to 320 px WebP when `cwebp` is installed.
2. Pages that need the data at build time (counts, categories, first page of the
   directory, featured games) import it through `src/lib/games/data.ts`.
3. The browser fetches the same data from `/data/games.json` (`src/lib/games/client.ts`),
   once, and only when it is needed (the directory, the player, or a Code Mode lookup).

Validation rules: codes must be unique and made of letters, digits or dashes; `0000` is
reserved; names are required; only `https:` URLs are accepted (anything else,
including `javascript:` and `data:`, is dropped); missing thumbnails get a placeholder.

**To update the games:** re-run the scraper (`../calcsolver/scrape.py --thumbs`), then
`npm run games:validate` to review the report and `npm run build`. Nothing else holds a
copy of the game list; counts and categories are recomputed from the data.

## Code Mode

The scientific calculator (home page and `/calculators/scientific`) has a **Code Mode**
switch. When it is on:

- the display becomes four code cells and only digits, ⌫, AC and = stay active;
- after the 4th digit the code is looked up:
  - `0000` opens `/games` (the full directory),
  - a code found in the game data opens `/games/play?code=XXXX`,
  - anything else shows "Game not found. Check the 4-digit code." and the next digit
    starts a new try;
- ⌫ deletes a digit, AC or Delete clears, Esc (or the switch) leaves Code Mode.

The normal expression, result and history are left untouched, so switching back shows
exactly what was there. The code is set in `src/scripts/scientific.ts` (`DIRECTORY_CODE`).

Games whose code is not 4 digits (one in the current data, `gta-vice-city`) are listed
in the directory and playable, but can't be typed in Code Mode.

## Game player

`/games/play?code=XXXX` looks up the code and loads the game's URL in an iframe with
`sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock
allow-orientation-lock allow-modals"` (no top navigation, no pop-ups). Mirrors appear
as Server 1/2/3 buttons, and every game has an "Open in new tab" link. The page is
`noindex` and left out of the sitemap: there are no per-game pages, because the data
has nothing unique to say about each game.

## How to add a calculator

1. Add an entry to `src/data/calculators.ts` (slug, name, title, description, topic,
   glyph, related calculators and articles).
2. Write `src/data/calculator-content/<slug>.json` (intro, formula, howItWorks,
   example, mistakes, faqs); the schema in `src/content.config.ts` checks it.
3. Create `src/pages/calculators/<slug>.astro`:

   ```astro
   ---
   import CalculatorLayout from '../../layouts/CalculatorLayout.astro';
   import CalculatorShell from '../../components/calc/CalculatorShell.astro';
   import InputField from '../../components/calc/InputField.astro';
   ---
   <CalculatorLayout slug="my-calc">
     <CalculatorShell id="my-form">
       <InputField name="x" label="Number" />
     </CalculatorShell>
   </CalculatorLayout>
   <script>
     import { mountForm } from '../../scripts/calc-form.ts';
     mountForm(document.getElementById('my-form') as HTMLFormElement, (r) => {
       const x = r.num('x', 'a number');
       return { lines: [{ label: 'Double', value: String(x * 2), primary: true }], steps: [`${x} × 2`] };
     });
   </script>
   ```

   `mountForm` handles live results, validation messages, mode switching
   (`data-when="mode:a|b"`), steps, reset and copy.

## How to add a blog post

Create `src/content/blog/<slug>.md`:

```md
---
title: "How to Revise Fast"
description: "Max 160 characters."
category: study-tips        # study-tips | math-basics | for-parents
published: 2026-10-01
emoji: "⚡"                  # drawn on the cover tile (no image files)
tone: blue                  # blue | hi | green | ink | red | lcd
calculators: [scientific]   # optional
articles: [order-of-operations]  # optional
related: [mental-math-tricks]    # other blog slugs, optional
---
Intro paragraph. Use ## and ### headings (the page supplies the H1).
```

It appears on `/blog`, grouped by category, in the sitemap, and in the "From the
blog" strip on the home page. Categories and their colours live in
`src/data/blog.ts`.

## How to add an article

Create `src/content/articles/<slug>.md`:

```md
---
title: "How to Round Numbers"
description: "Max 160 characters."
topic: arithmetic        # arithmetic | fractions | algebra | geometry | statistics | probability | trigonometry
published: 2026-10-01
calculators: [scientific]
quiz: arithmetic         # optional
related: [how-to-calculate-a-percentage]
---
Intro paragraph. Use ## and ### headings (the page supplies the H1).
```

It appears on `/articles`, in the sitemap, and wherever a calculator lists it in
`articles`.

## How to add a quiz

Create `src/data/quizzes/<topic>.json` with `title`, `description`, `topic` and a
`questions` array of `{ id, question, options: [4 strings], answer: 0-3, explanation }`.
Set `quiz: true` on the topic in `src/data/topics.ts` so other pages link to it.
Progress is stored in the browser under `calcora:quiz:<topic>`.

## Brand

Name, tagline, site URL, contact email and theme colour live in `src/config/site.ts`.
Colours and fonts are CSS variables at the top of `src/styles/global.css`. The logo is
`src/components/Logo.astro` (and `public/favicon.svg`); the social image is
`public/og.png`. Set `SITE.url` to the real domain before deploying so canonical URLs
and the sitemap are correct.
