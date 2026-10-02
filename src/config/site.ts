// Brand + site settings. Change the name, URL or contact details here and
// every page, meta tag, sitemap entry and the logo wordmark picks it up.
//
// The public origin (canonical URLs, Open Graph, sitemap, robots.txt) comes
// from the PUBLIC_SITE_URL environment variable at build time. Set it in
// Netlify (Site settings -> Environment variables) or netlify.toml, e.g.
// PUBLIC_SITE_URL="https://kaleidoscopic-fox-723dcb.netlify.app"
// The placeholder below is only a fallback so local builds never crash;
// never deploy to production with the fallback in place.
//
// Note: astro.config.ts runs in plain Node, where import.meta.env is not
// populated yet, so we read process.env first (safe in the browser too,
// where `process` is undefined and the build replaces import.meta.env).
const nodeEnvUrl = typeof process !== 'undefined' ? process.env.PUBLIC_SITE_URL : undefined;
const viteEnvUrl = import.meta.env.PUBLIC_SITE_URL as string | undefined;
const envUrl = (nodeEnvUrl ?? viteEnvUrl)?.trim().replace(/\/+$/, '');

export const SITE = {
  name: 'SolveCalc Hub',
  tagline: 'Calculate, understand, practice, play.',
  description:
    'Free math calculators with worked steps, short lessons, practice quizzes and a library of browser games.',
  // Public origin used for canonical URLs, Open Graph and the sitemap.
  url: envUrl || 'https://solvecalc-hub.example',
  locale: 'en_US',
  lang: 'en',
  // Left blank on purpose: the contact page shows this address only when it is set.
  contactEmail: '',
  // Default byline shown on blog posts ("By <authorName>") and used as the
  // Person author in BlogPosting JSON-LD. Set your real name for E-E-A-T;
  // any post can override it with its own `author:` frontmatter field.
  authorName: 'Aditya Verma',
  // Hex values used by the manifest/theme-color meta; the full palette lives in styles/tokens.css.
  themeColor: '#15202e',
} as const;

// Social links shown in the footer. Add your own real profile URLs here and
// they appear automatically; while the list is empty, no icons are shown.
// e.g. { network: 'instagram', href: 'https://instagram.com/yourhandle' }
export const SOCIAL: { network: 'instagram' | 'tiktok' | 'youtube' | 'x'; href: string }[] = [];
